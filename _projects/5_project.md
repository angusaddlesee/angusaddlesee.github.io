---
layout: page
title: Grounding LLMs to In-Prompt Instructions
description: Techniques to reduce hallucinations by reinforcing user constraints inside prompts.
img: assets/img/5.jpg
importance: 5
category: research
---

## Problem
LLMs can override user instructions with pre-training bias, producing hallucinated or unsafe answers. High-stakes domains need controllable behaviour without retraining every model.

## Approach
- Experimented with prompt-level grounding strategies to align model outputs with explicit constraints.
- Benchmarked how different instruction patterns affected hallucination rates across tasks.
- Documented failure cases and mitigation tactics for teams adopting LLMs in sensitive workflows.

## Impact
- Delivered actionable prompting patterns that reduce hallucinations without costly fine-tuning.
- Supported safer experimentation with LLM routing systems by clarifying when to escalate to trusted models.
- Published results to share repeatable evaluation setups for the community.
