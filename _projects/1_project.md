---
layout: page
title: LLM Routing & Optimisation at Amazon Alexa
description: Intelligent model selection and latency optimisation for Alexa’s large-scale conversational systems.
img: assets/img/12.jpg
importance: 1
category: work
related_publications: true
---

## Problem

Alexa needs to answer millions of diverse questions with the right balance of accuracy, latency, and cost. Routing every request to the largest model is slow and expensive, while lighter models can miss nuance or accessibility needs.

## Approach

- Designed routing algorithms that assess intent, context, and risk to select the best-fit LLM for each interaction.
- Built evaluation harnesses that continuously benchmark accuracy versus latency to tune routing policies.
- Instrumented observability so researchers and engineers can trace decisions, iterate quickly, and ship safer models.

## Impact

- Reduced response times while preserving answer quality for high-traffic domains.
- Lowered compute costs and enabled rapid experimentation with new models without regressing user experience.
- Shipped routing improvements that make Alexa more reliable and inclusive for millions of daily users.
