---
layout: post
title: "Constitutional AI and RLAIF: What's Actually Working"
date: 2026-07-13 10:00:00
description: An honest look at AI feedback for alignment — Anthropic's Constitutional AI recipe, the broader RLAIF spectrum, what's deployed in production, and the failure modes that don't show up in the marketing.
tags: rlaif constitutional-ai alignment reward-modeling alexa
categories: technical
toc:
  beginning: true
---

The cheapest way to start a fight in the alignment community is to ask whether AI feedback is real progress or a sleight of hand. Half the room will tell you Constitutional AI saved RLHF from drowning in annotation cost; the other half will tell you it replaced one set of biases with a more confident set, dressed up in a written document. Neither half is entirely wrong. AI feedback works in production today, it works for specific reasons, and most of those reasons have very little to do with the constitution itself.

This is a child of the [reward modelling pillar](/blog/2026/reward-modelling-at-scale/) and the [LLM-as-judge pillar](/blog/2025/llm-as-judge/) — judges become reward signals, and the constitution is one structured way to elicit those signals.

## The alignment data bottleneck

Modern post-training rests on pairwise preference labels. Pretraining tells the model what people have written; SFT tells it what to do when asked nicely; preference data tells it which of two responses a person would actually prefer. That third signal is the only one encoding anything resembling values, and it is the one we cannot scale.

Trained annotators produce tens of comparisons per hour. Frontier labs need millions, across dozens of languages and shifting policy distributions. Inter-annotator agreement caps at 70–80% on careful pipelines. As I argued in the [reward modelling pillar](/blog/2026/reward-modelling-at-scale/), every imperfection in the reward model becomes an attack surface for the optimiser, and annotators are where most of those imperfections enter.

AI feedback is the field's response. Replace human annotators with an LLM that reads the same rubric and produces labels at inference speed. The labels are self-consistent in a way no annotator pool will be. And the rubric is _written down_. With humans, the values are implicit. With AI feedback, the values are a document. That property is what gives Constitutional AI its name.

## What Constitutional AI actually is

Constitutional AI, as introduced by Bai et al. (2022), is a specific two-phase recipe. Most people use the term loosely to mean "any kind of AI feedback" — a conflation that is unhelpful for engineering decisions.

**Phase 1: Supervised Learning from AI Feedback (SL-CAI).** The model is prompted with red-teaming queries. A critic — often the same model — evaluates the response against a principle ("Choose the response that is less harmful or toxic") and produces a written critique. The model then revises in light of the critique. The (prompt, original, revised) triple becomes a supervised example, and the model is fine-tuned to produce the revised output directly. Multiple rounds, each sampling a different principle, layer in the full constitution.

**Phase 2: Reinforcement Learning from AI Feedback (RL-CAI).** The SL-CAI model generates response pairs. An AI judge — given both, the prompt, and a sampled principle — selects the better one. These labels train a Bradley-Terry reward model exactly as in standard RLHF. Then PPO with a KL penalty against the SL-CAI reference. The only thing that has changed is who labelled the preferences.

Writing the revision step as conditional sampling: given prompt $x$, response $y_0$, and principle $p \sim \mathcal{C}$, the critic produces $c \sim \pi_{\text{critic}}(\cdot \mid x, y_0, p)$ and the revisor produces

$$y_1 \sim \pi_{\text{revisor}}(\cdot \mid x, y_0, p, c).$$

The Phase 1 supervised objective is

$$\mathcal{L}_{\text{SL-CAI}} = -\mathbb{E}_{x \sim \mathcal{D}_{\text{red}}, \, p \sim \mathcal{C}} \left[\log \pi_\theta(y_1 \mid x)\right].$$

A few things in this recipe do more work than they get credit for. **Chain-of-thought judgement** measurably improves label quality, the same phenomenon I described in the [LLM-as-judge pillar](/blog/2025/llm-as-judge/). **Principle sampling frequency** implicitly weights trade-offs without anyone writing down a weight. And **the SL-CAI step itself** carries most of the apparent win in published comparisons — the RL phase tightens the policy, the SL phase moves it. Teams that skip Phase 1 tend to be disappointed.

## What RLAIF actually is

RLAIF is broader than CAI, and the broader term matters in production. Lee et al. (2023) framed it cleanly: the reward signal has to come from somewhere — humans, AI, or any blend. RLAIF is the spectrum where AI judgement is the primary source of preference labels.

At one end, every label from a human. At the other, every label from an AI judge. In the middle, every realistic mixture — humans labelling the hardest 5%, judges trained from human-labelled seed sets, pipelines where humans write the rubric and AI applies it. Lee et al.'s headline was that on summarisation and helpful-dialogue, RLAIF achieved roughly the same human preference win-rate as RLHF despite labels being entirely AI-generated.

That result aged well, with a qualifier on the tasks. RLAIF works where the judge is competitive with humans on the rubric. It works less well where the judge has blind spots: subtle factuality, long-horizon code, anything where the judge itself is miscalibrated. The fashionable framing is "AI feedback scales human values"; the engineering framing is "AI feedback scales whatever the judge happens to have learned, accurate or not."

| Component | RLHF | CAI | General RLAIF | Verifier-heavy (R1) |
|---|---|---|---|---|
| Preference source | Human | AI judge + constitution | AI judge (any rubric) | Verifier on ground truth |
| Calibration anchor | Annotator agreement | Human spot-check on judge | Human-labelled seed | Deterministic correctness |
| Label cost | High | Near-zero | Near-zero | Near-zero |
| Hackability | Annotator biases | Judge biases compounding | Judge biases compounding | Spec gaps |

The two ends are rarely deployed in pure form. The middle is where every production system lives.

## What's actually working in production

**Safety and harmlessness rubrics.** The strongest case for RLAIF. Safety principles are concrete enough to write down, narrow enough that a frontier judge agrees with human reviewers at high rates, and reducing human exposure to harmful content is itself a win. Anthropic's Claude work and Llama 3's safety RLHF both lean on this. The part of CAI that has clearly justified itself.

**Hybrid preference data on helpfulness.** Llama 3's reward model was trained on a mix of human and AI preferences. AI labels carry the volume; humans label a smaller subset for calibration.

**Judge-distilled reward models.** RLAIF in everything but name, and the sane default I described in the [reward modelling pillar](/blog/2026/reward-modelling-at-scale/). A strong judge labels a large preference set; a smaller reward model predicts those labels; the distilled model runs during PPO. Labels baked in once, so the live judge can drift without breaking the run.

**Verifiable rewards where they apply.** DeepSeek-R1 is the counter-example that proves the rule. On math and code, verifiable correctness plus a format hard floor outperformed judge-heavy alternatives.

**Panel-based RLAIF for agentic tasks.** Agentic systems have multiple quality axes — path correctness, response calibration, trajectory efficiency — and a single scalar collapses them. A [multi-judge panel](/blog/2026/multi-judge-ensembles/) preserves per-axis attribution after aggregation.

The unifying property is that the judge is _calibrated against humans on the policy's actual distribution_. AI feedback unvalidated against humans is judge biases compounding into a confident reward signal. The interesting question is not whether to use AI feedback — almost everyone does. It is what the calibration cadence is, and who funds it.

## The failure modes

**Constitution drift.** The constitution is a document; the judge is a model interpreting it. Both drift. A new judge version may interpret the same principle differently in ways not obvious until you re-run a calibration set. Version the constitution alongside the judge, treat changes as recalibration events, never compare runs across versions without re-baselining.

**Judge biases compounding.** A judge carries the biases catalogued in the [LLM-as-judge pillar](/blog/2025/llm-as-judge/) — position, verbosity, self-enhancement, authority, style. When the judge becomes a reward signal, every one becomes an exploit. Train against a verbosity-biased judge and the policy becomes verbose. Train against a sycophancy-prone judge and it becomes sycophantic — and you will not catch it until a human reads a sample. This is the constitution-gaming version of [reward hacking](/blog/2026/reward-hacking/): the policy is not your adversary, the optimiser is, and the judge is the wall it is paid to climb.

**Distribution shift on the judge's calibration.** The one I want every reader to leave with. An evaluation judge is calibrated on a fixed distribution. A reward judge is calibrated on a _moving_ one. Every gradient step pulls the policy further from where the judge was calibrated, and the judge becomes less reliable precisely when its outputs matter most. The Gao et al. (2023) overoptimisation curve applies cleanly with the judge in the role of the proxy — proxy keeps climbing, truth peaks and falls.

**Same-family blind spots.** If your judge is from the same family as your policy, they share blind spots. The judge's priors look like the policy's priors at exactly the points you needed an outside perspective. Mixing families is one of the cheapest improvements available, and one of the most under-deployed.

**The circularity problem.** When the model generating the data also judges it, there is no outside check. Any systematic bias is reinforced rather than corrected. The "scalable supervision" framing assumes the judge is more capable or trustworthy than the policy on the axis being judged. When that fails, you are scaling existing biases at the speed of inference. This motivates the [scalable oversight](/blog/) and [deliberative alignment](/blog/) research agendas, and it is the unsolved part of the field.

## Where verifiable rewards beat judge rewards

The most consequential design decision in modern post-training is whether to reach for a judge or a verifier. Verifiers map an output to a scalar deterministically — a unit test, an exact-match check, a schema validator. Judges map via another LLM. Verifiers are cheap, deterministic, and unhackable on the verifier itself; judges are expensive, stochastic, and hackable in the soft ways every documented LLM bias enables.

Where verifiers apply, they win. DeepSeek-R1 is the clearest recent demonstration. On math, code, and structured reasoning, the primary reward was verifiable correctness; the format reward was a hard floor; judges played a small or no role. A frontier reasoning model at a fraction of the reward-side cost of a judge-heavy alternative, with a much narrower reward-hacking surface.

But verifiers do not exist for most things people want from an assistant. Dialogue naturalness, factual grounding in open domains, emotional appropriateness — none have verifiable ground truth. For those, judge rewards are the only practical signal, with all the failure modes above. The strongest production stacks are explicit hybrids: verifier hard floors for what admits them, judge shaping for everything else. Pure verifier-only stacks are restricted to math and code; pure judge-only stacks are fragile.

Do not reach for a judge when a verifier would do. Many teams default to LLM-as-judge because it is flexible. Often a simple rule covers 80% of what they wanted to enforce, with none of the cost, stochasticity, or hackability.

## For technical leaders

AI feedback does not dodge the cost of evaluation. It redirects it. Instead of paying humans to label preference pairs, you pay them to validate that your judge agrees with them on the policy's current distribution. The annotation budget moves from labels to calibration. Total cost is lower; the discipline required is _higher_, because a calibration failure is silent rather than a missing line item.

Every team I have seen ship a regression from RLAIF made the same mistake: they invested in the judge and underinvested in the calibration loop. The judge looked reasonable on the eval set, proxy reward went up, the launch happened, and the regression showed up in user metrics two weeks later. The calibration set was stale, the policy had moved, the judge was no longer measuring what they thought.

The framing I find myself returning to: **a constitution does not align a model. A constitution aligns the conversation between the team and the judge.** The model gets aligned by the labels the judge produces, weighted by how often each principle is sampled, regularised by how much human spot-checking the team can afford. The constitution is not the values. The labels are the values. The constitution is the document the team uses to argue about which labels they wanted.

That is a healthier mental model than "we wrote a constitution and the model followed it." It is also more demanding, because the work is not in writing the document — it is in keeping the judge honest on a distribution that will never sit still.

## Where this fits

AI feedback bridges the [LLM-as-judge pillar](/blog/2025/llm-as-judge/) and the [reward modelling pillar](/blog/2026/reward-modelling-at-scale/). Judges become reward models when you trust them enough to put a gradient through them; the constitution is one structured way to elicit the labels those reward models are built from. The discipline protecting evaluation is the discipline protecting training.

The work I do at the Alexa+ Frontier AI Modelling Lab on judge calibration and reward modelling treats AI feedback as load-bearing with a calibration cost attached. AI feedback is real, it is shipping, and the part that's working has little to do with the elegance of the constitution. It has everything to do with the unglamorous loop where humans keep checking that the judge still means what the team thinks it means.

_This post reflects my personal views and experience. It does not represent official Amazon positions._
