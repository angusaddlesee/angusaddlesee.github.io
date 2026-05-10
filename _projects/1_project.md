---
layout: page
title: LLM Routing & Optimisation at Amazon Alexa+
description: Intelligent model selection and latency optimisation for Alexa's large-scale conversational systems serving millions of users.
img: assets/img/12.jpg
importance: 1
category: work
related_publications: true
---

**Problem:** Alexa needs to answer millions of diverse questions daily with the right balance of accuracy, latency, and cost. Routing every request to the largest model is slow and expensive, while lighter models can miss nuance or accessibility needs. With Alexa+ reimagined from the ground up using LLMs, the challenge is to deliver smarter, more capable, and more personalised responses while maintaining the speed and reliability users expect.

**Approach:** Designed routing algorithms that assess intent, context, and risk to select the best-fit LLM for each interaction. Built evaluation frameworks that continuously benchmark accuracy versus latency to tune routing policies. Iterated quickly and continuously shipped models to production, balancing innovation with reliability.

**Impact:** Deployed systems serving **millions of Alexa users worldwide**, reducing response latency while maintaining conversation quality. Improved accessibility for users with varying needs and enabled more efficient resource utilisation across Amazon's infrastructure.

## Why Amazon Alexa+

I joined Amazon Alexa at a perfect time, getting the opportunity to make a real impact on Alexa+. **I switched from academia to industry for this exact reason — contributing to a product that helps millions of people!**

Alexa has been reimagined from the ground up. **Alexa+ is smarter, more capable, more personalised, and unlike chatbots, also takes action to help you get things done.**

This latter point is the most critical in my opinion, as Alexa+ makes everyone's lives easier, but **carrying out actions via voice is accessible and can improve many people's independence in their own home** — a natural extension of my PhD work on accessibility.

## Technical Details

**Intelligent Model Selection**: Routing algorithms that balance accuracy, latency, and computational cost to select optimal models for different types of user queries and contexts. This involves intent classification, risk assessment, context-aware routing, and continuous model evaluation.

**Performance Optimisation**: Systems that reduce response times while maintaining high-quality conversational experiences. This includes real-time performance monitoring and accessibility-aware routing for users with cognitive or sensory differences.

**Scalable Architecture**: Infrastructure handling millions of routing decisions daily with robust monitoring, rapid iteration cycles, and support for model updates without downtime.

**Accessibility Focus**: Drawing on PhD research on voice assistant accessibility, ensuring routing decisions consider users with different abilities and communication patterns.

## Related Work

This work builds on and extends my research background:

- **[Voice Assistants for Dementia](/projects/2_project/)** - PhD research on accessibility
- **[SPRING Hospital Robot](/projects/3_project/)** - Multi-party conversational AI in healthcare
- **[NHS ML Projects](/projects/5_project/)** - Healthcare information extraction and decision support

## Publications & Articles

- 📰 **[Amazon Science: Repairing Interrupted Questions](https://www.amazon.science/blog/repairing-interrupted-questions-makes-voice-agents-more-accessible)** - Making voice assistants more accessible
- 📄 **[Related Publications](/publications/)** - Research on LLMs, dialogue systems, and accessibility
