---
layout: post
title: "Cascading LLMs: Try the Cheap Model First, and the Failure Modes Nobody Warns You About"
date: 2026-01-12 10:00:00
description: A deep dive into cascading as an LLM routing strategy: how it works, why the quality gate is everything, and where it quietly costs you more than the all-frontier baseline.
tags: llm-routing inference cascading machine-learning alexa
categories: technical
thumbnail: assets/img/alexa.jpg
toc:
  beginning: true
---

There is a very seductive idea in LLM serving that goes like this: most of the queries you receive are not hard, so why not ask a small model first, and only fall back to the expensive one when the small model isn't sure? It feels obvious, and the napkin maths is intoxicating: a meaningful share of your traffic served at an order of magnitude lower cost, with quality almost indistinguishable from your frontier model. Cascading is what we call this idea once you've turned it into a system.

I've spent enough time inside the Alexa+ Frontier AI Modelling Lab to have seen cascades work beautifully and seen them quietly compound failure. The difference is rarely the model choice. It's almost always the quality gate, and the discipline you bring to maintaining it. This post is the deep cut on cascading I wanted when I first started designing one. If you want the broader map of where cascading sits among other strategies, [the pillar post on LLM routing at scale](/blog/2025/llm-routing-at-scale/) is the place to start; this one assumes you've read it.

## What cascading actually is

A cascade is a routing strategy that orders models by cost and capability, sends every query to the smallest first, and escalates to a larger model only when a quality gate decides the cheap response isn't good enough. The decision of whether to keep the small model's answer or escalate is the entire game. Stripped to its bones:

$$\text{response} = \begin{cases} f_{\text{small}}(x) & \text{if } g(f_{\text{small}}(x), x) \geq \tau \\ f_{\text{large}}(x) & \text{otherwise} \end{cases}$$

Three components: a small model $f_{\text{small}}$, a large model $f_{\text{large}}$, and a quality gate $g$ that scores the small model's response against a threshold $\tau$. The threshold is the knob you turn at runtime to balance cost against quality without retraining anything. Higher $\tau$ escalates more: better quality, higher cost. Lower $\tau$ accepts more: cheaper, riskier.

Note what cascading is _not_. It is not the same as upfront routing, where a classifier picks a model before any generation happens. In a cascade you always pay the small model's generation cost, even on queries you end up escalating. The bet is that the easy fraction of traffic is large enough, and the small-model cost low enough, that you come out ahead on average. Whether that bet pays out depends almost entirely on your traffic distribution and the gate's calibration.

For technical leaders weighing this against alternatives, the framing I keep coming back to is: **cascading buys you safety at the cost of latency**. If a regression in the cheap model is unacceptable for your product, the cascade's escalation behaviour is a structural backstop that upfront routing cannot give you. If your latency budget is tight (anything voice-driven), reach for semantic or learned routing instead, because escalated queries pay both models' generation time end to end.

## How a real cascade actually runs

The minimum viable two-stage cascade is straightforward: receive the query, generate from the small model, score the response with the gate (in the simplest setup, mean token log-probability, free because you already have the logits), accept if $g \geq \tau$, otherwise generate from the large model and return that.

The latency profile is the part most people underweight. Accepted queries cost small-model generation plus a near-zero gate evaluation. Escalated queries cost small-model generation _plus_ large-model generation, sequentially. That is strictly worse than routing directly to the large model. The cascade only wins on average, and only if the accepted fraction is high enough to amortise the escalation tax.

Multi-stage cascades (say a 1B → 8B → 70B chain) extend the same logic. Each stage catches a slice of queries, and only the hard tail reaches the largest model. They're tempting on paper and brutal in practice: every additional stage adds a quality gate that has to be calibrated, monitored, and maintained. Start with two stages, get the gate right, and only add a third when the data shows a meaningful middle band of queries that an 8B handles but a 1B can't.

**Speculative cascading** is the variant worth knowing if your latency budget is tight. Fire both models in parallel. If the gate accepts the small response, cancel the large model. If it rejects, you've already started the large model and paid almost no extra wall-clock time. The trade-off is wasted compute on cancelled requests; whether it's worth it depends on your scheduler and how much your product values bounded p99 over mean cost.

## The quality gate is the entire system

I cannot overstate this. The model choices are interchangeable. The threshold is a knob. The gate is where production reality lives or dies. There are four broad families:

**Confidence-based gates.** Use the small model's log-probabilities as a proxy for "did this go well?": mean token log-probability, the probability of the lowest-probability token, or perplexity. The appeal is that it's free. The catch is calibration: models can be fluently, confidently wrong, especially on factual questions where the next-token distribution is tight around an incorrect answer. Confidence is a useful signal, not a true one.

**Verifier-based gates.** Train a small classifier on $(x, r_{\text{small}}, \text{label})$ tuples where the label encodes whether the small response was good enough. Much more expressive than log-probabilities (it can pick up hedging, incompleteness, off-topic drift, formatting failures), but it requires labelled data and adds inference latency. If you've already invested in [LLM-as-judge infrastructure](/blog/2025/llm-as-judge/), the verifier is essentially a distilled judge with a tiny inference budget. The path I'd push for in a serious production system.

**Self-consistency gates.** Generate $k$ samples from the small model with non-zero temperature. If they agree, accept; if not, escalate. Signal is excellent; cost is $k\times$ small-model inference per query, which kills the economics unless your small model is genuinely tiny. Useful offline; rarely the right choice online.

**Rule-based gates.** Length thresholds, keyword detection, presence of code blocks or maths, detected language. Crude, cheap, and often the most honest place to start. "Escalate every query containing a code block" closes a surprising amount of the gap to a learned gate, ships in an afternoon, and is trivially auditable.

The gate that ends up in production is almost always a hybrid: log-probabilities as a fast first pass, rule-based escalation for high-stakes patterns, and a verifier for the ambiguous middle. Resist the elegance of a single-signal gate. Production traffic doesn't reward elegance.

## The maths people don't sit with long enough

Let $p$ be the fraction of queries the gate accepts, and $c_s, c_l$ the per-query costs of the small and large models. Average cost per query is

$$\bar{c} = c_s + (1-p) \cdot c_l$$

Notice the $c_s$ term is _not_ multiplied by $p$; you always pay the small model. The cascade only beats all-frontier when $p > c_s/c_l$. If the small model is an order of magnitude cheaper, your acceptance rate only needs to clear a small fraction. That's what makes cascading look so compelling on a slide. The part that gets glossed over: _quality_ is also a weighted average, over the small model's quality on accepted queries and the large model's on escalated ones, weighted by the gate. A gate that accepts queries the small model fails on degrades quality silently while the cost numbers look lovely. The cost side is trivial to measure and the quality side is not, and the quality side is the side that hurts you.

## The failure modes nobody warns you about

The cascades I've seen go wrong almost never failed because the model choice was bad. They failed because of one of the following.

**Confidently wrong small models.** The most common failure. A small model produces high mean log-probability for an answer that is just wrong: a fabricated date, a misremembered API signature, a plausible-but-wrong factual claim. The gate cannot detect this from probabilities alone, because the model is not internally uncertain. Mitigation: pair the confidence gate with a verifier on a sampled fraction of accepted traffic, and feed disagreements back into the verifier's training set. A data flywheel, not a one-off calibration.

**Calibration drift.** A threshold that achieves the right acceptance rate at deployment will not three months later. Your traffic shifts, the small model gets a quiet update, a prompt template changes, a feature launch tips the distribution. Without monitoring, the cascade slowly stops cascading: acceptance rate climbs and quality silently drops, or it falls and your savings evaporate. Track acceptance rate weekly. Recalibrate $\tau$ monthly. Boring, mandatory.

**Tail latency hidden in the average.** Your p50 can look beautiful while p99 is catastrophic, because escalated queries pay both models' generation time. Even a small escalating fraction punishes your slowest users twice, often disproportionately the ones with hard, ambiguous queries that need the most help. Voice does not forgive this. Speculative cascading exists precisely to fix it.

**Workloads where the premise doesn't hold.** If your traffic is uniformly hard (long-context document reasoning, creative writing, complex agentic tool use), the small model fails on most queries, the gate escalates most queries, and you pay both costs to deliver large-model quality. Before you build a cascade, run the small model on a representative sample and check that its natural acceptance rate at a defensible quality bar is meaningfully above $c_s/c_l$. If not, you're in cascade-hostile territory.

**Infrastructure costs that don't scale with average cost.** Cascading reduces average cost per query, but not peak capacity for the large model. You still need to provision it for the escalated fraction during busy minutes, which scales with total traffic rather than the mean. Finance teams modelling unit economics on average cost will be surprised when the GPU bill doesn't fall as fast as the per-query number suggests.

## How to actually start

If you're putting a cascade into production this quarter, here is the order I'd run it:

1. **Build the evaluation first.** A held-out set of representative queries scored by something you trust: a calibrated [LLM-as-judge](/blog/2025/llm-as-judge/) at minimum, humans on the highest-stakes slice. You cannot pick a sensible $\tau$ if you can't measure quality.
2. **Run the small model on the evaluation set alone.** Look at the distribution of mean token log-probabilities, conditional on the small model being correct vs incorrect. The separability of those two distributions is an upper bound on how well a confidence-based gate can work. If they overlap heavily, you need a verifier, not a confidence gate.
3. **Pick a starting threshold honestly.** Err on the side of escalating more, because the cost of a silent quality regression is far higher than the cost of a slightly bigger inference bill in the first weeks.
4. **Add a small set of rule-based escalations on top.** Code blocks, maths, anything domain-specific where you know the small model is weak. Closes the most embarrassing gaps cheaply.
5. **Instrument everything.** Acceptance rate, per-route quality, p50/p95/p99 latency, cost per query, gate score distribution. Alert on drift in any of them.
6. **A/B against the all-frontier baseline.** Offline numbers will lie to you. The only honest measurement is real users on real traffic with real quality scoring.

## Where this fits

Cascading is one branch of the routing tree from [the pillar post](/blog/2025/llm-routing-at-scale/), and the branch I'd reach for when silent quality regressions are the failure mode you most fear. For latency-bound systems, semantic routing and learned routers are usually the right starting point; they make the model choice once, before generation, and avoid the escalation tax. For systems where you can tolerate sequential latency and you want a structural safety net against the small model's failures, cascading is the safer default. Most mature platforms end up with both: an upfront router picks a tier, and a cascade-style verifier escalates the small fraction of queries where the tier was wrong. The routing taxonomy is not a choice between strategies; it's a vocabulary for composing them.

If you take one thing away from this post, let it be this: the cascade is not the small model and the large model. The cascade is the gate. Every hour you spend on its calibration, monitoring, training data, and evaluation set pays for itself many times over. Every hour tuning the model choices does not. Build the gate well and the cascade compounds margin and quality together. Build it badly and you have written an extremely sophisticated way to lose money slowly.

_This post reflects my personal views and experience. It does not represent official Amazon positions._
