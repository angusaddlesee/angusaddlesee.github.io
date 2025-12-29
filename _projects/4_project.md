---
layout: page
title: Repairing Interrupted Questions in Voice Assistants
description: Making assistants resilient to mid-utterance corrections and incomplete questions.
img: assets/img/4.jpg
importance: 4
category: work
---

## Problem
Voice assistants often mis-handle users who pause, restart, or change their mind mid-question, leading to frustrating failures for people with memory or speech differences.

## Approach
- Analysed real interaction logs to model common interruption patterns and failure modes.
- Built incremental language understanding that could gracefully repair or clarify incomplete questions instead of restarting the dialogue.
- Evaluated with user studies and offline metrics to balance speed with comprehension.

## Impact
- Reduced abandonment for users who frequently reformulate their requests.
- Shared findings as an Amazon Science article to guide industry best practices for inclusive voice design.
- Provided design patterns later reused in hospital and consumer assistant deployments.
