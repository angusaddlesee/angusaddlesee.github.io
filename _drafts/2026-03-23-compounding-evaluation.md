---
layout: post
title: "Evaluation Infrastructure That Actually Compounds"
date: 2026-03-23 10:00:00
description: Most evaluation infrastructure is built as a series of one-off projects that depreciate. The good kind compounds: every new model, feature, and failure mode adds to a growing asset rather than starting from scratch.
tags: evaluation mlops infrastructure leadership alexa
categories: technical
thumbnail: assets/img/alexa.jpg
toc:
  beginning: true
---

A pattern I have watched repeat across teams, companies, and launches: evaluation gets built like a project, then thrown away. A launch is coming, so somebody stitches together a held-out set, a notebook, a Slack thread of edge cases, and a half-calibrated judge. The launch happens. The notebook rots. Six months later somebody asks "what did we use last time?", and the work begins again from roughly zero.

This is the most expensive habit in modern ML and almost nobody names it. The cost is not the rebuild. The cost is that evaluation is the one piece of infrastructure where every new failure mode, every new model, every regression caught in production should make the system *more valuable*, not the same valuable. Evaluation, done correctly, is a compounding asset. Done as a project, it is a depreciating one.

This post is the leadership-flavoured piece in the series: less maths than the [LLM-as-judge](/blog/2025/llm-as-judge/) and [reward modelling](/blog/2026/reward-modelling-at-scale/) pillars, more about reasoning about evaluation as a long-lived asset. The audience is technical leaders deciding whether next quarter's headcount goes into model work or the unglamorous infrastructure underneath. The honest answer, more often than people want to hear, is the second one.

## The eval-as-project antipattern

The shape is always the same. A team has a deadline. The deadline does not care about evaluation, it cares about the model going out. So evaluation gets sized to the launch: a couple of hundred curated examples, one judge prompt, an offline number for the launch review, ship verdict. The artefacts disappear into a notebook nobody opens. The judge prompt was tuned on what the model was doing that fortnight and does not generalise. The held-out set was sampled for this launch and does not represent ongoing traffic. The bias audit, if it happened, was in someone's head.

The next launch starts again. The work is scoped to a horizon (this model, this feature, this quarter), and the moment the horizon passes, the asset depreciates. The team I work with at Alexa+ has spent real effort reversing this. The gap between a one-quarter-old evaluation pipeline and one continuously curated for two years is not linear: it is the gap between "we think this is fine" and "we know, within a known error bar, what shipping this does."

Eval-as-project is common for a structural reason: nobody is rewarded for the second year of an evaluation pipeline. The launch happens, the metric goes up, the team gets promoted, and the infrastructure that made the next launch possible is invisible until it isn't there.

## What compounding evaluation looks like

The mental shift is to stop treating evaluation as a measurement event and start treating it as a flywheel. Three properties characterise the compounding kind.

**It accumulates rather than replaces.** Every failure mode found in production becomes a permanent test case. Every new model is scored on the full historical suite. The suite grows monotonically, so yesterday's bugs do not ship again tomorrow. This is what distinguishes teams that ship LLM features quarterly from teams that ship them annually.

**It calibrates rather than asserts.** A pointwise score from an uncharacterised judge is marketing. A pointwise score next to a documented position-consistency rate, human-agreement rate, and score distribution is evaluation. The compounding asset is not the judge prompts; it is the *calibration data*: the human-labelled set, the adversarial pairs, the agreement metrics. Those let you swap the underlying judge model when a new frontier release lands without losing your error bar.

**It produces signal that flows downstream.** A mature evaluation pipeline is not just a launch-decision tool. It is the substrate for [reward modelling](/blog/2026/reward-modelling-at-scale/), the calibration layer for [LLM routing](/blog/2025/llm-routing-at-scale/), the regression suite for prompt updates, and the dataset bank from which next year's preference labels are drawn. Every downstream use pays back into the same calibration discipline.

## The four pieces every team eventually needs

Every mature team I have seen converges on the same four components. The order matters less than the property that all four exist and feed each other.

### 1. Calibrated judges

The load-bearing piece. The temptation is to treat a judge as code (a prompt and a model) and version it like a script. The compounding version treats it as a measuring instrument with documented error characteristics. Every production judge should have, on a wiki page somebody can find: position-consistency rate, human-agreement rate, score distribution, and the version of the underlying judge it was last calibrated against. A judge whose biases you have not characterised does not produce results, it produces decoration.

The discipline that compounds here is *recalibration cadence*. Frontier judges update, generation distributions drift, rubrics evolve. Bake recalibration in from day one: quarterly at minimum, every model swap whether planned or not. [Pairwise comparison](/blog/2026/pairwise-position-bias/) is the most reliable primitive to build on: it sidesteps the calibration headache that plagues pointwise scoring, and its main weakness, position bias, is well-understood and cheap to mitigate.

### 2. Regression suites

Every failure mode discovered in production becomes a permanent test case. Said out loud it sounds obvious; in practice almost nobody does it. Production failures arrive in inconvenient formats (a Slack thread, a support ticket, a screenshot), and distilling them into reproducible cases is unrewarding. Nobody is promoted for adding the 4,127th regression case. Everybody is blamed when the bug ships again.

The leadership move is to make the regression suite a first-class on-call deliverable. A bug fix is not closed until it has a test: not a unit test on the code change, but an evaluation case on the *behaviour*. The technical piece is straightforward; the organisational piece is the bit that has to be enforced for the first six months before it self-sustains.

### 3. Drift monitoring

Evaluation that only runs at launch tells you whether the model was good on a snapshot. Drift monitoring tells you whether it still is. The pieces are unglamorous: input drift on traffic features, output drift (more refusals, longer responses, more hedging this week?), and judge-score drift on production-sampled outputs.

Most teams operate on the assumption that no news is good news. Wrong. Silent degradation is the default failure mode of an LLM system, because nothing throws an exception when the model is fluently wrong more often than it used to be. This is also where evaluation pays back into the cost stack: a confidence-based router whose escalation rate has crept up over a quarter is telling you something, and the team that monitors it gets weeks of warning.

### 4. Golden sets

The smallest of the four. A hand-curated, human-labelled, slowly evolving collection of canonical examples: cases you know the right behaviour on, cases that have to keep working forever. A few hundred is plenty.

The golden set is the calibration anchor for everything else. Judges are calibrated against it, regression suites sanity-checked against it, new methodologies validated by checking they produce the same verdicts as humans on it. It compounds the hardest because every other piece of the stack derives its credibility from it. The mistake is letting it drift toward cases that are easy to label rather than cases that matter. Every six months somebody senior should ask: are the cases that are actually hard for our current model represented here?

## Organisational mistakes that decay the asset

The infrastructure can be perfect on paper and still rot if the surrounding organisation is set up to depreciate it.

**Eval owned by whoever shipped last.** Rotating ownership across teams is the surest way to make sure nobody owns it. Judge prompts get a different opinion every quarter, the rubric evolves toward whatever the current shipper found inconvenient, calibration discipline lapses. Compounding evaluation needs a stable owner with a multi-year mandate.

**Evaluation as a launch-blocker only.** If the only time it gets attention is when preventing a launch, it will be optimised against launches. Judges drift permissive, regression suites accumulate exemptions. Evaluation has to be a launch-*enabler*: the thing that lets you ship faster because you can prove the change is safe.

**Pointwise leniency and the slow drift to "all green."** Pointwise judges have a leniency bias and their effective scale compresses over time. Teams reporting only mean scores see them creep up while real quality is flat or falling. The fix is rubric anchoring, score-distribution monitoring, and a pairwise primitive underneath. If your dashboard has not had a "score went down" moment in a year, your evaluation is broken.

**Treating human labels as a cost line, not an asset.** Human-labelled data is the most valuable artefact in the entire stack. Teams that procure it transactionally ("we need 500 labels for this launch") never accumulate the labelling discipline (rubric definition, annotator calibration, agreement measurement) that makes the next batch more valuable than the last. The model can be replaced. The reward function can be retrained. Labelled preference data accumulates value at a rate the rest of the stack cannot match.

## For technical leaders

The right question is not "how good is our evaluation?" It is "is our evaluation getting better, quarter on quarter, without anyone being told to make it better?" If the answer is no, you have a depreciating asset, and the depreciation will catch up on a schedule you cannot control, usually right when the next model swap or regulatory ask lands.

Evaluation infrastructure is one of the highest-leverage hires you can make. Not because the engineers are cheap (they aren't, and rightly so), but because the work compounds across every model the org will ever ship. A model researcher's contribution decays the moment the next model is released. An evaluation engineer's accumulates. Two years in, the team with strong evaluation infrastructure is shipping faster, with smaller error bars, on the same headcount as the team that put everything into model work.

The other point is that evaluation is the *connective tissue* between the disciplines this series has been about. [LLM-as-judge](/blog/2025/llm-as-judge/) is evaluation. Reward modelling is evaluation with a gradient through it. LLM routing is evaluation that decides which model handles each query. Drift monitoring is evaluation in the time dimension. Pull on any thread and you find the same calibration data, the same human-labelled anchors, the same regression suite at the other end.

## How to start

If you are inheriting an evaluation pipeline built as a project, here is the order I would untangle it in:

1. **Audit what survives the next model swap.** Anything that doesn't is either a candidate for the regression suite, the golden set, or the bin.
2. **Stand up the four pieces, even crudely.** A small calibrated judge with documented bias rates, a regression suite that grows on every production bug, basic drift monitoring, a couple-hundred-row golden set. All need to exist.
3. **Make recalibration a recurring line item.** Quarterly fresh human labels, judge-vs-human agreement recomputed, drift baselines refreshed.
4. **Find a stable owner.** The single most important organisational decision. Without one, the rest of this list does not survive the next launch.
5. **Connect the eval pipeline to a downstream consumer.** Routing-quality measurement, reward-model curation, prompt-regression CI: pick one and wire it up. Evaluation with three consumers stays honest in a way evaluation with one does not.
6. **Track the asset, not the metric.** Suite size, recalibration recency, human-label volume, judge-agreement rate, regression-case growth rate.

The first four are non-negotiable. The last two are the difference between an evaluation pipeline you ship through and one that ships through you.

The teams that win the next decade of LLM deployment will not be the ones with the best models; frontier models are converging, and the gap closes every quarter. They will be the ones with the best evaluation infrastructure underneath them. Models will be replaced. Evaluation, if you build it correctly, is forever. Build the asset. Fund the asset. Let it compound.

_This post reflects my personal views and experience. It does not represent official Amazon positions._
