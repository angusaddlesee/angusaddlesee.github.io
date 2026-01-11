---
layout: page
title: Multi-party Dialogue Datasets and Evaluation
description: Hospital conversation datasets and evaluation frameworks for multi-speaker dialogue systems.
img: assets/img/6.jpg
importance: 6
category: research
related_publications: true
---

## Overview

Developed comprehensive datasets and evaluation methodologies for multi-party dialogue systems in clinical settings. This work provides benchmarks for training and evaluating conversational AI that must handle real-world hospital conversations with multiple speakers, overlapping speech, and complex goal tracking.

## Problem

Most dialogue datasets ignore overlapping speech and shifting goals, making it hard to train assistants that must handle real-world clinical conversations. Traditional dialogue systems expect one-on-one interactions, but clinical settings involve:

- Multiple speakers (patients, companions, clinicians)
- Overlapping and interrupted speech
- Complex goal tracking across participants
- Accessibility considerations for vulnerable populations
- Safety-critical requirements for healthcare applications

## Approach

**Data Collection**: Collected and annotated multi-party hospital dialogues with comprehensive labeling including:

- Speaker diarisation (who is speaking when)
- Conversational goals and goal progress
- Accessibility cues and speech variations
- Turn-taking patterns and interruptions
- Clinical appropriateness markers

**Evaluation Frameworks**: Developed holistic evaluation protocols that assess:

- Technical performance (diarisation accuracy, goal tracking)
- Human factors (user experience, clinical appropriateness)
- Safety and accessibility considerations
- Real-world deployment readiness

**Comparative Analysis**: Compared pre-training, fine-tuning, and prompt engineering strategies for multi-party goal tracking using LLMs, providing guidance for practitioners on which approaches work best for different scenarios.

## Technologies

- Multi-party Dialogue Systems
- Speaker Diarisation
- Goal Tracking
- Dataset Annotation
- Evaluation Methodologies
- Large Language Models
- Clinical AI Systems

## Impact & Outcomes

✓ **Public dataset release** - Hospital dialogue corpus for research community  
✓ **Evaluation framework** - Holistic methodology for multi-party conversational agents  
✓ **LLM benchmarking** - Comparative analysis of different training strategies  
✓ **SPRING project foundation** - Datasets and methods used in hospital robot deployment  
✓ **Published research** - Multiple papers on data collection and evaluation  
✓ **Community impact** - Enabling future research in multi-party dialogue

## Links & Resources

- 📄 **Key Publications**:
  - "A Multi-party Dialogue Dataset for Dialogue Goal Tracking in a Hospital Setting" (SemDial, 2024)
  - "Multi-party Goal Tracking with LLMs: Comparing Pre-training, Fine-tuning, and Prompt Engineering" (SIGdial, 2023)
  - "A Holistic Evaluation Methodology for Multi-Party Spoken Conversational Agents" (IVA, 2024)
  - "Data Collection for Multi-party Task-based Dialogue in Social Robotics" (IWSDS, 2023)
  - "Detecting Agreement in Multi-party Dialogue" (GROUND Workshop, 2023)
- 🏥 **[SPRING Project](/projects/3_project/)** - Applied this research in real hospital deployment
- 📊 **Dataset** - Available for research use

## Key Contributions

### Hospital Dialogue Corpus

Created a unique dataset capturing real multi-party interactions in clinical settings:

- **Naturalistic conversations**: Real patient-companion-clinician interactions
- **Rich annotations**: Speaker labels, goals, accessibility markers
- **Ethical collection**: Privacy-preserving methods with informed consent
- **Research enablement**: Public release for community use

### Evaluation Framework

Developed comprehensive evaluation methodology covering:

- **Technical metrics**: Diarisation accuracy, goal tracking performance
- **Human factors**: User experience, clinical appropriateness
- **Safety considerations**: Error analysis, failure modes
- **Deployment readiness**: Real-world applicability assessment

### LLM Strategy Comparison

Systematically compared approaches for multi-party goal tracking:

- **Pre-training**: Using large pre-trained models directly
- **Fine-tuning**: Adapting models to hospital dialogue domain
- **Prompt engineering**: Optimizing prompts for multi-party understanding

Results showed that prompt engineering with large models often outperformed fine-tuning smaller models, providing practical guidance for practitioners.

## Research Highlights

**Ethical Data Collection**: Developed privacy-preserving methods for collecting conversations with vulnerable populations, ensuring informed consent and data protection while enabling valuable research.

**Multi-party Complexity**: Demonstrated the unique challenges of multi-speaker dialogue compared to traditional one-on-one conversations, highlighting the need for specialized datasets and evaluation methods.

**LLM Capabilities**: Showed that large language models can effectively handle multi-party goal tracking when properly prompted, but also identified failure modes and limitations.

**Clinical Validation**: Worked with healthcare professionals to ensure datasets and evaluation criteria reflected real clinical needs and constraints.

## Publications

This work resulted in multiple publications advancing multi-party dialogue research:

- **A Multi-party Dialogue Dataset for Dialogue Goal Tracking** (SemDial, 2024)
- **Multi-party Goal Tracking with LLMs** (SIGdial, 2023)
- **A Holistic Evaluation Methodology for Multi-Party Spoken Conversational Agents** (IVA, 2024)
- **Data Collection for Multi-party Task-based Dialogue** (IWSDS, 2023)
- **Detecting Agreement in Multi-party Dialogue** (GROUND Workshop, 2023)

## Impact on SPRING Project

This dataset and evaluation work directly enabled the SPRING hospital robot deployment:

- Provided training data for multi-party dialogue models
- Established evaluation criteria for clinical appropriateness
- Identified key challenges and solutions for real-world deployment
- Validated the feasibility of multi-party conversational robots in healthcare

## Future Directions

This research opens pathways for broader applications:

- Expanding to other clinical settings and specialties
- Multi-lingual multi-party dialogue datasets
- Real-time evaluation during live interactions
- Integration with other modalities (vision, gesture)
- Longitudinal studies tracking conversation patterns over time
