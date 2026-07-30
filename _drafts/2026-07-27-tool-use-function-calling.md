---
layout: post
title: "Tool Use and Function Calling Done Well"
date: 2026-07-27 10:00:00
description: "A practical guide to production-grade function calling: schema design, constrained decoding, error recovery, MCP, and the failure modes that bite once you leave the demo."
tags: tool-use function-calling agents llm machine-learning
categories: technical
toc:
  beginning: true
---

Two tool calls, same model. In the first, the user asks a question, the model emits a neat JSON object, your runtime hands the result back, and the answer is grounded in real data instead of a confident hallucination. In the second, on a different schema, the model invents an enum value that does not exist, passes a string where you wanted an integer, and hangs your service on a retry storm. Which one you get is mostly down to choices you made before the model ever saw a request.

Tool use is one of the most production-critical things modern LLMs do, and one of the most poorly written about. Most public material is marketing or framework docs demonstrating the happy path on a calculator. This post is the field guide I wish I had when I started: schema design, constrained decoding, error recovery, MCP, and the evaluation discipline that keeps tool-using models honest.

## What function calling actually is

A function call is a structured output with extra ceremony. The model is given tool definitions through a dedicated `tools` API parameter (names, descriptions, JSON Schema), which the provider renders into the model's context, and instead of prose it emits a structured object naming a tool and its arguments. The runtime parses, executes, feeds the result back. The model then decides whether to call another tool, ask a clarifying question, or produce a final answer.

This applies equally to OpenAI function calling, Anthropic tool use, Gemini's API, and the special-token chat templates of Llama, Mistral and the open ecosystem. What matters more is the distinction between a model _trained_ to emit tool calls (with tool-use tokens in pretraining or instruction tuning) and one prompted to imitate it. Frontier models in 2026 pick the right tool the vast majority of the time when descriptions are clear; smaller open models with prompted tool use miss noticeably more often, with failures clustered on argument formatting. That gap is why this is systems design, not prompt engineering.

Function calling is not the model "deciding to act." It is the model emitting a particular shape of token sequence, which your runtime interprets as an action. Everything that goes wrong goes wrong in one of two places: the schema, or the loop.

## Schema design that doesn't break in production

Tool descriptions are the highest-leverage piece of prompt engineering in any agentic system. The model uses the description, far more than the name, to decide whether to call your tool. When it picks the wrong one, nine times out of ten two descriptions sit too close together in semantic space.

Principles that hold across every system I have worked on:

- **Verb-noun names.** `read_file`, `query_orders`, `cancel_subscription`. Training data is full of this convention; deviate and selection accuracy drops.
- **Describe _when_ to use the tool, not just _what_ it does.** "Returns the user's order history" tells the model nothing. "Use when the user asks about a specific past purchase or order status" tells it everything.
- **Constrain enums ruthlessly.** Free-string parameters are where hallucinated arguments live.
- **Parameter descriptions earn their keep.** "ISO 8601 timestamp, UTC" is the difference between `2026-07-27T10:00:00Z` and `Monday morning`.

Context-window cost is the trap nobody warns you about. Fifty tools can be tens of thousands of tokens of system prompt before the user has said a word. In my experience the ceiling for reliable selection sits somewhere in the low tens of tools per context; beyond that the model calls near-misses. The fix is usually two-stage selection, where a router LLM picks a category and only those tools get materialised. The overlap with [LLM routing](/blog/2025/llm-routing-at-scale/) is not coincidental.

Avoid `oneOf`, `anyOf`, and discriminated unions. They are the part of JSON Schema that constrained decoders handle worst and that models reason about least reliably. Prefer two separate tools with disjoint names.

## Constrained decoding versus prompt-and-pray

There are two ways to make a model emit valid JSON. Ask politely and validate, or modify the decoder so invalid JSON is impossible. That is the difference between a system that mostly works and one you can put on a pager.

Constrained decoding compiles a grammar (JSON Schema, regex, or context-free grammar) into a finite-state machine over the token vocabulary. At each step, the FSM tells the sampler which tokens keep the partial output on a valid path; the rest have their logits masked. Formally, $P'(x_t \mid x_{<t}) = \text{normalise}(P(x_t \mid x_{<t}) \odot M_t)$. The output is valid by construction. No retry loop, no defensive parsing, no regex extraction.

OpenAI's structured outputs, Anthropic's tool use, and equivalent server-side modes all implement this. For local models, Outlines is the mature default; Guidance, LMQL, and llama.cpp's GBNF grammars cover adjacent niches. Per-token overhead is modest, on the order of a few percent to a fifth depending on the stack, and mostly recouped because the model never wastes tokens on formatting mistakes.

The objection you hear is quality degradation. On very restrictive grammars with small models, masking preferred tokens has visible cumulative effect. But for typical tool-call schemas the quality cost is below the noise of any reasonable evaluation, and the reliability gain is enormous. **If your stack supports constrained decoding for tool calls and you are not using it, you are paying for retry loops with money you could be paying for inference.**

One nuance: when a call interleaves structured fields with free-form ones (a `reasoning` field that should be prose and an `answer` that must be an integer), constrained decoders handle it fine if configured to switch modes inside the schema. The antipattern is forcing prose into a tight grammar and watching the model write worse English to satisfy your token-mask.

## Error recovery: the failure mode the docs don't show you

Every public function-calling tutorial ends after the first successful tool call. Production lives in what comes next. The model called your tool. The tool failed. Now what?

Treat tool errors as first-class API surface, not exceptions. Return them in the same envelope as success, for example `{"ok": false, "error": {"code": "INVALID_DATE_RANGE", "message": "end_date must be on or after start_date", "hint": "Did you swap the arguments?"}}`, and feed them back as the tool's result. Frontier models are remarkably good at self-correction when the error tells them _what_ went wrong and _how to fix it_, and remarkably bad at it when handed a stack trace or a generic "Error: validation failed."

A production-worthy error contract has three pieces: a machine-readable code so your runtime can retry, escalate, or refuse; a natural-language message in vocabulary the model has seen during training; and a hint (the most underrated field) that nudges the model toward the fix. "File `src/mian.py` not found. Closest match: `src/main.py`" recovers far more often than "FileNotFoundError."

Around the contract: a retry budget per turn, a maximum-tool-calls cap per request, and a fallback when the budget is exhausted. A graceful "I was not able to complete this; here is what I tried" beats an opaque timeout.

Tool errors are training signal. If 30% of your `query_database` errors are the same date-format mistake, your parameter description is wrong, not the model. The error log is the fastest way to find which tool definitions need rewriting.

One quotable claim, because it's true: **the gap between a demo agent and a production agent is almost entirely in the error path**.

## MCP and the protocol shift

Until 2024, every tool-using agent was a bespoke integration. The Model Context Protocol (Anthropic's open protocol from late 2024, now adopted across Claude, VS Code, Cursor and a growing list of agent frameworks) turned the N×M integration problem into N+M. An MCP server exposes tools, resources, and prompts over standard JSON-RPC; an MCP client discovers and invokes them. The value is standardisation.

Two things make MCP more than a packaging convention. Dynamic discovery, where the client connects and gets a structured tool catalogue at runtime, is a real shift away from hardcoded registries. And resources as first-class citizens alongside tools, collapsing retrieval and tool use into one protocol surface.

Not quite two years on from its late-2024 launch, MCP has won the protocol layer for the same reason TCP/IP did: it is the lowest-overhead standard everyone could agree on. OpenAI's function-call format is still the de facto schema convention and most stacks translate between formats internally, but the trajectory is clear. If you are designing tooling infrastructure today, expose it as MCP.

What MCP does not solve, and no protocol can, is description quality. A standardised wire format does not save you from a vague description; it just lets the vague description fail in more clients.

## Evaluation: how to actually test a tool-using model

Tool use evaluation is where most teams quietly cut corners. End-to-end task success is the right north-star, but it bundles together at least four things to measure separately:

- **Tool selection accuracy.** Did the model call the right tool?
- **Argument accuracy.** Were the arguments well-formed _and_ semantically correct? A query that runs without error against the wrong date range is an argument failure constrained decoding will not catch.
- **Task completion rate.** Did the sequence achieve the user's goal? The only metric users care about, and the noisiest.
- **Efficiency.** An agent that takes 12 calls to do a 3-call task is technically successful and operationally a disaster.

The Berkeley Function-Calling Leaderboard (BFCL) is the cleanest public comparison across providers, with splits for simple, parallel, multi-turn, and agentic settings. Gorilla and ToolBench cover breadth across thousands of real-world APIs, though absolute numbers are noisy at the top end. Treat them as smoke tests, not deployment evidence. The eval that actually predicts production behaviour is built against your own tool catalogue, query distribution, and error contracts.

The connection to my [LLM-as-judge](/blog/2025/llm-as-judge/) work is direct. For task completion on open-ended queries you need a calibrated judge comparing the agent's final answer to a reference or rubric. The same biases (position, verbosity, self-enhancement) apply, and the same calibration discipline is required. Skip it and your tool-use leaderboard is measuring the judge's preferences, not the model.

The eval that matters most for high-stakes deployment is adversarial: queries designed to lure the model into the wrong tool, malformed inputs the schema should catch, sequences that probe whether the agent will retry past a sensible budget. These look fine on aggregate metrics and explode in production.

## For technical leaders

Tool use is an interface design problem dressed up as a model capability. The model is the cheapest part of the system to swap; the schemas, error contracts, evaluation harness, protocol surface, and routing tier are long-lived assets that compound value. Teams that treat function calling as "we'll just turn it on in the SDK" end up with brittle agents and an inference bill they cannot explain. Teams that treat it as a designed surface end up with platforms that survive multiple model upgrades without behaviour silently changing.

Two implications. Your tool catalogue is a product: owner, versioning policy, deprecation process, and a place where people argue about descriptions before they ship. Without that, schemas drift and behaviour drifts with them. And your evaluation infrastructure should outlive any specific model: same query set, same error-path tests, same adversarial probes against every candidate. That is what makes "we upgraded the model and behaviour got worse" debuggable rather than a mystery.

Tool-using agents have different cost profiles from pure-text LLMs: multiple round trips per request, larger system prompts, longer context. A latency regression in the tool layer multiplies across every interaction. Plan against tool-call budgets, not just token budgets.

Function calling is the capability holding up almost every LLM application that does more than autocomplete. Without it, [agentic RL](/blog/2026/agentic-rl/) has nothing to give a signal to, multi-agent systems become a game of telephone, and agent evaluation collapses into a vibes check. Pull on any modern agent thread and you find a tool-call schema at the other end.

Future posts will go deeper into agentic RL with verifiable tool feedback, multi-agent coordination, and the evaluation harnesses that hold this together. Until then, the work is unglamorous, mostly description-writing and reading error logs, and the part of it that repays attention most is the part the demos never show: what your agent does when a tool call fails.

_This post reflects my personal views and experience. It does not represent official Amazon positions._
