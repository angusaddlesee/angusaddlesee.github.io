---
layout: page
title: Production LLM Systems at Amazon Alexa+
permalink: /projects/alexa-llm-systems/
description: LLM routing, reward modelling, and evaluation infrastructure in Alexa's Frontier AI Modelling Lab.
img: assets/img/alexa.jpg
importance: 1
category: work
related_publications: false
---

I work in **Amazon Alexa's Frontier AI Modelling Lab** on **Alexa+**, contributing across several workstreams that span model training, evaluation, and production routing.

## Why Amazon Alexa+

I joined Amazon Alexa at a perfect time, getting the opportunity to make a real impact on Alexa+. **I switched from academia to industry for this exact reason: contributing to a product that helps millions of people.**

Alexa+ has been reimagined from the ground up. It is smarter, more capable, more personalised, and unlike chatbots, also takes action to help you get things done. **Carrying out actions via voice is accessible and can improve many people's independence in their own home**, a natural extension of my PhD work on accessibility.

## LLM Routing & Optimisation

Alexa+ needs to handle millions of diverse interactions daily with the right balance of accuracy, latency, and cost. I work on **routing algorithms** that assess context to select the best-fit LLM for each interaction, alongside evaluation frameworks for both the routers themselves and the downstream model tasks they trigger. The work involves continuous iteration and shipping to production, balancing innovation with the reliability users expect.

## Reward Modelling

Evaluating and training large LLMs at this scale requires reliable, automated reward signals. I contribute to the development of **reward models used in evaluation and training**, helping the team move beyond surface-level metrics towards signals that better capture nuanced, multi-step interactions (Alexa+ has to call tools to play music, set timers, control smart home devices, and much more).

## Evaluation Infrastructure

Working on a routing system whose decisions involve downstream tool use is fundamentally hard to evaluate offline. I build **internal evaluation infrastructure** that supports high-throughput experimentation, which can be used for both model training and assessing new model candidates against representative signals before any production rollout.

## Production Engineering & Team

Beyond research, this role demands deep production engineering and team contribution:

- **On-call rotas**: I'm on multiple on-call rotas. When Alexa+ has issues in production, I get paged and work to identify the root cause and resolve them quickly.
- **Active interviewing**: I have conducted **over 25 technical interviews** for the team.
- **Cross-functional collaboration**: across applied scientists, engineers, product, and operations.

## Accessibility

I'm passionate about accessibility, and I draw on my PhD research to advocate for users with different abilities and communication patterns wherever I can across our routing decisions, evaluation criteria, and reward signals.

## Related Work

This work builds on and extends my research background:

- **[Voice Assistants for Dementia](/projects/voice-assistants-dementia/)**: PhD research on accessibility
- **[SPRING Hospital Robot](/projects/spring-hospital-robot/)**: Multi-party conversational AI in healthcare
- **[NHS ML Projects](/projects/nhs-scotgov-ml/)**: Healthcare information extraction and decision support

## Publications & Articles

- 📰 **[Amazon Science: Repairing Interrupted Questions](https://www.amazon.science/blog/repairing-interrupted-questions-makes-voice-agents-more-accessible)**: Making voice assistants more accessible
- 📄 **[Related Publications](/publications/)**: Research on LLMs, dialogue systems, and accessibility
