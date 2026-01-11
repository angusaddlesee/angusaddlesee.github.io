---
layout: page
title: Voice Assistants for Visually Impaired People in the Kitchen
description: Accessible kitchen assistance systems addressing malnutrition challenges for visually impaired users.
img: assets/img/5.jpg
importance: 3
category: research
related_publications: true
---

## Overview

I supervised **30 MSc students** developing voice assistants to address malnutrition challenges for visually impaired users. Malnutrition is commonly associated with sight impairment because it is very difficult to shop, prepare food, and eat a meal. We published **two papers** and created practical tools for independent living focused on reading food labels, locating kitchen items, and making informed decisions with transparent, explainable AI.

## Problem

Textual information is found all over food labels, making it impossible for blind or partially sighted people to know whether their food has expired, follow cooking instructions, find nutritional information, or check ingredients for allergies. Additionally, unlike stationary objects like the fridge or oven, utensils and ingredients move around the kitchen and can be lost, making meal preparation challenging and sometimes dangerous.

## Approach

**Food Label Reading**: Developed systems to answer questions like "Is this safe to eat?", "Is the soup vegetarian?", and "How do I cook this?" by extracting and interpreting information from food packaging using computer vision and natural language processing.

**Spatial Reasoning with Anchor Points**: Using stationary kitchen objects as "anchor points" (fridge, sink, oven, microwave), we provided more specific location information like "just to the left of the microwave" than traditional visual question answering (VQA) systems. This novel approach helps users locate movable items more effectively.

**Trust & Explainability**: Designed the system to be transparent and answer follow-up questions like "how sure are you about that?" Trust and explainability are critical in this domain where incorrect information could lead to food poisoning or allergic reactions.

## Technologies

- Computer Vision
- Visual Question Answering (VQA)
- Optical Character Recognition (OCR)
- Explainable AI
- Natural Language Processing
- Accessibility-focused Design
- Spatial Reasoning

## Impact & Outcomes

✓ **Two published papers** on accessible kitchen assistance  
✓ **30 MSc students supervised** to completion with research outputs  
✓ **Practical tools** for independent living and nutrition management  
✓ **Novel spatial reasoning approach** using kitchen anchor points  
✓ **Trust-focused design** with explainability features  
✓ **Real-world applicability** addressing malnutrition challenges

## Links & Resources

- 📄 **[Related Publications](/publications/)** - Research papers on kitchen assistance systems
- 🎓 **MSc Supervision** - Led 30 students to develop and publish research
- 🔬 **Research Focus** - Accessibility, explainable AI, and independent living

## Key Features

### 1. Food Label Information Extraction

The system can read and interpret various types of information from food packaging:

- **Expiration dates**: "Is this safe to eat?"
- **Ingredients**: "Is this vegetarian?" or "Does this contain nuts?"
- **Nutritional information**: "How many calories are in this?"
- **Cooking instructions**: "How do I prepare this?"

### 2. Spatial Location Assistance

Using stationary kitchen objects as reference points:

- **Relative positioning**: "The salt is just to the left of the microwave"
- **Anchor-based navigation**: More precise than generic "on the counter" descriptions
- **Dynamic object tracking**: Helps locate items that move around the kitchen

### 3. Explainable AI & Trust

Critical for safety in food preparation:

- **Confidence reporting**: "I'm 95% confident this expires tomorrow"
- **Uncertainty handling**: "I can't read the expiration date clearly, would you like me to try again?"
- **Transparent reasoning**: Explains how conclusions were reached
- **Follow-up questions**: Users can probe the system's reasoning

## Research Contributions

This work demonstrated that voice assistants can be powerful tools for independent living when designed with specific accessibility needs in mind. The combination of computer vision, natural language understanding, and explainable AI creates systems that are not only functional but also trustworthy — essential for applications where mistakes could have serious consequences.

### Novel Approaches

**Anchor Point Spatial Reasoning**: Unlike generic VQA systems that might say "on the counter," our approach uses stationary kitchen objects as reference points to provide more actionable location information.

**Trust-Centered Design**: Recognizing that users need to trust the system's answers about food safety and allergens, we built explainability and confidence reporting into the core design.

**Accessibility-First Development**: Rather than adapting existing systems, we designed from the ground up for visually impaired users, ensuring the interaction patterns and information architecture matched their needs.

## Future Directions

This research opens pathways for broader applications of accessible AI in daily living:

- Integration with smart kitchen appliances
- Expanded coverage of household tasks beyond food preparation
- Multi-modal interaction combining voice, touch, and haptic feedback
- Personalized learning of individual users' kitchen layouts and preferences
