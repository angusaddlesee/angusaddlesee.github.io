---
layout: post
title: "LLM Routing at Scale: Why You Shouldn't Send Every Query to Your Best Model"
date: 2025-12-01 10:00:00
description: A practical guide to designing LLM routing systems that meaningfully cut inference cost without sacrificing quality.
tags: llm-routing inference conversational-ai alexa machine-learning
categories: technical
thumbnail: assets/img/alexa.jpg
toc:
  beginning: true
---

You shouldn't send every query to your best model. The routing layer that decides which model handles each request is, in my experience, the difference between an LLM platform that survives scaling and one that doesn't. Most of your traffic is easy, easy queries don't benefit from a frontier model, and paying frontier prices for them is a tax on quality, latency, and budget all at once.

That's the whole message. If you read no further: build a router, build it early, and build your evaluation before you build the router. The rest of this post is the detail behind that, layered so you can stop whenever you've read enough.

I work on this at Amazon Alexa, so my bias is towards real-time, voice-first systems where latency is unforgiving. But the economics below apply to any LLM platform that's growing.

## The economic problem that makes routing inevitable

If you serve LLMs to even a modest number of users, you've already noticed the shape of your traffic. A small share of queries are genuinely hard: multi-step reasoning, long-context synthesis, agentic chains where one wrong step poisons the rest. The rest are not. They're hellos and thank yous, "what's the time," "set a timer," "what's the temperature outside." The distribution is heavy-tailed: most queries are easy, and easy queries don't benefit meaningfully from a frontier model.

That asymmetry is what makes routing economically unavoidable. Suppose a large share of your traffic can be handled by a model that costs an order of magnitude less than your frontier option, and produces a response that is, on the relevant evaluation, indistinguishable. Routing those queries to the cheaper model strips a big fraction off your inference bill, frees frontier capacity for the queries that actually need it, cuts latency, and reduces the environmental cost of every easy request.

And the cheaper model isn't always the worse one. This is the part people miss: a smaller specialist can beat a larger generalist on its home turf. A maths-tuned model will often answer a maths question better than a frontier chat model, not just more cheaply. So a good router doesn't merely preserve quality while saving money, it can increase quality at the same time, by sending each query to the model that's genuinely best for it. Cost, latency, capacity, and environmental impact all improve, and performance can go up rather than holding steady.

The reason I'd flag this to a technical leader rather than leave it as an engineering detail: routing isn't an optimisation you bolt on later. It's a structural property of any LLM platform that intends to keep working as usage grows. Deferring it tends to mean rewriting the serving stack under pressure once the bill arrives.

## What "routing" actually means

At its core, a router is a function `r(x) → m`, mapping each incoming request `x` to one model `m` from a portfolio of options. The portfolio normally spans:

- Sizes (a 1B distilled model, a 7B mid-tier, a 70B+ frontier model, etc.)
- Specialisations (a code model, a maths-tuned model, a domain-specific fine-tune)
- Providers (open-weights you self-host alongside frontier APIs)
- Modes (a low-temperature deterministic mode versus a high-temperature creative one)

The router has to make this decision before generation, with very little latency budget, and it has to make it well enough that mistakes don't quietly degrade quality for the users who matter most.

There are two broad families. **Predictive routing** (also called pre-generation routing) decides which model to use _before_ generating anything: you look at the query, predict the best model, and send it there. **Non-predictive routing** (post-generation routing) goes the other way: you run the query through models in the pool, generate real responses, and then judge which one to return. Non-predictive routing gives you ground-truth responses to compare, but it's enormously expensive, because in its naive form every query is executed by every model. That maximises latency, capacity usage, and environmental impact.

**Cascading** is the standard optimisation of non-predictive routing. Instead of running all models, you try a cheap model first and escalate to a stronger one only when a quality gate decides the cheap response isn't good enough. You still generate real responses, but you stop early on the easy queries. Its weakness is the tail: a genuinely hard query can pass through every model in the pool in sequence, paying all of their generation costs end to end.

There's a useful hybrid. Use a predictive router to choose a _subset_ of the pool (say three models), then cascade through just those. This keeps the safety of generating-and-checking while avoiding the worst case where a tough query crawls through the entire pool one model at a time.

For voice assistants, predictive routing is really the only viable option. The latency of generating multiple full responses before returning anything is incompatible with real-time, barge-in conversation. If you can tolerate latency overhead and can't tolerate silent quality regressions (high-stakes generation, customer-facing reasoning), cascading or the hybrid becomes attractive. Most mature systems that aren't latency-bound end up combining predictive selection with a cascade behind it.

## The signals a router can use

In production you usually combine several of these rather than rely on one:

**Query features.** Length, language, presence of code blocks, detected task type, named entities, syntactic complexity. Crude but cheap, and more effective than you'd expect as a first pass. A rule as simple as "if the input contains a code block, route to the code-tuned model" closes a surprising amount of the gap to a learned router, and it takes an afternoon to write.

**Embedding similarity.** Map the query into a semantic space and compare it to centroids of routes you've defined by example. This is the basis of semantic routing, which I'll dedicate a separate post to. Latency is around 1 to 5ms on a small encoder. It's fast, easy to update without retraining, and extends naturally to routing across RAG pipelines or tool sets. The weakness: semantic similarity is not the same as task difficulty. "What is 2+2?" and "What is the integral of $e^{x^2}$?" are both maths queries, but only one of them needs your best model.

**Learned classifiers.** Train a small encoder, typically a distilled BERT, on `(query, best_model)` triples gathered offline. This is the primary router type in the literature. The router's job is easier than the LLMs it routes to: it doesn't have to answer the query, only predict which model will. A modest labelled set is usually enough to beat a strong heuristic baseline, provided the labels are honest.

There's a deep problem with classification at scale, though, and it's one I ran into directly in a tool-calling system like Alexa (it deserves its own post, so I'll only sketch it here). To build `(query, best_model)` labels, you need to know how _every_ candidate model would have performed on each query. That's the counterfactual. In a tool-calling setting you can't get it. The model that was actually served handled the customer's real context and called real tools, so you know how _it_ did. But if a different model would have diverged (called a different tool, taken a different action), you can't replay that against production APIs with the customer's context. You simply never observe the counterfactual performance of query X on model M unless M was the model that served X.

**Reward prediction.** This is the alternative to classification that the counterfactual problem pushes you towards, and it's the approach I find most powerful at scale. Instead of training a classifier on "which model is best," you train a **reward predictor head per model**, each on the traffic that model actually served at runtime. Add a little routing exploration (deliberately sending some queries to non-default models) and you build up good coverage of how each model performs across the query space, without ever needing a counterfactual you can't observe. At inference, you predict the reward each model would earn on the incoming query and select the highest. The selection also composes cleanly with operational constraints: if a model is capacity-constrained, you add a cost to its predicted reward, so it's chosen only when it's predicted to be meaningfully better than the alternatives, not just marginally.

**Self-signals from the cheap model.** Token-level log-probabilities, perplexity, hedging language, self-consistency across samples. These come almost free if you're already running the small model, and they enable cascading without a separate verifier. The catch, and it's a serious one, is calibration. Models can be fluently, confidently wrong, especially on factual questions. A confidence-based gate is only as honest as the underlying model's calibration.

## The optimisation problem, written down

Once you accept that routing is unavoidable, the underlying decision is just constrained optimisation. Given models $\{m_1, \ldots, m_K\}$ with per-token costs $\{c_1, \ldots, c_K\}$ and a routing function $r(x)$:

$$\min_{r} \; \mathbb{E}_x[c_{r(x)} \cdot \text{tokens}(x)] \quad \text{subject to} \quad \mathbb{E}_x[q(m_{r(x)}, x)] \geq Q_{\min}$$

where $q(m, x)$ is the quality of model $m$ on query $x$ and $Q_{\min}$ is your quality floor. The whole engineering effort (classifiers, gates, thresholds, evaluation) exists to estimate two things: the per-query difficulty, so you know which $m$ is sufficient, and the per-query cost, so you can price the choice.

The optimal router exploits the fact that quality differences between models are heterogeneous across the query distribution. On easy queries the gap is roughly zero; routing to the large model is wasted money. On hard queries the gap is large; routing to the small model is wasted quality. Routing is the act of making this trade-off query by query rather than blanket-defaulting at the platform level.

Two practical implications fall out of this. First, your router's quality is bounded by the quality of your evaluation. You can't route well if you can't tell which model "won" on a given query, which is why I keep coming back to [LLM-as-judge](/blog/2025/llm-as-judge/) and reward modelling. Second, the optimal trade-off shifts every time a new model is released or repriced. A routing strategy that was optimal six months ago is almost certainly suboptimal today. Treat the router as something you recalibrate, not a piece of static code you ship once.

## The failure modes nobody warns you about

What separates a routing system that quietly compounds value from one that quietly destroys trust is mostly which of the following you've taken seriously.

**Silent quality regressions.** When a router misclassifies a hard query as easy, the user sees a degraded answer and has no way to know why. Unlike cascading, a predictive router has no safety net, because it commits to a model before any response exists to check. The mitigation is twofold: a small "shadow" sample of the large model's response on a fraction of small-model traffic, plus continuous online evaluation that flags drifts in quality per route, not just on average.

**Tail behaviour eaten by averages.** Optimising mean quality can mask catastrophic behaviour on a small slice of users. If your router fails reliably on a particular minority of phrasings, such as non-native English, dialect, or accessibility-driven speech patterns, average metrics won't catch it, and that's exactly the slice where you most need to be right. This connects directly to my research background on conversational AI for people with dementia: variance across the user distribution is a system-design problem, not a corner case.

**Calibration drift.** A confidence threshold that was well-calibrated at deployment will be miscalibrated three months later, because user behaviour, query mix, and model versions all shift. Without monitoring, the cascade slowly stops cascading, either over-escalating (cost climbs) or under-escalating (quality drops). The fix is boring: track the escalation rate, the per-route quality, and the marginal cost weekly, and recalibrate.

**Latency that hides in p99.** Average latency will look fine while tail latency quietly destroys the conversational experience. In voice especially, every additional fraction of a second is felt. Cascades that escalate any non-trivial fraction of traffic can have catastrophic p99, because escalated requests pay both models' generation time end to end. Speculative cascading, where you fire both in parallel and cancel the loser, is the right antidote when the latency budget is hard.

**The router itself becoming a bottleneck.** A router with three classifiers, an embedding model, and a verifier costs real compute. Routing overhead has to stay an order of magnitude below the inference savings, or you're paying yourself to think. Profile end to end before believing the savings number on the slide.

## How to actually start

If you are kicking off a routing project this quarter, here is the order I'd run it in:

1. **Build the evaluation before the router.** A reliable held-out set of representative queries, scored by a calibrated judge (or humans, where stakes warrant it). You cannot optimise what you cannot measure, and offline metrics like BLEU will mislead you on open-ended generation.
2. **Start with two models and a rule-based router.** Length, code-block detection, language. You will capture more of the easy savings than you expect, and you'll learn the shape of your traffic before committing to learned routing.
3. **Add a confidence-based cascade behind it.** Mean token log-probability is a free signal. Pick an initial threshold that sends most queries through the small model on a held-out set, then move it as you watch quality.
4. **Train a learned router only when the rules plateau.** A distilled encoder on a modest labelled set is usually sufficient. Resist the temptation to over-engineer.
5. **Instrument before you scale.** Cost per query, per-route quality, escalation rate, p50/p95/p99 latency, router error rate. Alert on drift.
6. **A/B test against the all-frontier baseline.** Offline numbers always look better than reality. The only honest measurement is users.

Routing isn't a cost-cutting hack to bolt on after launch; it's an architecture decision that shapes whether your LLM platform keeps working as it grows. Get it right early and cost and quality improve together, and if you get it wrong you'll find yourself repeatedly asking for more compute to paper over a structural problem. I'll go deeper on cascading, semantic routing, learned routers, and the LLM-as-judge infrastructure that makes any of it measurable in later posts, because there is a lot of detail buried under that simple `r(x) → m`.

_This post reflects my personal views and experience. It does not represent official Amazon positions._
