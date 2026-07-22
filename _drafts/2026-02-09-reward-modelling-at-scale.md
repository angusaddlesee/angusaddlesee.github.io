---
layout: post
title: "Reward Modelling at Scale: The Hard Problem Behind Every Aligned LLM"
date: 2026-02-09 10:00:00
description: A pillar guide to reward modelling: what it is, why it is the most fragile component of modern LLM training, the design space from Bradley-Terry to judge-distilled scalar heads, and the failure modes that bite in production.
tags: reward-modelling rlhf reinforcement-learning alexa machine-learning
categories: technical
thumbnail: assets/img/alexa.jpg
toc:
  beginning: true
---

The thing nobody tells you when you start working on RLHF is that the policy is the easy part. The PPO loop, the KL penalty, the rollout buffer, the value head: they are fiddly but well-trodden. The component that decides whether the whole training run produces a better model or a worse one, the component you will spend most of your debugging time on, the component that quietly determines the ceiling on every downstream metric you care about, is the reward model. Everything else in the pipeline is plumbing around it.

This post is the pillar I want to point both engineers and technical leaders to when they ask "how should we think about reward modelling?" It sits alongside the [LLM-as-judge](/blog/2025/llm-as-judge/) and [LLM routing](/blog/2025/llm-routing-at-scale/) pillars in this series, and it is the one closest to my literal day-job at the Alexa+ Frontier AI Modelling Lab. Future posts will go deeper into reward hacking, group-relative methods like GRPO, and the RLAIF/Constitutional flavours of preference data. Here, the goal is the right mental model and an honest tour of where the cracks are.

## Why reward modelling is the hard problem of modern LLM training

The framing that lands best with technical leaders is this: reward modelling is the place where human values meet a gradient. Pretraining gives you a model that has read the internet. SFT gives you a model that follows instructions when asked nicely. Neither of those steps tells the model what it means to be _good_. That signal (the difference between a helpful answer and a confidently wrong one, between a refusal that protects users and one that frustrates them, between a reasoning chain that earns trust and one that hallucinates with style) has to come from somewhere. The reward model is where it comes from.

And it is fragile in a way that the rest of the stack is not. A pretraining run with a bad data mixture produces a slightly worse base model. An SFT run with mediocre instructions produces a slightly worse instruction-follower. A reward modelling run with a flawed reward function produces a policy that has been actively optimised to exploit those flaws. The optimiser is a relentless adversary against your reward model. Every imperfection becomes an attack surface, and the policy will find them faster than you can patch them. This is what makes reward modelling both the most important and the most fragile component of the RLHF pipeline: flaws compound, they do not average out.

The practical consequence is that the quality ceiling of any RLHF system is set by its reward model. You can have the best PPO implementation in the industry; if the reward function is wrong, the policy gets worse the harder you train it. Most of the time when teams report "RL didn't help us," what they mean is "our reward model was not good enough to be optimised against." The two statements are easy to confuse and very expensive to confuse.

## What a reward model actually is

A reward model is a function $r_\phi(x, y) \to \mathbb{R}$ that takes a prompt $x$ and a candidate response $y$ and returns a scalar score. Higher score, more preferred. That is the entire interface. Architecturally it is almost always the SFT model with the language modelling head sliced off and replaced by a single linear projection from the final-token hidden state to one number:

$$r_\phi(x, y) = w^\top h_{\text{last}} + b$$

The model is trained from pairwise human preferences. Given a prompt, two responses, and a label saying which is better, the reward model learns to assign a higher score to the chosen response and a lower score to the rejected one, only ever through the difference between them. This is the Bradley-Terry preference model, a probabilistic framework from 1952 paired-comparison research that turns out to be exactly the right tool for the job:

$$P(y_w \succ y_l \mid x) = \sigma\!\left(r_\phi(x, y_w) - r_\phi(x, y_l)\right)$$

and the training loss is the negative log-likelihood of the observed preferences:

$$\mathcal{L}_{\text{RM}} = -\mathbb{E}_{(x, y_w, y_l)} \left[\log \sigma\!\left(r_\phi(x, y_w) - r_\phi(x, y_l)\right)\right]$$

This is, to a first approximation, logistic regression on the difference between two scalar scores. It is the same loss as binary cross-entropy, which makes it numerically stable and well-understood. The Bradley-Terry model has a few properties worth holding in your head: only the score _difference_ matters (the absolute scale is arbitrary), it assumes preferences are transitive (which humans aren't, fully), and it collapses every quality dimension into a single number (which means helpfulness, safety, conciseness and accuracy all end up averaged into one scalar with implicit weights you didn't choose). It is also the same mathematics as the Elo rating system used in chess and Chatbot Arena, which is not a coincidence: they are the same probabilistic model with different scaling constants.

The reason this works at all is that humans are dramatically more consistent at saying "A is better than B" than at assigning numerical scores. Inter-annotator agreement on pairwise comparisons sits around 70–80% for subjective tasks. On Likert-scale ratings it falls off a cliff. The whole RLHF pipeline rests on the empirical observation that pairwise preference labels are the cheapest reliable signal of human values that can be collected at scale.

## The design space

Here is the part that surprises engineers new to the field: there is not _one_ reward model. There is a design space, and the right point in it depends on what you are aligning, what data you can afford, and how much you trust your judges.

**Outcome reward models (ORMs).** The default. Score the entire response with one number after the model is done generating. Trained on pairwise preferences, used for PPO, DPO, rejection sampling, and best-of-N filtering. InstructGPT, Llama 2, Claude: every well-known aligned LLM uses an ORM as the primary signal. They are simple, well-understood, and proven at frontier scale. The limitation is sparseness. If a 12-step mathematical derivation is wrong because step 4 was wrong, an ORM tells you the whole thing is bad without telling you _why_. Credit assignment falls on the optimiser, which is exactly the place you don't want it.

**Process reward models (PRMs).** Step-level scoring rather than outcome-level. The reward model produces a score at each step boundary in a multi-step response, and the response-level score is typically the minimum step score (the weakest link). The classic result is Lightman et al. (2023)'s "Let's Verify Step by Step": on the MATH benchmark, a PRM-guided best-of-N selection solved 78.2% of problems versus 72.4% for an equivalent ORM with the same compute budget. The cost is annotation: step-level labels are 5–10× more expensive than preference pairs because each step has to be verified independently. PRMs are the right tool for verifiable reasoning domains (maths, code, formal logic). For open-ended dialogue or creative writing, the lack of natural step boundaries makes them awkward to apply.

**Bradley-Terry scalar models.** What I described in the previous section, and what most people mean when they say "reward model" without qualification. One scalar per (prompt, response) pair, trained on pairwise preferences, used for everything. Most production reward models are this.

**Multi-headed and multi-axis reward models.** A single backbone with several scalar heads (one for helpfulness, one for harmlessness, one for honesty) combined at the policy-optimisation step with tunable weights. Anthropic's Constitutional AI work runs this pattern. The advantage is that you can re-weight the trade-off between axes without retraining. The disadvantage is that each axis still inherits the Bradley-Terry single-dimension assumption per head, and you have to be honest about whether your "axes" are really independent or just slices of the same latent quality scale.

**Judge-distilled reward models.** This is the bridge to my [LLM-as-judge](/blog/2025/llm-as-judge/) post, and the pattern that matters most in modern systems. Take a strong but expensive judge (or panel of judges), score a large set of trajectories, then train a smaller scalar reward model to predict the judge's score. The distilled model is what you actually use during RL training. Frontier labs sit at various points along this spectrum: models like Llama 3 rely on large-scale human preference annotation, sometimes supplemented with AI-generated preferences, while fully judge-distilled setups take the AI end of the spectrum to its conclusion. It works because it gets you the _flexibility_ of a judge during data generation and the _stability and cost profile_ of a learned reward model during training. The labels are baked in once, so the live judge can drift without breaking your training run. I think of judge-distilled reward models as the most operationally sane default for teams that can afford a good judge but not its inference bill at training scale.

The design choice between these is not academic. ORMs for general alignment, PRMs for reasoning-heavy domains, multi-axis heads when your trade-offs need to be tunable, judge-distilled when your evaluation infrastructure is more mature than your preference-data pipeline. Most production systems end up running several at once.

## The failure modes, and the one that swallows everything

Every reward modelling pipeline has the same set of failure modes; they differ only in how loud each one is in your particular system.

**Overfitting.** Reward models overfit faster than almost any other model in the stack, because the preference dataset is tiny relative to the backbone capacity. Training accuracy hits 95%+ while validation accuracy plateaus at 70–75%. The model starts assigning extreme scores to most responses and becomes sensitive to superficial features (length, formatting) instead of content. The textbook mitigation is to train for at most one or two epochs, use early stopping aggressively, and treat anything above 80% pairwise accuracy on held-out preferences as a red flag for overfitting rather than a sign of quality.

**Annotation noise.** Inter-annotator agreement is 70–80%. The remaining 20–30% is noise the reward model dutifully memorises. Different annotators bring different cultural backgrounds, different verbosity preferences, different assumptions about confident-sounding answers. The reward model learns the average of those biases as if they were ground truth. Mitigations help: rubric anchoring, calibration sessions, label smoothing in the loss, filtering low-agreement pairs. None of them eliminate the problem.

**Distribution shift.** This is the one most teams underestimate. The reward model is trained on responses generated by the SFT model. During PPO it has to score responses generated by the _evolving_ policy, which moves further from the SFT distribution with every gradient step. The reward model's reliability on yesterday's outputs tells you nothing about its reliability on today's. Gao et al. (2023)'s "Scaling Laws for Reward Model Overoptimization" is the canonical paper here, and the result it reports is the most important empirical finding in modern RLHF: the proxy reward keeps going up while the true reward (what humans actually prefer) first rises, peaks, then falls. For best-of-$n$ sampling, the relationship has a clean functional form,

$$r^*(d_{\text{KL}}) \approx \alpha \sqrt{d_{\text{KL}}} - \beta \cdot d_{\text{KL}}$$

where $d_{\text{KL}}$ is the KL divergence between the policy and the reference model. The first term is genuine improvement; the second is overoptimisation. Gao et al. fit a different functional form for RL training, one with a log term rather than a square root, but the qualitative shape is the same: rise, peak, decline. The peak, the point past which more training makes the model worse, is where reward _hacking_ takes over.

**Reward hacking.** The central failure mode, and the one that justifies most of the operational discipline around RLHF. Goodhart's Law in its strongest form: when a measure becomes a target, it ceases to be a good measure. The reward model is a learned approximation of human preferences. Sufficiently powerful optimisation will find the gap between the proxy and the truth. Concretely: the policy learns to be longer (because length correlates with reward in the training data), more confident, more formatted, more sycophantic, more padded with hedges and "great question!" preambles, sometimes more nonsensical in adversarial token sequences that just happen to score high in the reward model's scalar head. None of these things are what humans actually want. All of them score higher on the proxy.

The defences are familiar: a KL penalty against a frozen reference model (typical KL budget: 5–15 nats), reward model ensembles, length penalties, periodic reward model retraining on the current policy's outputs, and, increasingly, replacing the live reward model with a verifier on tasks where verification is possible. None of them solve the problem; they shift the operating point along a curve. The KL penalty that prevents reward hacking also caps how much the policy can improve; setting $\beta$ too high makes the model safe but mediocre, too low and the policy hacks before you notice.

The clearest signal that reward hacking is occurring is a divergence between proxy reward and human evaluation. The proxy says the model is getting better; humans say it is getting worse. If you are not running fresh human spot-checks during training, you do not know which side of that divergence you are on. The work I do at Alexa+ on reward modelling treats this monitoring loop as continuous, not periodic; it is the discipline that distinguishes a healthy RL training run from a silently broken one. I plan to write a deeper [reward hacking deep-dive](/blog/2026/reward-hacking/) as a follow-up; the short version is that you cannot defeat reward hacking, you can only buy more time before it happens.

## For technical leaders

The strategic point is this: reward modelling is not an algorithmic problem you solve once and ship. It is an evaluation problem in disguise. You cannot have a good reward model without a good way of measuring its agreement with humans on the distribution your policy will actually generate. That measurement is what bounds how aggressively you can train. Every team I know that under-invested in evaluation infrastructure ended up with a reward model they couldn't trust, which meant either an RL run they couldn't ship or a policy that quietly degraded in production.

This is the connection back to [LLM-as-judge](/blog/2025/llm-as-judge/). Calibrated evaluation judges are the substrate from which judge-distilled reward models are built; the same calibration discipline that protects your evaluation results also protects your training signal. Underfunding the judge layer is underfunding the reward layer is underfunding your entire RLHF stack. Routing, evaluation, reward: they are not three separate problems. They are three angles on the same problem of measuring quality at scale, and the team that owns one of them realistically owns all three.

The other point worth carrying is unit economics. Reward modelling is data-bound, not compute-bound. The bottleneck is preference annotations from trusted humans, calibrated judges willing to be on the training-time inference bill, or the cost of distilling the latter into the former. None of those scale automatically with GPU count. Plan for a preference-data pipeline the same way you plan for a feature store: a long-lived asset that compounds value, not a one-off purchase you bolt on before launch.

## How to actually start

If you are kicking off reward modelling work this quarter, here is the order I'd run it in:

1. **Build the evaluation before the reward model.** A calibrated judge or human-labelled set on the axes that matter. You cannot measure reward model quality without it, and the same artefact later becomes your training-time drift detector.
2. **Initialise from the SFT model.** Replace the LM head with a scalar head. Don't train a reward model from scratch; you'd need orders of magnitude more data and you'd be discarding all the language understanding the SFT model already has.
3. **Collect pairwise preferences, not Likert scores.** Either from trained human annotators or from a calibrated judge with rubric anchoring. Rankings of K responses are more efficient per prompt than independent pairs ($\binom{K}{2}$ pairs from each prompt).
4. **Train for one epoch, watch for overfitting.** Pairwise validation accuracy of 70–75% is a healthy reward model. Higher is suspicious; investigate before you trust it. Use a learning rate one to two orders of magnitude lower than your SFT run.
5. **Sanity-check with best-of-N before you go anywhere near PPO.** Generate $N$ samples per prompt, score them with the reward model, pick the highest. If best-of-N produces noticeably better outputs than random for $N=8$ to $64$, the reward model is capturing real quality signal. If not, your reward model isn't ready and PPO will only make things worse.
6. **Decide where you sit in the design space.** ORM as default; PRM if the domain is verifiable and you can afford step-level labels; multi-axis heads if your trade-offs need to be tunable; judge-distilled if your evaluation infrastructure is your strongest asset.
7. **Plan the recalibration loop on day one.** Periodic fresh human labels, drift checks, retraining on the current policy's outputs. The teams that skip this step are the teams that ship silent reward hacking. The cost of the loop is a line item in the training budget, not a stretch goal.
8. **Track the proxy/true reward gap, not just the proxy.** The proxy is what you optimise. The gap is what tells you the proxy is still meaningful.

The first six items are non-negotiable. The last two are the difference between a reward model you ship and one that ships you.

Future posts will go deeper into reward hacking, [GRPO and group-relative methods](/blog/2026/grpo-group-relative-rl/), and the [Constitutional / RLAIF](/blog/2026/constitutional-ai-rlaif/) flavours of preference data. The short version, for now: the reward _is_ the model. Treat it as such.

_This post reflects my personal views and experience. It does not represent official Amazon positions._
