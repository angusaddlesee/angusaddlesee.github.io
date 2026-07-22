---
layout: post
title: "LLM-as-Judge: How to Evaluate Models When the Old Metrics Have Stopped Working"
date: 2025-12-15 10:00:00
description: A pragmatic guide to using language models as evaluators — what they're good at, where they quietly mislead you, and what changes when an evaluation judge becomes a reward signal.
tags: evaluation llm-as-judge reward-modeling alexa machine-learning
categories: technical
thumbnail: assets/img/alexa.jpg
toc:
  beginning: true
---

A few years ago, "how good is this model?" had a half-honest answer: BLEU, ROUGE, perplexity, maybe a held-out accuracy number. They were imperfect but they were cheap and stable, and the field could roughly agree on a leaderboard. Then generative LLMs showed up and the leaderboard quietly collapsed. Two responses can have wildly different BLEU scores and be equally good. Two responses can have identical perplexities and be wildly different in usefulness. The metrics measure surface text properties; the users care about helpfulness, correctness, safety, tone, refusal behaviour, and whether the answer actually solves the problem in front of them.

Human evaluation closes that gap, but it does not scale. You can pay annotators to rate a few hundred outputs; you cannot pay them to rate every nightly eval, every reward signal, every A/B variant. So a third option emerged and quickly became the default: use a capable LLM to judge the output of another LLM. It works surprisingly well — and it fails in ways that, if you do not anticipate them, will cause you to ship the wrong model with confidence.

This post is the canonical piece I want to point both engineers and technical leaders to when they ask "how should we think about LLM-as-judge?" Future posts will go deeper into pairwise comparison, calibration, ensembles, and the move from judge to reward model. Here, the goal is the right mental model and an honest tour of where the cracks are.

## Why LLM-as-judge took over

The proximate cause is published. The MT-Bench and Chatbot Arena work showed that GPT-4 judgements agreed with human preferences at roughly the rate that humans agreed with each other on open-ended quality tasks. That is the bar. Once a tool reaches inter-annotator agreement, the question shifts from "is this trustworthy?" to "where is it most useful, and where is it dangerous?"

The structural cause is more interesting. The kinds of properties we now want from models — instruction following, multi-turn coherence, calibrated refusal, useful long-form reasoning — are not addressable by surface metrics in principle. There is no closed-form metric for "this answer is helpful to a confused user." A model that has learned, from large amounts of human preference data, to distinguish helpful from unhelpful text is a closer approximation to what we want than any string-similarity heuristic could ever be. The judge is not a workaround for missing metrics; it is a different category of evaluator.

For technical leaders, the strategic point is this: LLM-as-judge is what makes [LLM routing](/blog/2025/llm-routing-at-scale/) measurable, what makes RLAIF possible, what makes A/B variant comparison fast enough to do every day, and what makes shipping a regression-free model release feasible. Without a judge layer your evaluation cadence is bottlenecked by humans. With a judge layer it is bottlenecked by inference. That is a different organisation.

## What a judge actually does

Strip the design space down and a judge is a function that takes a query, one or more candidate outputs, and a rubric, and returns a score or a preference. Two patterns dominate, and the choice between them affects everything downstream.

**Pointwise scoring** asks the judge to rate a single output on a numeric scale — say 1 to 5 for helpfulness. It is simple, cheap (one judge call per output), and naturally extends to dashboards and per-axis tracking. Its weakness is calibration. Judges use scales unevenly, cluster scores into a narrow band, and drift across versions of the same model. A pointwise score is meaningful relative to a calibration anchor, not in absolute terms.

**Pairwise comparison** shows the judge two candidate outputs and asks which is better, with a tie option. This sidesteps calibration almost entirely — the judgement is self-contained and relative — and tends to produce higher agreement with humans on subjective dimensions. It is the basis of Arena-style Elo rankings. The cost is quadratic in the number of systems being compared, and it leaves you with a ranking rather than an absolute quality metric.

A useful default, if you are starting from scratch: use **pairwise** for model-vs-model comparisons (regression catches, A/B variants, leaderboard-style decisions), and **pointwise** for axis-specific quality tracking (helpfulness, safety, format compliance) where you need a number you can plot over time. They are complementary, not competing.

A few structural choices cut across both:

- **Reference-guided vs reference-free.** If you have a gold answer, the judge's job becomes much easier and more consistent — but you are then limited to tasks where a gold answer exists. Reference-free is more general, less reliable.
- **Chain-of-thought before verdict.** Asking the judge to reason out loud before assigning a score consistently improves judgement quality and gives you interpretable rationale to debug.
- **Rubric anchoring.** Concrete examples of what a "3" looks like versus a "5" — included in the prompt — substantially improves calibration. It is the same thing you'd do to onboard a human annotator.

Formally, a pointwise judge produces $s = J(q, a, \text{rubric})$, and a pairwise judge produces $P(a \succ b \mid q, \text{rubric})$. None of this is mysterious. The hard part is what happens when the prompt meets reality.

## The biases that quietly distort everything

If you take only one thing from this post: **a judge is a measuring instrument, and an uncharacterised measuring instrument lies to you in a consistent direction.** The biases below are not edge cases. They are the reason "we evaluated and the new model wins" can be wrong.

**Position bias.** Pairwise judges tend to prefer whichever response appears in a particular position. The size of the effect varies by judge, but it is rarely negligible. Mitigation: present every pair in both orderings, and only count the preference if the verdict is consistent. This roughly doubles judge cost. The alternative — averaging logprobs from both orderings — is cheaper but less robust.

**Verbosity bias.** Judges prefer longer outputs even when the shorter one is more accurate. If you do not measure this, you will reward padding. Mitigation: include adversarial pairs in your calibration set where the shorter response is correct and the longer one is padded; tune the prompt to penalise unnecessary verbosity.

**Self-enhancement.** A judge from one model family rates outputs from the same family higher, on examples where humans see no difference. The size of this effect depends on the family, but it is real and reproducible. Mitigation: never use the same model family as both generator and judge. If you are evaluating GPT-class outputs, use a Claude-class judge, and vice versa.

**Leniency bias.** On a 1–5 scale, the empirical distribution clusters in the upper end. Your effective scale is two or three levels, not five, and you cannot tell the difference between a "good" and "great" output. Mitigation: rubric anchoring with concrete examples, and z-score normalisation when comparing across judges.

**Authority and style.** Judges over-credit confident, well-formatted, hedge-free prose. A wrong-but-confident answer can outrank a right-but-uncertain one. Mitigation: explicit rubric instructions to weight correctness above tone, plus reference-guided evaluation on factual axes wherever possible.

The general lesson: every project should begin with a small bias audit on a controlled set with known ground truth. You measure position consistency, score distribution, agreement with human labels on a calibration set, and behaviour on adversarial pairs. Skip this and your eval results have no meaningful error bar.

For high-stakes evaluations — model deployment decisions, public benchmarks, anything that gets cited in a launch review — report bias metrics alongside results. State the position consistency rate and the human agreement rate. Anyone who reads the result without those numbers is reading marketing, not evaluation.

## Multi-judge ensembles and when they help

Single-judge evaluation is a single point of failure for both bias and outage. The standard response is a multi-judge ensemble: aggregate judgements from several judges, by majority vote, by score averaging, or by a learned aggregator. This works to the extent that the constituent judges have *uncorrelated* biases. Two judges that both have strong verbosity bias do not help each other. A panel deliberately mixed across model families, prompt structures, and reasoning depths gives you genuine independence.

Ensembles also enable axis-specialised panels: one judge tuned for factual correctness, one for safety, one for tone, one for format compliance. Each judge does the job it is calibrated for, and a separate aggregation step produces the headline number. This is more robust than asking a single judge to balance every axis in one prompt, and it is the architecture I would default to whenever the evaluation matters.

The downside is cost. A panel of three or five judges is three to five times the inference bill of a single judge, and the aggregation logic itself becomes a piece of software you need to maintain and validate. For low-stakes regression tracking, a single carefully-calibrated judge is fine. For decisions that drive deployments or training, the ensemble pays for itself.

## The transition that breaks everything: judge as reward

Here is the transition I most want technical leaders to understand. An LLM-as-judge built for evaluation looks identical, from the outside, to an LLM-as-judge used as a reward signal during reinforcement learning. They are not the same problem.

An evaluation judge is calibrated against humans on a *fixed* distribution of outputs — the model you are about to ship, scored on a held-out test set. You measure agreement, you publish the number, you move on.

A reward judge is calibrated against humans on a *moving* distribution. As the policy trains, every gradient step pulls the model further from the distribution the judge was originally calibrated on. The judge's reliability on yesterday's outputs tells you nothing about its reliability on today's. And the training process is actively searching for outputs that score high — which means it is actively searching for the judge's blind spots.

This is the structural reason most evaluation judges break when promoted to reward judges. Three properties separate the safe ones from the dangerous ones:

1. **High and stable agreement with humans on the *current* policy distribution**, not just on the eval set. If the judge agrees with humans on the SFT checkpoint but disagrees on outputs from an ablation, it will not survive RL.
2. **Low sample-to-sample variance.** Noisy judges produce noisy gradients, and noise is the friend of reward hacking — random good scores let the policy stumble into exploits before you see them.
3. **Plausible adversarial robustness.** The judge does not break on outputs that game its prompt structure. Training will drive the policy toward whatever the judge mis-scores; if those exploits exist, they will be found.

If a judge fails any of these, do not use it as a reward. Use it for evaluation only, and either fix the underlying issue or distil it into a learned reward model trained on its labels — which is, in practice, the path most teams converge on for cost and stability reasons.

The operational cost of judge-as-reward is the recalibration loop. Every $K$ training steps you sample fresh trajectories from the current policy, get them human-labelled, and recompute the judge's agreement with humans. If agreement drops, the reward signal has gone stale and you stop. Skipping this step is the single most common cause of silent reward hacking in judge-based training. The work I do on reward modelling at Alexa+ runs this loop continuously; the discipline of it matters more than any specific judge architecture.

## How to actually start

If you are kicking off LLM-as-judge work this quarter, here is the order I'd run it in:

1. **Define the axis you care about, narrowly.** "Helpfulness" is not an axis. "Did the model correctly answer the user's factual question, given the available context?" is an axis. Vague rubrics produce noisy judges.
2. **Build a calibration set with human labels.** A modest number of examples, scored by trusted annotators, on the same axis your judge will score. This is the only ground truth you have.
3. **Run a bias audit before trusting any results.** Position consistency, score distribution, agreement with human labels, behaviour on adversarial pairs. Publish the numbers.
4. **Choose pairwise for comparisons, pointwise for tracking.** Do not try to do both with one judge prompt.
5. **Use a different model family for judging than for generating.** This is the single cheapest mitigation for self-enhancement bias.
6. **Recalibrate on a schedule.** Judges drift as the underlying model is updated, as the generation distribution shifts, and as your axis definitions evolve. Bake recalibration into the operational cost from day one.
7. **Treat ensemble vs single-judge as a stakes decision.** Low-stakes tracking: single judge. High-stakes deployment or training reward: panel.

The first five items are non-negotiable. The last two are economics.

## Where this fits

LLM-as-judge is the load-bearing infrastructure underneath almost everything modern in LLM development. It is what makes [LLM routing](/blog/2025/llm-routing-at-scale/) honest — you cannot route to the cheaper model unless you can measure that the cheaper model is good enough. It is what makes RLAIF possible — without a calibrated judge there is no scalable preference signal. It is what makes evaluation cadence fast enough to support real iteration. And it is what closes the loop between research and production: a judge that lives in the eval pipeline today is a candidate reward signal tomorrow, with the calibration discipline I described above.

If routing is the architecture decision that determines whether your platform survives growth, evaluation is the discipline that determines whether you can tell the difference between a good model and a bad one. Without the second, the first is gambling.

Future posts will go deeper into pairwise debiasing, multi-judge ensembles, and the migration from evaluation judge to learned reward model. The short version, for now: get a judge, characterise it like an instrument, and never trust a verdict whose error bar you cannot quote.

_This post reflects my personal views and experience. It does not represent official Amazon positions._
