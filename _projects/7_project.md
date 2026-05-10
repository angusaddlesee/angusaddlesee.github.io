---
layout: page
title: Conversational AI Safety and Question Understanding
description: Detecting inappropriate content and analyzing conversational question patterns in voice assistants.
img: assets/img/8.jpg
importance: 7
category: research
related_publications: true
---

## Overview

Developed machine learning systems to improve voice assistant safety and question understanding. This work addressed two critical challenges: detecting inappropriate content in conversational contexts, and understanding how people ask questions differently when speaking versus typing.

## Problem 1: Detecting Inappropriate Content

Voice assistants need to detect when users are saying inappropriate things, but this is more nuanced than simple keyword filtering. **Swearing does not always indicate offence (especially in Scotland!)**, and seemingly innocuous terms like "sleep with" can be used in inappropriate sentences. Traditional profanity filters fail to capture context and intent.

## Problem 2: Understanding Conversational Questions

People ask questions more conversationally when speaking with a voice assistant compared to typing into a search engine. These differences can cause problems for systems trained primarily on written text. Understanding which differences matter and which cause failures is critical for improving voice assistant performance.

## Approach

### Inappropriate Content Detection

**Context-Aware Classification**: Trained models to detect inappropriate content based on context and intent, not just keyword matching. The system considers:

- Surrounding context and conversation history
- Intent behind the language use
- Cultural and regional variations in language
- Difference between casual swearing and offensive content

**Nuanced Understanding**: Recognized that the same words can be appropriate or inappropriate depending on context. For example, discussing medical topics or quoting literature requires different handling than offensive language directed at the assistant or other users.

### Conversational Question Analysis

**Comparative Analysis**: Analyzed how questions differ between voice and text interfaces:

- Longer, more natural phrasing in voice
- More incomplete or interrupted questions
- Different word choice and formality
- Contextual references to previous interactions

**Failure Mode Identification**: Identified which differences cause problems for current systems:

- Incomplete questions interpreted as complete
- Conversational phrasing not matching training data
- Implicit context not being captured
- Disfluencies and self-corrections causing confusion

## Technologies

- Natural Language Processing
- Text Classification
- Machine Learning
- Contextual Understanding
- Voice Assistant Systems
- Conversational Analysis
- Safety AI

## Impact & Outcomes

✓ **Improved safety** - More nuanced detection of inappropriate content  
✓ **Reduced false positives** - Better handling of casual language and regional variations  
✓ **Question understanding** - Identified key differences in conversational vs. written questions  
✓ **System improvements** - Informed design of more robust voice assistant question handling  
✓ **Published research** - Contributed to understanding of conversational question patterns

## Key Contributions

### Context-Aware Safety

Moved beyond simple keyword filtering to understand intent and context:

- **Cultural sensitivity**: Recognized regional variations in language use
- **Intent detection**: Distinguished between casual language and offensive content
- **Conversation history**: Used context from previous turns to inform decisions
- **Nuanced responses**: Enabled appropriate handling of edge cases

### Conversational Question Patterns

Identified specific patterns that distinguish voice from text questions:

- **Length and structure**: Voice questions tend to be longer and more naturally phrased
- **Disfluencies**: Pauses, self-corrections, and incomplete thoughts are common in speech
- **Contextual references**: Voice users more often refer to previous interactions
- **Formality**: Voice questions are typically less formal than typed queries

### Practical Recommendations

Provided actionable guidance for improving voice assistants:

- Better handling of incomplete and interrupted questions
- Training data that includes conversational speech patterns
- Context-aware interpretation of user intent
- More flexible question understanding that accommodates natural speech

## Related Work

This research connects to broader themes in my work:

- **[Voice Assistants for Dementia](/projects/2_project/)** - Understanding disrupted and incomplete questions
- **[Amazon Alexa+](/projects/1_project/)** - Applying safety and question understanding at scale
- **[SPRING Hospital Robot](/projects/3_project/)** - Handling conversational questions in clinical settings

## Publications

- 📄 **"Understanding and Answering Incomplete Questions"** (CUI, 2023)
- 📄 **"Understanding Partial Questions"** (Amazon ML Conference, 2022)
- 📄 **Related work on conversational question analysis**

## Skills & Technologies

- Natural Language Processing
- Text Classification
- Machine Learning
- Safety AI
- Conversational Analysis
- Voice Assistant Systems
- Python, scikit-learn, PyTorch

## Key Learnings

**Context is critical**: Simple keyword-based approaches fail to capture the nuance of human communication. Understanding context and intent is essential for both safety and functionality.

**Regional variation matters**: Language use varies significantly across regions and cultures. Systems must be flexible enough to handle these variations without over-filtering.

**Voice is different from text**: People communicate differently when speaking versus typing. Voice assistants need to be designed specifically for conversational interaction, not just adapted from text-based systems.

**Safety and usability must balance**: Overly aggressive safety filtering can make systems frustrating to use, while insufficient filtering creates risks. Finding the right balance requires nuanced understanding of context and intent.
