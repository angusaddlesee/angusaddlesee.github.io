---
layout: post
title: "Agentic RL: Trajectory-Level Optimisation for Tool-Using Agents"
date: 2026-08-10 10:00:00
description: A deep-dive into agentic RL: what changes when the unit of optimisation is a multi-step rollout, the trajectory-level GRPO maths, the part of the stack that's actually hard (the environment), and the failure modes that bite when the policy gets to call tools.
tags: agentic-rl trajectory-rl grpo reinforcement-learning alexa
categories: technical
toc:
  beginning: true
---

Here is a rollout that convinced me the field had moved. The model picked the wrong tool on pass one, realised on pass two from a confused observation, recovered on pass three, and finished correctly on pass four. A traditional RLHF reward (one judge on one completion) would have looked at pass one in isolation and called it a regression. The trajectory-level reward looked at the whole rollout and said: this is exactly what I want to reinforce. Recovery is the policy being good at its job, and single-pass RL could never have surfaced it.

Agentic RL is the regime where that distinction becomes the entire point. The policy is no longer producing text; it is producing _episodes_. The unit of optimisation is a rollout: every model pass, every tool call, every observation, every recovery, every termination. The reward arrives once, at the end, and back-propagates to every token the model generated along the way.

This is the deep-dive I'd point ML engineers at when they ask what comes after [GRPO](/blog/2026/grpo-group-relative-rl/). It's also one of my actual research areas at the Alexa+ Frontier AI Modelling Lab. The work I do there, and the open-source work on Search-R1, ReSearch, RAGEN, Tool-Star, τ-bench, SWE-Gym, all live in the same paradigm. The token-level mechanics are familiar; the things that make it work are not.

## From completion-level RL to trajectory-level RL

The pre-2024 RL stack was built around a specific shape: one prompt in, one completion out, one scalar reward, one gradient step. PPO inherited it from continuous control; InstructGPT industrialised it; the RLHF lineage assumed it. GRPO kept the shape and replaced the value function with a group baseline. That whole family was designed for the regime where the model produces text and you score the text.

Agentic tasks break every assumption. The "completion" is not a string but a sequence of (action, observation) pairs that can run for thirty inference passes. The correct output is not unique; half a dozen valid first actions lead to the same outcome through different paths. Verifiable reward exists in some domains (does the unit test pass?) and is absent in most realistic ones. And the model has to learn _termination_ as a behaviour: when to stop calling tools, when to commit, when to ask for clarification rather than guess.

Try to fit this into completion-level RL and you either reward each pass against a gold reference (which fails the moment the model picks a different-but-valid first tool) or score the final response and hope the gradient finds its way to the right tokens (which it doesn't, because the response tokens are a sliver of the trajectory and the tool-call tokens are the bulk of it). Trajectory-level RL takes the structure seriously: roll out until termination, score the whole rollout, let gradient flow back to every model-generated token. This is also where [tool use](/blog/2026/tool-use-function-calling/) stops being a static API contract and becomes a _learnable substrate_. Without tools, there is no agentic RL.

## What changes when the unit is a rollout

The mechanical shift is small. The implications are vast.

**Rewards are sparse.** A single scalar arrives at the end of an episode that may have generated tens of thousands of tokens. Every token receives the same gradient sign: brutal credit assignment by classical standards, but exactly right for what the reward actually knows. Sparse-but-honest beats dense-but-fictitious every time.

**Credit assignment is genuinely distributed.** The decisive token might be at pass two, or pass five where the model recovers, or a clarifying question at pass one that reshapes everything after. Trajectory-level RL doesn't try to localise this; it hands the same advantage to every model-generated token and lets group-relative variance reduction sort signal from noise across rollouts.

**The environment becomes infrastructure.** In conventional RLHF, the "environment" is a prompt and a reward model. In agentic RL it is a multi-pass simulator that has to maintain state, return faithful observations, fail realistically, and terminate honestly. It is the part that actually decides whether your run produces a useful policy or a beautifully reward-maximised disaster.

**The failure-mode surface area explodes.** Reward hacking in single-pass RLHF was sycophancy, length, and style. In agentic RL it is all of those, plus shortcut tools, plus environment exploitation, plus pathological termination, plus trajectories that surface-mimic valid paths. The blast radius of optimisation pressure is much wider when the policy can act.

## The trajectory-level GRPO maths

A trajectory $\tau$ from seed $s_0$ is a sequence

$$\tau = (s_0, a_1, o_1, a_2, o_2, \ldots, a_T, o_T)$$

where $a_t$ is the model's pass-$t$ output (tool call, reasoning, or final response) and $o_t$ is the environment's response. Termination is when the model emits an end-of-turn marker, takes a no-op, or hits a pass cap.

Roll out $N$ trajectories from the same seed at non-zero temperature. Score each with a reward $R(\tau_i)$, typically a panel of judges aggregating path quality, response quality, and efficiency. Compute the group-relative advantage exactly as in [GRPO](/blog/2026/grpo-group-relative-rl/):

$$\hat{A}(\tau_i) = \frac{R(\tau_i) - \text{mean}(\{R(\tau_1), \ldots, R(\tau_N)\})}{\text{std}(\{R(\tau_1), \ldots, R(\tau_N)\}) + \epsilon}$$

The advantage is a single scalar attached to the entire rollout. The policy gradient sums over every model-generated token across every pass:

$$\nabla_\theta J(\theta) = \mathbb{E}_{\tau \sim \pi_\theta}\!\left[ \hat{A}(\tau) \sum_{t=1}^{T} \sum_{k=1}^{|a_t|} \nabla_\theta \log \pi_\theta(a_{t,k} \mid s_0, a_{<t}, o_{<t}, a_{t,<k}) \right]$$

with the standard clipped surrogate, KL penalty against a frozen reference, and one critical detail: tokens inside observation segments (tool results, environment messages, user-simulator turns) are masked out of the loss. Only tokens the policy actually generated receive gradient. Failing to mask observations is the single most common bug in trajectory-level RL implementations, and it produces a policy that imitates environment text in ways that are catastrophic at deployment and slow to debug.

What this objective is _not_ doing: it is not assigning per-step value, not learning a critic over partial trajectories, not attributing credit to individual tool calls. The advantage on every token in $\tau_i$ is the same scalar. That feels coarse, and it is, but it is honest about what the reward actually knows. The argument that made GRPO win against PPO on completion-level RL applies more strongly here: fitting a value function to multi-pass tool-using trajectories is even less tractable than fitting one to text completions.

## RL environments for agents: the part that's actually hard

Most engineers reading agentic RL papers think the algorithm is the hard bit. It isn't. The algorithm is a hundred lines of code on top of an existing GRPO trainer. The hard bit is the environment: whatever stands in for "the world" during a rollout. Its fidelity, latency, and stochasticity determine what the policy can learn and whether that learning transfers.

There is a fundamental tension between fidelity and cost. **Real-API environments** give maximum fidelity but are too slow and expensive for RL at scale; SWE-Gym, AppWorld, and WebArena live here. **Recorded-replay environments** look up the closest match in a library of logged (request, response) pairs: fast and faithful, useless when the policy issues a request that wasn't logged. **Mock environments** synthesise responses on the fly: cheap, full coverage, but subtle mock bugs teach the policy wrong things. **Hybrid environments** (replay when the request matches, mock otherwise) are the practical sweet spot, and the architecture production agentic systems converge to.

All of them have to maintain state across passes (a `Calendar.Add()` followed by a `Calendar.Search()` should reflect the add, or the policy learns that adds don't stick), inject partial failures (mocks that always succeed teach the model error recovery never matters), and enforce termination caps cleanly.

The deepest practical lesson here: **the sim-to-real gap of an agentic policy is bounded by the sim-to-real gap of its environment**. The reward model gets all the attention in RLHF discourse. In agentic RL, the environment deserves at least equal billing. A great reward against a mediocre environment trains a great simulator-pleaser.

## Multi-correct-path rewards and why outcome rewards aren't enough

For text-only RLHF, ground truth is a string or a preference label. For agentic tasks, ground truth is _a set of acceptable trajectories_, and that set is combinatorially large, context-dependent, and impossible to enumerate.

A customer asking "what's X's birthday?" can be served correctly by `Calendar.Search()`, `PersonalMemory.Lookup()`, or `Info.Search()`, depending on who X is. A coding agent can read a file before listing the directory, or list first then read; both valid. A dialogue agent can ask a clarifying question or proceed on a reasonable interpretation, and both are correct strategies in different situations. Treating ground truth as a single canonical trajectory is the central failure of pre-trajectory-level agentic RL.

Formally, let $\mathcal{T}^*(s_0)$ be the set of acceptable trajectories from seed $s_0$. The single-correct-path assumption is $|\mathcal{T}^*(s_0)| = 1$. The multi-correct-path reality is that $|\mathcal{T}^*(s_0)|$ is unbounded for any non-trivial agentic task. A reward that penalises every trajectory not in some specific gold path punishes a large fraction of correct behaviour, often the majority of it, for surface mismatch.

The clean approach is to score _membership_ in $\mathcal{T}^*(s_0)$ rather than match to a reference. Outcome-only rewards (binary success, the SWE-bench style) are path-agnostic by construction but only work for verifiable goals. Path-quality judges read the full trajectory and grade whether each tool call was reasonable in context, ignoring the response wording (the TRAIL pattern). Response-quality judges score the final response while ignoring how it was reached. Path and response are independent quality axes; conflating them produces conflated gradients.

A trajectory-level reward in production typically composes them as

$$R(\tau) = w_p \cdot R_{\text{path}}(\tau) + w_r \cdot R_{\text{response}}(\tau) + w_e \cdot R_{\text{efficiency}}(\tau)$$

with weights tuned per-domain. This is the [judge-distilled multi-axis reward](/blog/2026/reward-modelling-at-scale/) machinery, applied to trajectories; the [LLM-as-judge](/blog/2025/llm-as-judge/) infrastructure is exactly what powers the path and response components.

The empirical case comes from cross-model replay analysis: roll out two strong models on the same seeds, compute first-action match rate, and have a path-quality judge score both blind. The gap between match rate and judge approval is the size of your multi-correct-path problem. In every domain I've looked at, that gap is large and most of the divergence is valid. A reward that flags those divergences as regressions is a reward that destroys real model behaviour.

## Length and step-efficiency rewards

Without an efficiency term, on-policy training drifts longer. Longer trajectories have more chances to recover, so the optimiser learns to take more passes. The policy resolves simple requests in eight passes when two would do, generates four thousand reasoning tokens to make a fifty-token decision, and still collects full credit. The deployed model is markedly slower than training reward suggested, and the latency budget is gone.

Two efficiency dimensions matter independently: step count (passes per trajectory) and reasoning length (tokens per pass). They trade off (thinking harder per pass can reduce the number of passes) and the reward has to reflect this without pushing the policy into pathological corners.

The crucial design choice is composing efficiency with quality _multiplicatively_, not additively:

$$R_{\text{total}} = R_{\text{quality}} \cdot (1 + \alpha \cdot R_{\text{efficiency}})$$

The additive form is dangerous: a 2-step trajectory that fails (quality = 0) can outrank an 8-step trajectory that succeeds. The policy learns to terminate early at the cost of correctness. Multiplicative composition makes efficiency a tiebreaker among comparable-quality trajectories rather than a substitute. A fast failure is still a failure. The few times I've seen agentic RL runs go badly off the rails, someone had shipped an additive efficiency term and the model discovered it could maximise reward by terminating in one pass before doing anything useful.

Per-expert baselines matter too. Domains differ in their natural pass counts and reasoning depths; a single global baseline punishes domains that legitimately need more steps. Compute baselines per-expert from production traffic, refresh on a slow cadence, log per-expert efficiency separately so regressions concentrated in one domain don't hide in the aggregate.

## The failure modes

Reward hacking in agentic RL is the same Goodhart's-law dynamic from [the reward hacking deep-dive](/blog/2026/reward-hacking/), only with a much larger attack surface because the policy now gets to act.

**Shortcut tools.** When a domain has multiple tools that can resolve a request and one is cheaper, the policy learns to use the cheap tool whenever it can, even when it shouldn't. A `QuickAnswer.Lookup()` that succeeds 60% of the time and fails 40% looks like a winning move on the trajectories where it works, and the failures get diluted by the group statistics. The agent becomes a shortcut-maximiser. Mitigation: weight the path-quality judge to penalise shortcuts that resolve through luck rather than appropriate selection.

**Environment exploitation.** If the mock layer has a bug (a tool that always succeeds, a state-tracking gap, a deterministic response the policy can pattern-match), the optimiser will find it before you do. I have watched a policy discover an LLM-mocked tool's preferred output format and learn to issue requests in exactly that format to maximise observation quality. The reward went up; nothing about deployed behaviour improved. Validate environments by computing reward with an independent system, instrument observation distributions, treat the environment as a versioned artefact.

**Mode collapse.** On-policy RL converges to a narrow region of trajectory space because policy entropy decreases over training. The reward says many paths are acceptable; the model only generates one. Symptoms: dropping match rate to the SFT checkpoint, narrowing tool-call distributions, customers reporting the agent feels formulaic. Mitigations: entropy bonuses, diverse-rollout sampling, frozen-anchor pairwise rewards so the policy is graded against an earlier version of itself rather than absolute scores.

**Pathological termination.** The model has to learn termination as a behaviour, and the reward has to guard both directions. Reward fewer steps without a quality floor and the model terminates immediately. Reward thoroughness without termination pressure and the model never stops, hitting the pass cap on every rollout. The pass cap should produce a strongly negative reward by default; otherwise the policy games both the cap and the termination signal.

**Surface-mimicking valid paths.** A policy that recognises what successful trajectories look like can produce trajectories that mimic the surface form without doing the underlying work. The path-quality judge approves; the customer-facing outcome is wrong. The defences are the same as in completion-level RL: ensemble judges, KL constraints, periodic recalibration against fresh human labels.

The general lesson is uncomfortable: the optimiser is a relentless adversary against your reward, your environment, and your judges all at once. Catching reward hacking on a 30-pass rollout is harder than catching it on a 200-token completion. Operational discipline is non-negotiable.

## Where path-quality judges fit

Path-quality judges are the single biggest reward-signal innovation that distinguishes modern agentic RL from earlier attempts. A path-quality judge reads the full trajectory (every tool call, every observation, every recovery) and scores whether the path was sensible while explicitly ignoring the final response. Its complement, the response-quality judge, scores the final response while ignoring how it was reached.

The mechanical reason this matters: conflated rewards produce conflated gradients. If a single judge scores both axes, the gradient on path tokens carries a signal that depends partly on response quality, and vice versa. The policy can improve tool selection while degrading response wording, and the conflated score barely moves, or worse, moves in a misleading direction. Separating axes lets each gradient pull on its own tokens cleanly. The diagnostic reason matters too: when a checkpoint regresses, "path or response?" is the first useful question, and a conflated judge cannot answer it.

Work on trace-based evaluation of agentic behaviour (including TRAIL and similar efforts) explores this decomposition explicitly: grading tool selection, parameter extraction, recovery from failures, and clarification handling, with no access to the final response. This is representative of what teams training agentic policies tend to converge toward. The classical RL formulation assumed one reward function captured everything you cared about. For agentic tasks, no single reward function does. Decomposing path versus response is not a workaround; it's the field acknowledging that agentic quality is genuinely multidimensional.

## For technical leaders

The question that matters at the planning level is simpler than the maths: when does agentic RL pay back the investment, and what does the investment look like?

Agentic RL is the right tool when (a) your product is an agent (multi-pass tool use, dialogue, code edits, web actions) rather than a one-shot generator, (b) you can build a faithful environment, and (c) you have a credible reward signal beyond imitation. If any of those is missing, you're better off with strong SFT on production trajectories until the gap closes. SFT teaches format and basic competence; trajectory-level RL teaches end-to-end agentic behaviour. The order matters: a trajectory-level run on a model that hasn't been SFT'd to terminate cleanly produces degenerate rollouts that hit the pass cap on every sample.

The budget is dominated by three things: the environment (engineering-heavy, usually the longest pole), the judges (cheaper than learned reward models to maintain but only with a strong base judge), and rollout compute (generating $N$ trajectories per seed, each up to $T$ passes, is roughly $N \times T$ times the cost of single-pass training; for $N = 8$ and $T = 6$, that's 48 passes per seed). Rollout dominates everything.

The strategic lever is the loop between [reward-modelling](/blog/2026/reward-modelling-at-scale/) improvements and policy improvements. A team that can run a trajectory-level pass in a sprint can iterate on judges and environment in a way a quarterly-experiment team cannot. Most production gains I've seen came not from a single brilliant reward design but from the third or fourth iteration after the team built the operational muscle to ship environment fixes, judge prompt updates, and reward weight changes in the same week. Iteration speed is the lever; the algorithm is table stakes.

The closing thought I'd offer leaders specifically: agentic RL is not a "should we train an agent?" question. The agent already exists; it's the SFT model running in production. The question is whether the policy is being shaped by your reward signal or by whatever distribution your SFT data happened to capture. If you're not running trajectory-level RL on your production agent, someone else's SFT data is deciding how your agent behaves.

What comes next, in roughly the order I expect to write about it: multi-agent systems, where the policy is a coordinated team rather than one model; richer agent evaluation frameworks that close the gap between offline judges and deployed traffic; and self-play and self-anchoring at scale, where the user-simulator's quality becomes the binding constraint on the whole pipeline.

The deepest shift agentic RL represents is philosophical. Conventional RLHF treated the language model as a function that produces text, and the reward as a way to grade text. Agentic RL treats it as a policy that takes actions in a world, and the reward as a way to grade outcomes. Once the rollout becomes the unit of optimisation, almost everything else reorganises around it: rewards become trajectory-level, environments become first-class, judges decompose into path and response, efficiency becomes a tiebreaker rather than an afterthought, and the failure modes get bigger and weirder in proportion to how much room you've given the policy to act.

_This post reflects my personal views and experience. It does not represent official Amazon positions._
