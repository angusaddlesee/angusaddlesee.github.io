---
layout: page
title: Voice Assistants for Visually Impaired People in the Kitchen
description: Accessible kitchen assistance systems addressing malnutrition challenges for visually impaired users.
img: assets/img/visual.png
importance: 3
category: research
related_publications: true
---

## Overview

I **founded the Aye-Saac project** and led its development across multiple cohorts of MSc students at Heriot-Watt. In total I supervised **30 MSc students** through this work, with two academic papers published as outcomes. My role was to propose the project, teach the students about conversational AI, and guide the technical direction across years; the students did the heavy lifting and built the system.

Aye-Saac is a voice assistant designed to help blind and partially sighted people in the kitchen. Malnutrition and visual impairment are well-known comorbidities, because shopping, preparing food, and eating safely all become harder without sight. Aye-Saac addresses this directly by reading food labels, locating kitchen items, and answering follow-up questions with transparent, explainable AI.

## Why "Aye-Saac"? A Lesson in Human-Centred Design

When we first started, we considered answering questions like _"where is my sofa?"_ But once we asked actual people with visual impairments, they explained: **"I never lose my sofa, it doesn't move."** What they did struggle with was the kitchen, where utensils and ingredients move constantly. They also explained the food label problem in detail.

This conversation reshaped the project entirely. The "**anchor points**" feature (using stationary objects like the fridge, oven, and microwave as reference points to locate movable items) came directly out of that user feedback. **It is yet another reminder that working with the target user group from day one is critical**, a theme that runs through all my accessibility research.

## Problem

Textual information is found all over food labels, making it impossible for blind or partially sighted people to know whether their food has expired, follow cooking instructions, find nutritional information, or check ingredients for allergies. Additionally, unlike stationary objects like the fridge or oven, utensils and ingredients move around the kitchen and can be lost, making meal preparation challenging and sometimes dangerous.

It is worth noting that this work pre-dates today's strong vision-language models (VLMs). At the time, asking _"where is the strawberry?"_ would, at best, yield _"in the kitchen"_, and when shown a picture of a STOP sign and asked _"what does this sign say?"_, VLMs could not answer. Modern VLMs have since solved some of these problems, which is genuinely brilliant for visually impaired people. Aye-Saac was an attempt to bridge that gap purposefully, with carefully designed components, well before general-purpose VLMs could.

## Approach

**Food Label Reading**: We used **OCR** to extract text from food packaging and then answered users' questions based on that text. The system can answer questions like _"Is this safe to eat?"_, _"Is the soup vegetarian?"_, and _"How do I cook this?"_

**Spatial Reasoning with Anchor Points**: Using stationary kitchen objects as anchor points (fridge, sink, oven, microwave), the system gives more specific location information like _"just to the left of the microwave"_ than traditional VQA systems. This was novel at the time, and is one of the main contributions of _The Spoon Is in the Sink_.

**Trust & Explainability**: The system reports confidence ("I'm 95% confident this expires tomorrow"), handles uncertainty gracefully ("I can't read the expiration date clearly, would you like me to try again?"), and answers follow-up questions like _"how sure are you about that?"_ Trust matters in this domain, where incorrect information could lead to food poisoning or allergic reactions.

## Key Features

### Food Label Information Extraction

- **Expiration dates**: "Is this safe to eat?"
- **Ingredients**: "Is this vegetarian?" or "Does this contain nuts?"
- **Nutritional information**: "How many calories are in this?"
- **Cooking instructions**: "How do I prepare this?"

### Spatial Location Assistance

- **Relative positioning**: "The salt is just to the left of the microwave"
- **Anchor-based navigation**: More precise than generic "on the counter" descriptions
- **Dynamic object tracking**: Helps locate items that move around the kitchen

### Explainable AI & Trust

- **Confidence reporting**: "I'm 95% confident this expires tomorrow"
- **Uncertainty handling**: "I can't read the expiration date clearly, would you like me to try again?"
- **Transparent reasoning**: Explains how conclusions were reached
- **Follow-up questions**: Users can probe the system's reasoning

## Impact & Outcomes

✓ **Two published papers** on accessible kitchen assistance
✓ **30 MSc students supervised** to completion across multiple cohorts
✓ **Novel anchor-point spatial reasoning** approach (a main contribution of _The Spoon Is in the Sink_)
✓ **Trust-focused design** with confidence reporting and follow-up questions
✓ **Real-world applicability**: addressing malnutrition risk, a known comorbidity of visual impairment

## Links & Resources

### Papers

- 📄 **[Am I allergic to this? Assisting sight impaired people in the kitchen](https://dl.acm.org/doi/10.1145/3462244.3481000)** (ICMI, 2021)
- 📄 **[The spoon is in the sink: Assisting visually impaired people in the kitchen](https://aclanthology.org/2021.reinact-1.5.pdf)** (ReInAct, 2021)

### Articles for a Wider Audience

- 📝 **[Am I Allergic to This? Developing a Voice Assistant for Sight Impaired People](https://heartbeat.comet.ml/am-i-allergic-to-this-developing-a-voice-assistant-for-sight-impaired-people-3f036fe7792b)** (Heartbeat)
- 📝 **[The Spoon is in the Sink: Assisting Visually Impaired People in the Kitchen](https://heartbeat.comet.ml/the-spoon-is-in-the-sink-assisting-visually-impaired-people-in-the-kitchen-ccea20b098cd)** (Heartbeat)
