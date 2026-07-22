---
layout: post
title: "The Panel Trick: Multi-Judge Ensembles That Don't Just Compound Bias"
date: 2026-05-04 10:00:00
description: A deep dive into multi-judge LLM ensembles: what they actually buy you, the aggregation strategies that work in practice, and the uncorrelated-bias requirement that most teams quietly skip.
tags: evaluation llm-as-judge multi-judge ensembles alexa machine-learning
categories: technical
thumbnail: assets/img/phd.jpg
toc:
  beginning: true
---

A team I worked with once shipped a "multi-judge ensemble" of three judges and reported a model win with three significant figures of confidence. The aggregation logic was clean. The only problem was that all three judges were the same provider's model at three temperatures: identical position bias, identical verbosity bias, identical self-enhancement bias. The "ensemble" was a single judge wearing three hats. They thought they had bought robustness; what they had bought was a more confident way to be wrong.

This is the modal failure of multi-judge ensembles. In the [parent pillar on LLM-as-judge](/blog/2025/llm-as-judge/) I argued that a judge is a measuring instrument, and an uncharacterised instrument lies in a consistent direction. In the [position-bias deep dive](/blog/2026/pairwise-position-bias/) I argued that a single pairwise judge with no debiasing produces a vibe with a number attached. The next move is to treat single-judge eval as a single point of failure for both bias _and_ outage, and reach for a panel. The move is correct. The execution is harder than it looks.

## The single-judge fragility problem

Single-judge evaluation has two structural weaknesses no prompt can fix.

The first is bias. Every judge has a fingerprint of systematic errors (position, verbosity, self-enhancement, leniency, authority, style) baked into the training data and the architecture. You can audit them, correct the most egregious ones. You cannot eliminate them. If your judge has a 12% verbosity bias, every team that learns to pad outputs gets a free 12% on the leaderboard.

The second is operational. A single judge is a single dependency. Provider rate-limits you, your nightly eval breaks. They update the model, your historical numbers stop being comparable. They deprecate the version, your calibration audit becomes a museum piece.

The standard mitigation for both is a panel.

## What an ensemble actually buys you

The theoretical case is the Condorcet jury theorem. If each of $k$ judges is correct independently with probability $p > 0.5$, the probability that the majority vote is correct grows with $k$ and approaches 1 as $k \to \infty$:

$$P(\text{majority correct}) = \sum_{i=\lceil k/2 \rceil}^{k} \binom{k}{i} p^i (1-p)^{k-i}$$

The catch is the word _independently_, which we will spend most of this post on. In my experience, three carefully chosen judges from different model families improve agreement with human annotators by several percentage points, sometimes closer to ten, over the best individual judge. That is the difference between a judge layer you can trust to drive a deployment and one you cannot.

The empirical case is the literature. PoLL (Verga et al., 2024) showed that a panel of small open-weight judges could match or exceed a single frontier judge while reducing self-enhancement bias. JudgeLM and Auto-J explored learned judge architectures that benefit from panel-style training data. The throughline: when you stop relying on a single judge, you recover signal it was systematically erasing.

The less obvious benefit is the disagreement signal. A single judge gives a verdict with no error bar. A panel gives you a verdict _and_ a measure of how trustworthy it is. When the panel splits, the example is genuinely ambiguous: the task is subjective, the rubric underspecified, or the judges poorly calibrated, and any of those is more useful than a confident wrong answer. A sudden spike in disagreement means something has shifted, and you find out before it shows up in production.

The third benefit is robustness to provider drift. When one provider updates their model, the panel's other judges provide continuity; swap one at a time instead of re-validating the whole pipeline.

## Aggregation strategies

A panel is two pieces: the judges, and the rule combining them. The rule matters more than most teams credit it for; a poorly-aggregated five-judge ensemble can underperform a well-aggregated three-judge one.

**Majority vote.** For pairwise with $k$ judges, the response preferred by at least $\lceil k/2 \rceil$ wins. For pointwise, take the median, which is robust to outliers in a way the mean is not. Right starting point.

**Score averaging.** Panel score is $\hat{s} = \frac{1}{k} \sum_j s_j$. Cleaner than majority vote when the scale is meaningful, but z-score-normalise per judge first or a lenient judge bunching scores at 4.5 dominates a strict judge using the full range: $\hat{s} = \frac{1}{k} \sum_j (s_j - \mu_j) / \sigma_j$.

**Weighted aggregation.** Weight each judge by its reliability on a calibration set: $w_j = \text{accuracy}_j / \sum_k \text{accuracy}_k$. Outperforms equal weighting when judge quality varies, which it almost always does. The catch: weights drift as judges drift.

**Learned aggregator.** Train a small model (usually logistic regression) mapping the per-judge verdict vector to a final verdict, using human labels. A few hundred examples is enough. Most flexible, tends to outperform fixed rules. Also the most opaque: auditability matters for high-stakes decisions, and a transparent fixed rule is sometimes worth a couple of points of agreement.

**Axis-specialised panels.** Route each axis to the judge most calibrated for it: one for factual correctness, one for safety, one for tone, one for format. More robust than a single judge balancing every axis in one prompt, and the architecture I would default to whenever the evaluation actually matters.

A useful default: three judges from different families, median for pointwise, majority vote for pairwise, calibration weights against a small human-labelled set, axis specialisation when the rubric has multiple dimensions.

## Uncorrelated biases: the hard requirement most teams skip

Here is the part the textbooks bury and the production failures rediscover. The Condorcet bound assumes _independence_. The empirical literature reports gains under _diverse_ judges. Not the same property. Two judges from the same provider, same architecture family, overlapping training data, produce errors that are massively correlated. Their majority vote gives you the gain of one judge, plus a more confident-looking number, plus a higher inference bill.

Concretely: if both judges have 60% accuracy but errors overlap 90%, panel accuracy is barely above 60%. If errors overlap 30%, panel accuracy can be in the low-to-mid 70s. Error correlation is the hidden variable that determines whether your panel works. Don't measure it and you don't know if you have an ensemble or three copies of the same instrument.

The cheapest way to measure correlation is on the calibration set you used for the bias audit in the [position-bias post](/blog/2026/pairwise-position-bias/). Run every judge on every example. Compute Cohen's kappa between every pair. Above 0.8: essentially the same judge, so drop one. 0.4–0.7: healthy disagreement. Below 0.3: at least one is not actually competent.

The structural defences against correlated bias:

- **Different model families.** GPT-class plus Claude-class plus Gemini-class, or one frontier plus one open-weight from different provenance. Two GPT-4 instances at different temperatures is not a panel.
- **Different prompt structures.** Vary rubric framing, chain-of-thought instruction, verdict format. Identical prompts inherit identical prompt-induced biases.
- **Different evaluation paradigms where possible.** A pairwise judge plus a pointwise judge whose scores are converted to pairwise gives you genuinely different views of the same comparison.

This is the requirement most teams skip because it costs design effort instead of inference dollars. It is also the one that decides whether the panel is real.

## The failure modes

**Correlated biases.** The previous section, in its general form. If every family in the panel was trained on data that prefers verbose, formatted, hedged prose, every judge prefers verbose formatted hedged prose. Adversarial calibration sets (shorter response correct, confident wrong against uncertain right) expose this.

**The judge-of-judges regress.** Tempting to feed per-judge outputs into a "meta-judge" LLM. Sounds principled. In practice it adds another judge with another fingerprint of biases, weighting the loudest reasoning over the genuine majority. Use a learned aggregator instead: fewer parameters, fewer biases, an interpretable decision surface.

**Cost.** Three judges cost three times as much. Five or seven gives diminishing returns. A useful pattern is tiered evaluation: a fast judge for initial screening, escalate to the panel only for borderline cases.

**Aggregation drift.** As judges drift, the aggregation rule silently degrades. Recalibrate the aggregator on the same schedule as the judges.

**Diffuse responsibility.** Panel verdicts are harder to debug. Build the per-judge audit trail on day one.

## How to design a panel

1. **Pick three judges from genuinely different model families.** Different providers, different training data, ideally different architectures. Two flavours of the same family is not a panel. The single most important decision, and the one the industry most often gets wrong.
2. **Audit each judge individually first.** Run the [position-bias and calibration audit](/blog/2026/pairwise-position-bias/) on every candidate. A judge that fails its individual audit will not be saved by ensembling.
3. **Measure pairwise error correlation.** Cohen's kappa between every pair. Drop or replace any pair above 0.8.
4. **Default to median for pointwise, majority vote for pairwise.** Add weights or a learned aggregator only when the simpler rule is leaving signal on the table.
5. **Track inter-judge agreement as a first-class metric.** A drop is the earliest indicator that something has shifted: judge update, distribution shift, rubric regression.
6. **Use axis-specialised panels for multi-axis evaluation.** One judge per axis, with the headline number computed from the per-axis verdicts.
7. **Recalibrate on a schedule.** Both individual judges and aggregation rule.

Skip any of the first three and the panel is decorative. The rest are economics.

## For technical leaders

A panel is an organisational commitment, not a one-off engineering choice. You are committing to an inference bill that scales with the number of judges, an annotation budget for the calibration set, and an on-call discipline for monitoring agreement and drift. Teams that treat the panel as fire-and-forget end up with three correlated judges, no calibration loop, and a more confident-looking error bar around the same wrong number.

The flip side: the investment pays compound interest. The calibrated judges in your evaluation panel are the candidate inputs for a [judge-distilled reward model](/blog/2026/reward-modelling-at-scale/) tomorrow: the promotion path the literature converges on for cost reasons, and the one that sits underneath most modern aligned LLMs. Routing, evaluation, ensembling, reward: four positions along the same arc.

The unit-economics framing: a panel is the cheapest insurance policy in the eval stack. Marginal cost is two extra judge calls and an aggregation step. Marginal benefit is a measurable error bar, robustness to provider drift, and meaningful reduction of the worst single-judge biases. Anyone proposing single-judge evaluation for a deployment-driving decision is proposing to ship without insurance.

If there is one thing I want technical leaders to take from this piece, it is that the cheapest way to ruin an ensemble is to build it from the same provider's models and call the result a panel. The cheapest way to make one work is to insist on family diversity, measure error correlation before you trust any aggregation, and treat inter-judge agreement as a metric you actually look at. The instruments are not interchangeable. An honest panel is not three of them; it is three different ones, characterised, watched, and recalibrated.

_This post reflects my personal views and experience. It does not represent official Amazon positions._
