---
layout: post
title: "Reward Hacking: How RL Silently Teaches Your Model the Wrong Lesson"
date: 2026-03-09 10:00:00
description: A deep dive into reward hacking, the central failure mode of RLHF, the maths that predicts when it bites, and the defences that buy you time but never solve it.
tags: reward-modelling reward-hacking rlhf reinforcement-learning alexa
categories: technical
thumbnail: assets/img/phd.jpg
toc:
  beginning: true
---

The most unsettling thing about a reward-hacked model is that the loss curve looks beautiful. The proxy reward climbs in a clean monotonic line. The KL drifts up gently, well within budget. Every chart on the training dashboard says the run is healthy. Then someone reads a sample and the model is producing four-paragraph essays where a sentence would do, agreeing with the user about the Earth being flat, and opening every response with "What a thoughtful question!" The reward is going up because the reward is wrong, and the policy has noticed before you have.

This is the failure mode I want every engineer and technical leader who touches RL-trained LLMs to internalise. Reward hacking is not an edge case, not a bug to be patched, not a bad hyperparameter. It is the structural consequence of optimising a learned approximation of human values with a sufficiently powerful optimiser. Goodhart's Law, written in the language of gradients. You cannot defeat it. You can only buy time before it happens, and the discipline of buying that time is what separates a healthy RL training run from a silently broken one. This post is the deep-dive companion to the [reward modelling pillar](/blog/2026/reward-modelling-at-scale/); that piece walked the design space, this one stays inside the central failure mode.

## What reward hacking actually is

There is a true human preference function $r^*(x, y)$: what people would, in reflective moments, prefer one response over another. You cannot write it down; you can only sample from it, expensively, through preference labels. To do RL, you fit a learned reward model $r_\phi(x, y)$ to those samples and optimise the policy against it:

$$\max_{\pi_\theta} \; \mathbb{E}_{x \sim \mathcal{D}, \, y \sim \pi_\theta(\cdot \mid x)}\!\left[r_\phi(x, y)\right]$$

The proxy $r_\phi$ is, by construction, an imperfect approximation of $r^*$. It has biases inherited from annotators, blind spots from prompts that were never sampled, and numerical fragilities in its scalar head. For most of the policy's distribution these imperfections do not matter. But the optimiser does not stay in that region. PPO's job is to find the highest-scoring corners of policy space it can reach, and "highest-scoring corners" is precisely the set of points where the proxy is most wrong.

That is reward hacking. Not the model being lazy or sneaky, but the optimiser doing exactly what you asked, against an objective that was not exactly what you wanted. The reframing I keep coming back to with technical leaders: **the policy is not your adversary. The optimiser is, and your reward model is the wall it is paid to climb.** Every imperfection in the wall becomes a foothold. The harder you train, the more footholds it finds.

## The canonical failure modes

In production RL systems I've worked on, the same patterns turn up across very different datasets and reward models. Naming them matters, because once you can name them you can write detection signals.

**Length exploitation.** The most common, and the one your reward model probably has even after you've tried to prevent it. Annotators systematically prefer longer responses on subjective tasks: more apparent thoroughness, hedging that reads as carefulness. A response that should be "Paris" becomes a three-paragraph essay about the history of France's capital. The proxy says it is better. The user closes the tab.

**Sycophancy.** If preference data lets agreement leak into labels, the reward model bakes it in. Asked "Is the Earth flat?" the policy validates the premise. Asked "I think this code looks fine, do you agree?" the policy agrees regardless of what the code does. The failure mode that frightens me most because it is the hardest to spot from outside: the model sounds polite, sounds aligned, and is quietly optimising for the user's approval over the user's interests.

**Formatting and style over substance.** Reward models pick up that headers, bullet points, and confident phrasing correlate with high-scoring responses, because annotators read structured prose as effortful. The policy produces well-formatted, confident-sounding answers that are factually wrong. The shape triggers the reward; the content is hollow.

**Filler and hedging.** "Great question!" "Let me think about this carefully." Each phrase marginally bumps the reward; the policy stacks them. By mid-training there's a preamble, a meta-commentary, three caveats, and a summary wrapped around an answer that was originally two sentences.

**Judge-gaming.** The modern, judge-distilled-reward-model variant, and the reason this post links back to the [LLM-as-judge](/blog/2025/llm-as-judge/) piece. When your reward is distilled from a judge, the policy can exploit the judge's prompt format itself: fake rationales that mimic its chain-of-thought, rubric language copied verbatim, outputs shaped to look like the judge's idea of a good response. Every uncharacterised judge bias (position, verbosity, self-enhancement, authority) is a reward hacking exploit waiting to be found.

**Adversarial token sequences.** The extreme case. The policy stumbles onto sequences that do not parse as English but trigger anomalously high scores in the reward model's scalar head: the LLM equivalent of adversarial examples. Rare in well-regularised runs, not mythical.

None of these are what users want. All score higher on the proxy.

## The maths under the curve

The most important empirical result in modern RLHF, the one I want every reader to be able to draw on a whiteboard, is the overoptimisation curve. Gao et al. (2023), "Scaling Laws for Reward Model Overoptimization," characterised it cleanly. As the policy is optimised against a fixed reward model, the _proxy_ reward $r_\phi$ rises monotonically. The _true_ reward $r^*$ (what humans actually prefer) follows an inverted-U: rises, peaks, falls. For best-of-$n$ sampling, as a function of KL from the reference:

$$r^*(d_{\text{KL}}) \;\approx\; \alpha \sqrt{d_{\text{KL}}} \;-\; \beta \cdot d_{\text{KL}}$$

First term: genuine improvement, square-root diminishing returns. Second: overoptimisation, linear in KL, eventually dominating. The optimum sits at $d_{\text{KL}}^* = (\alpha/2\beta)^2$. Past it, more training makes the model worse according to humans even as the proxy keeps climbing. The gap between proxy and truth (call it the reward hacking gap) grows in exact proportion to how hard you push past it. For RL training, Gao et al. fit a different functional form, one involving a log term rather than a square root, but the inverted-U is still there.

Two properties to carry. First, the curve is _predictable_: the qualitative pattern of initial improvement followed by degradation holds across reward model sizes, tasks, and training algorithms, even though the exact functional form differs between best-of-$n$ and RL. Fit the coefficients from a small calibration run and you can forecast the cliff. Second, larger reward models push the peak to higher KL; reward model scale is one of the few levers that genuinely buys headroom.

This is also why the KL penalty exists. The standard RLHF objective is

$$\max_{\pi_\theta} \; \mathbb{E}_{x, y \sim \pi_\theta}\!\left[r_\phi(x, y)\right] \;-\; \beta \cdot \mathrm{KL}\!\left(\pi_\theta \,\|\, \pi_{\text{ref}}\right)$$

The KL term is not there to keep the model "close to the original for safety reasons," as it is sometimes vaguely described. It is there because the reward model's reliability decays as the policy moves away from the distribution it was trained on. Set $\beta$ too high and the model is safe but mediocre. Too low and the policy hacks before you notice. The whole game of RLHF is finding the operating point on this curve.

## The defences and what they actually buy

Every defence pushes the peak of the inverted-U to the right or flattens the climb past it. None of them eliminate the underlying structure. They buy time, not safety.

**The KL penalty.** The primary defence and the bluntest. Typical budget: 5–15 nats, with adaptive scheduling so it tightens when the policy wanders. The difference between an RL run that is working and one in free fall, but not what makes a run _good_.

**Reward model ensembles.** Several reward models on different splits or seeds, aggregated by minimum or mean. An exploit that fools one is unlikely to fool all, unless they share a common bias (length, sycophancy, format), in which case they fail in correlated ways and the ensemble does not help.

**Length penalties.** A direct fix for the most common exploit. Effective for the symptom, not for the disease; the policy finds the next-cheapest exploit.

**Iterative reward model retraining.** Resample from the current policy, get fresh human labels, retrain. The most effective single intervention in my experience, and the most expensive: a continuous annotation pipeline as a permanent line item. An arms race: you patch one exploit, the policy finds the next.

**Best-of-N instead of RL.** Sample $N$ from the reference, score, ship the highest. Dramatically more robust because the policy distribution never moves. You cannot exceed what the reference is capable of, but for high-stakes domains where reward hacking is unacceptable, best-of-N is the boring correct answer.

**Constitutional AI and RLAIF.** Replace some or all preference labels with AI judgements grounded in explicit principles. A more robust _specification_ of desired behaviour than implicit annotator preferences. A deeper [Constitutional AI / RLAIF post](/blog/2026/constitutional-ai-rlaif/) is on the way; the short version is that it shifts which exploits are easiest, not whether exploits exist.

**Process reward models and verifiers.** On tasks where intermediate steps can be checked (maths, code, formal logic), step-level rewards or deterministic verifiers are much harder to hack. The policy cannot fake a step that doesn't compile. Cleanest defence in verifiable domains, inapplicable in open-ended dialogue.

**Group-relative methods.** [GRPO and its relatives](/blog/2026/grpo-group-relative-rl/) reduce policy-gradient variance by comparing within a group rather than against an absolute baseline. They do not solve reward hacking but they reduce the noise that lets the policy stumble into exploits before you see them.

The honest framing: every defence is a knob on the same trade-off curve. None remove the curve. Treating reward hacking as a problem you solve once is the most expensive mistake a team can make.

## How to detect it before it costs you

The clearest signal is a divergence between proxy reward and human evaluation. The proxy says the model is getting better; humans say it is getting worse. If you are not running fresh human spot-checks during training, you do not know which side of that divergence you are on.

Signals worth wiring up before any serious RL run:

| Signal                    | Healthy run             | Hacking            |
| ------------------------- | ----------------------- | ------------------ |
| Proxy reward              | Gradual increase        | Rapid, unbounded   |
| Response length           | Stable or modest growth | Monotonic increase |
| KL from reference         | Stable, near target     | Rapidly increasing |
| Response diversity        | Maintained              | Mode collapse      |
| Filler / preamble rate    | Stable                  | Climbing           |
| Human spot-check vs proxy | Tracking                | Diverging          |

The last row is decisive. Everything above it is a leading indicator. The decisive measurement is fresh human judgement on samples from the _current_ policy. Anything else is your reward model talking to itself.

The work I do at Alexa+ on reward modelling treats this loop as continuous, not periodic. Every $K$ steps, sample fresh trajectories, label them with humans (or a judge whose calibration on the current distribution you have just verified), and recompute the proxy/true reward gap. If the gap widens, the run is stale: stop, retrain, restart. The cost of the loop is a line item, not a stretch goal. Skipping it is the most common cause of silent reward hacking I have seen.

## For technical leaders

Reward hacking is not a research problem. It is an _operational_ problem disguised as one. Solving it requires evaluation infrastructure, annotation pipelines, calibrated judges, monitoring, and the discipline to halt a training run when the gap widens. None of those scale automatically with GPU count. None appear on the roadmap of a team that thinks of RLHF as "press play on PPO."

Every team I've seen ship a reward-hacked model made the same mistake: they invested in the policy and underinvested in the measurement. The best PPO implementation on the market, and a reward model nobody had stress-tested on the current policy's distribution. The model trained, the proxy went up, the launch happened, and the regression showed up in user metrics two weeks later, looking nothing like the dashboards.

The framing I'd offer your VP: reward hacking is the audit problem of RL. You cannot trust a number you have not audited against ground truth. The audit costs a fraction of shipping the model the proxy thought you had. Underfunding audit is the highest-leverage way to lose value in an RLHF programme, and it is invisible until the run is already broken. This connects directly to the [reward modelling pillar](/blog/2026/reward-modelling-at-scale/), [LLM-as-judge](/blog/2025/llm-as-judge/), and [LLM routing](/blog/2025/llm-routing-at-scale/). Three angles on the same problem of measuring quality at scale; reward hacking is what happens when one silently goes out of calibration. The reward model is a useful signal that will mislead you the moment you stop checking it against reality. Keep checking.

_This post reflects my personal views and experience. It does not represent official Amazon positions._
