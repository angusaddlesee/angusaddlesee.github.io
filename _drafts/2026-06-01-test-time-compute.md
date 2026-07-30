---
layout: post
title: "Test-Time Compute: The New Scaling Axis"
date: 2026-06-01 10:00:00
description: Why training-compute scaling is hitting marginal returns, what test-time compute actually is, and how the o1/R1 wave changed how we think about inference cost, routing, and capability.
tags: test-time-compute reasoning inference scaling-laws machine-learning
categories: technical
toc:
  beginning: true
---

For most of the last six years the answer to "how do we make the model better?" was "make the model bigger." Pretraining compute was the lever, the Kaplan and Chinchilla curves were the maps, and the marginal dollar bought a measurable bump in benchmark scores. The curve has flattened enough that the marginal dollar buys less than it used to, and the field has visibly reorganised itself around a different lever: spending compute at _inference_ time. o1, o3, DeepSeek-R1, and the broader reasoning-model wave made it concrete. Test-time compute is the new scaling axis, and it is reshaping what a competent LLM platform looks like end-to-end.

This post is the mental model I'd point ML engineers and technical leaders at when they ask why every frontier model now has a "thinking" mode, what it costs, and what it changes about inference design. It connects directly to the [LLM routing pillar](/blog/2025/llm-routing-at-scale/): once you accept compute can be spent per-query, you have a routing problem whether you wanted one or not.

## The training-compute plateau and why test-time compute matters now

Training-compute scaling has not plateaued in absolute terms; it has plateaued in marginal terms. Chinchilla scaling is still approximately right, but a power law with the exponent we measure is brutal. Going from 70B to 700B is a 10× compute increase for an unimpressive fraction of the loss reduction the previous decade conditioned us to expect. Frontier base models had converged on similar capability ceilings on the benchmarks that matter, and pretraining was no longer the place where a single team could open a meaningful gap.

Test-time compute opened a new axis. The insight, formalised by Snell et al. (2024) in "Scaling LLM Test-Time Compute Optimally Can be More Effective than Scaling Model Parameters," is that for a fixed compute budget you can choose where to spend it. Train a bigger model and run it once per query, or train a smaller model and run it many times: sampling, searching, refining. On problems where the smaller model already has a non-trivial success rate, the second strategy wins: Snell et al. report that in a FLOPs-matched comparison, test-time compute can outperform a model roughly 14x larger. The compute-optimal frontier between model size and inference compute is a curve, not a point, and the right place on it depends on the difficulty distribution of your queries.

o1 was the first commercially deployed model that visibly spent inference compute as a first-class capability. DeepSeek-R1 reproduced the recipe in the open. The question for product teams stopped being "do we believe the test-time compute story?" and became "how much compute do we spend, on which queries, and how do we pay for it?"

## What test-time compute actually means

The phrase gets used loosely. It is worth pinning down the design space, because the methods have very different cost-quality and latency profiles.

**Best-of-N sampling.** Generate $N$ independent completions with $T > 0$, score each with a reward model or verifier, return the best. The maths is extreme-value statistics: if samples are correct with probability $p$, the chance at least one of $N$ is correct is $1 - (1-p)^N$. For $p = 0.3$, $N = 10$ that is 97%. Embarrassingly parallel, works with any scorer including non-neural verifiers like a code sandbox. Limitations: linear cost in $N$, no early pruning, quality ceiling set by your reward model.

**Self-consistency.** Generate $N$ samples, take the majority answer. Works when there is a discrete answer to vote on. On maths with a clean final answer it is one of the strongest baselines for the compute it costs.

**Beam search and tree-of-thought.** Where best-of-N samples whole solutions, these search over partial ones: generate the next reasoning step, score it, expand the most promising. Beam search keeps a flat top-$k$; tree-of-thought maintains a tree with branching and backtracking. A wrong step gets pruned before you've spent compute on the rest. The cost is sequential structure and a per-step scorer honest about partial solutions.

**Process-reward-guided search.** A process reward model (PRM) scores each reasoning step rather than just the final answer; beam search uses those step scores as the heuristic. Lightman et al. (2023)'s "Let's Verify Step by Step" showed PRM-guided selection beating outcome-only selection on MATH at matched compute. Step-level labels cost several times what outcome-level preferences do, but the payoff is dramatically denser supervision. This is where the test-time compute story collides directly with the [reward modelling pillar](/blog/2026/reward-modelling-at-scale/).

**Iterative refinement.** Generate, critique, revise, repeat. Reflection and self-correction live here. Gains depend on whether the model can identify its own mistakes, which, empirically, it can on some task types and cannot on others.

**Learned reasoning (o1, R1, the rest).** The most interesting branch, because it moves test-time compute from something you bolt onto a model into something the model knows how to use. Instead of an external loop calling the model $N$ times, you train the model (typically with RL on verifiable rewards, in the [GRPO](/blog/2026/grpo-group-relative-rl/) style) to generate long internal "thinking" traces before answering. From the outside it is one forward pass, just much longer. From the inside it is the model running its own search inside the chain of thought. R1 is the cleanest open-weights example: sparse rule-based rewards on maths and code, GRPO as the optimiser, and an emergent capability to spend tokens on reasoning that nobody explicitly programmed in.

These methods compose. A learned reasoning model running self-consistency over $N$ traces with a verifier on the final answer is a real configuration.

## The maths of how thinking longer helps

Test-time compute scaling laws have the same shape as training ones: roughly log-linear improvement per doubling of compute, with diminishing returns and an effective ceiling. Pass@N for best-of-N follows the extreme-value form,

$$P(\text{at least one correct in } N) = 1 - (1 - p)^N$$

which rises rapidly for small $N$ and saturates. The interesting plot is not pass@N (that is the right plot for a perfect verifier) but selected@N: the probability your reward model picks a correct sample given one exists in the batch. Selected@N is bounded by pass@N from above and reward model accuracy from below. The gap is headroom you gain by improving the reward model rather than increasing $N$.

For learned reasoning models the empirical scaling looks like

$$\text{accuracy} \approx \alpha + \beta \log(C_{\text{inf}})$$

where $C_{\text{inf}}$ is inference compute per problem. Snell et al.'s result is that on easy and medium problems, within the base model's reach, test-time compute substitutes well for a larger model and often wins outright. On the hardest problems it inverts: additional pretraining compute is the more effective lever, because no amount of sampling or refining rescues a query the base model cannot get non-trivially right in the first place. Their headline caution is that test-time and pretraining compute are not 1-to-1 exchangeable.

The budget question gets sharp. If marginal accuracy is logarithmic in inference compute, the cost of the next percentage point grows exponentially. The first 4× from $N=1$ to $N=4$ is cheap. The next 4× to $N=16$ is the same multiplicative gain at four times the cost. By $N=256$ you are paying two orders of magnitude more compute for a few percentage points that may not survive a real-world distribution. The only question is which point on the budget curve your unit economics tolerate.

## What works, what's marketing

Some of the story is genuinely impressive. Some is benchmark-flattering noise.

**Verifiable reasoning is real.** On maths, code, and formal logic, test-time compute moves the frontier substantially. R1's MATH numbers, o1's competition-coding scores, the gains on AIME and IMO-style problems are not artefacts. When the verifier is perfect, more compute monotonically helps, because the only failure mode is sampling variance.

**Open-ended generation is murkier.** For tasks without a clean correctness signal (creative writing, summarisation, open dialogue) gains are smaller and depend heavily on the reward model. Best-of-N over a preference reward model is at significant risk of reward hacking. Without a verifier, the upper bound is the calibration of your scorer, and that bound is tighter than benchmark plots admit.

**The "thinking tokens" plot is real.** Both o1 and R1 show clean monotonic relationships between average reasoning length and benchmark difficulty. That is one of the clearer signals the model has internalised compute allocation rather than producing reasoning theatre.

**Latency claims are often dishonest.** Gains get reported in pass@N or thousands-of-thinking-tokens, not milliseconds. A model that thinks for 10,000 tokens before responding pays that latency on every user, not just the hard queries. You often need a separate fast path for queries that do not benefit from reasoning.

**The verifier does more work than the prose admits.** Headline results rely on a strong outcome verifier or PRM. Without one, best-of-N collapses toward majority voting and tree search toward random walk. Improving the verifier is often a better use of compute than scaling search around it.

## Implications for inference cost and routing

Once test-time compute is on the table, routing stops being a cost-cutting trick and becomes the central design problem. The question is now one dimension richer: not just "which model" but "how much compute on this query inside this model."

The framing that has held up for me is the [cascading LLMs](/blog/2026/cascading-llms/) one: spend a small amount of compute deciding how much compute to spend. A short pass on a small model produces both a tentative answer and a difficulty signal: perplexity, self-consistency across cheap samples, length and structure of the output. That signal gates whether to escalate to longer reasoning, more samples, search with a verifier, or a frontier reasoning model. Same architecture as cost-driven routing; the dimension routed over is inference compute rather than model identity.

A reasoning model emitting 10,000 tokens on every query costs roughly an order of magnitude more per request than a non-reasoning model, not because the per-token price differs but because the token count does. If a meaningful fraction of traffic does not need reasoning (in conversational AI most turns do not), defaulting every query to the reasoning model is the same mistake as defaulting every query to the largest model. A future inference cost modelling post will have the spreadsheet; the qualitative answer is that uniform reasoning-mode is rarely cost-optimal and rarely quality-optimal; reasoning on simple queries adds latency for no gain.

## For technical leaders

Test-time compute reorganises the unit economics of LLM serving in a way the previous wave of cost-cutting (quantisation, KV-cache tricks, speculative decoding) did not. Those were efficiency improvements at fixed quality. Test-time compute is a different curve: you can buy more quality at higher cost, per-query, dynamically. That puts more pressure on the platform's ability to allocate it well.

Three things follow. First, your inference bill will be more variable than it has ever been; hard queries can cost one to two orders of magnitude more than easy ones, and GPT-3.5-era finance forecasts will not survive a fleet running reasoning models on demand. Second, latency SLAs need revisiting. A platform promising sub-second responses is incompatible with one thinking for ten seconds on hard queries, and the honest answer is tiered SLAs by query class. Third, evaluation matters more, not less. The Pareto frontier between cost and quality is now two-dimensional, and you cannot navigate it without trustworthy measurements of both axes.

The mistake to avoid is treating test-time compute as a feature to ship rather than an architecture to design around. The teams that do well treat inference compute as a first-class allocated resource (measured, routed, and billed per query), not as a fixed property of the model they happened to deploy.

Zooming out: test-time compute is the fourth axis of LLM scaling, alongside parameters, training data, and post-training. The first three are levers you pull at training time and ship. The fourth you pull continuously, in production, on every request, which makes it the axis with the most leverage for product teams, and the reason it ties the rest of this series together: reasoning models are valuable because they use test-time compute well, reward models are the verifiers that make search work, the routing layer is how you allocate inference compute per query, and the [agentic RL deep-dive](/blog/2026/agentic-rl/) is what happens when it extends to multi-step rollouts with tools.

Training-compute scaling did not stop working; it stopped paying back fast enough to be the only thing worth doing. Inference is where the marginal quality now gets bought, and serving stacks that still assume one forward pass per query are pricing the wrong product.

_This post reflects my personal views and experience. It does not represent official Amazon positions._
