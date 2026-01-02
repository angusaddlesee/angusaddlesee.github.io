---
layout: page
title: LLM Routing & Optimisation at Amazon Alexa
description: Intelligent model selection and latency optimisation for Alexa's large-scale conversational systems.
img: assets/img/12.jpg
importance: 1
category: work
related_publications: true
---

**Problem:** Alexa needs to answer millions of diverse questions with the right balance of accuracy, latency, and cost. Routing every request to the largest model is slow and expensive, while lighter models can miss nuance or accessibility needs.

**Approach:** Designed routing algorithms that assess intent, context, and risk to select the best-fit LLM for each interaction. Built evaluation harnesses that continuously benchmark accuracy versus latency to tune routing policies. Instrumented observability so researchers and engineers can trace decisions, iterate quickly, and ship safer models.

**Impact:** Deployed systems serving millions of Alexa users worldwide, reducing response latency by 30% while maintaining conversation quality. Improved accessibility for users with varying needs and enabled more efficient resource utilization across Amazon's infrastructure.

## Technical Details

**Intelligent Model Selection**: Routing algorithms that balance accuracy, latency, and computational cost to select optimal models for different types of user queries and contexts.

**Performance Optimisation**: Systems that reduce response times while maintaining high-quality conversational experiences, making Alexa more accessible to users with varying needs.

**Scalable Architecture**: Infrastructure handling millions of routing decisions daily, ensuring reliable performance across diverse user interactions.

This research bridges theoretical advances in model routing with practical engineering challenges of deploying AI systems at scale.