---
layout: page
title: SPRING Hospital Memory Clinic Robot
description: Multi-party conversational social robot deployed in real hospital settings for patient interactions.
img: assets/img/spring.png
importance: 1
category: work
related_publications: false
---

## Overview

The **SPRING project** (EU H2020 funded) deployed a social robot in a Parisian hospital memory clinic to interact with patients and their companions. This work was **featured in TIME Magazine** and represents one of the first real-world deployments of multi-party conversational AI in clinical settings. **Eight research institutes** collaborated to tackle the challenges of robots operating in complex healthcare environments.

**My role:** I led the **Conversational AI and dialogue system** development; I built it. The wider SPRING consortium covered the robot platform, clinical partnership, navigation, emotion recognition, gestures, and more.

## Problem

Robots have been introduced to public spaces like museums, airports, shopping centres, and hospitals. These are complex environments for social robots to move, see, and converse in. Traditional voice assistants expect to chat with one person at a time (like Alexa), but patients in memory clinics typically bring a carer or family member along. The robot needed to:

- Manage conversations with multiple people simultaneously
- Adapt to the cognitive abilities of patients with dementia
- Coordinate with healthcare professionals during clinical assessments
- Navigate the social dynamics of patient-companion-clinician interactions
- Maintain appropriate clinical boundaries and supportive behaviour

## Approach

**Multi-party Dialogue Systems**: Developed conversational AI that could track multiple speakers, understand who is addressing the robot, and respond appropriately to different participants in the conversation. This required advances in speaker diarisation, turn-taking, and goal tracking.

**Accessibility-Focused Design**: Improved the naturalness and accessibility of conversations for people with dementia, incorporating lessons from PhD research on speech production changes and dialogue repair strategies.

**Clinical Integration**: Worked closely with healthcare professionals to ensure the robot's behaviour was clinically appropriate, supportive, and safe. The robot participated in actual patient assessments in the memory clinic.

**Real-world Deployment**: Tested the system in a functioning Parisian hospital with real patients, companions, and clinicians, not in a controlled lab environment. This provided invaluable insights into practical deployment challenges.

## From Rule-Based System to LLM-Based Dialogue

When I joined SPRING, the dialogue system was a classic intent/rule-based system, and the patients hated it. They were older adults who asked all sorts of unexpected things, and a rule-based system could only respond to a narrow set of intents. After I built and deployed the **LLM-based dialogue system**, patients could ask about their favourite plays, ask for jokes, and chat about Paris without an issue. **Making that impact was hugely rewarding**, and a strong demonstration of how LLMs can transform conversational AI in real clinical settings when designed carefully.

## Impact & Outcomes

- 🏆 **EACL 2024 Best Demo Award** for the demo paper on the system itself
- 📰 **[Featured in TIME Magazine](https://time.com/6590440/robots-hospital-patient-testing-phase-ai-assistance/)**, the only piece of work I've done that has reached that audience
- 🏥 **Real clinical deployment** with actual patient interactions in a Parisian hospital memory clinic
- 🌍 **International collaboration** across eight research institutes in Europe
- 📚 **Multiple peer-reviewed papers** on multi-party dialogue, clinical robotics, and accessibility

## Links & Resources

- 🎥 **[HRI 2024 Video](https://www.youtube.com/watch?v=xMCpcsLhN_I)**: "A Multi-party Conversational Social Robot Using LLMs"
- 🔬 **[SPRING Project Website](https://spring-h2020.eu/)**: EU H2020 funded research initiative
- 📄 **[Related Publications](/publications/)**: All papers from this project

## Key Contributions

### Multi-party Conversation Management

The robot successfully managed three-way conversations between patients, their companions, and healthcare professionals. This required:

- **Speaker tracking**: Identifying who is speaking and who they're addressing
- **Goal coordination**: Tracking multiple conversational goals across participants
- **Turn-taking**: Managing smooth transitions between speakers
- **Context maintenance**: Remembering information from different participants

### Clinical Appropriateness

Working in a healthcare setting demanded careful attention to:

- **Supportive behaviour**: Maintaining encouraging and patient interactions
- **Safety boundaries**: Avoiding medical advice or inappropriate responses
- **Professional coordination**: Working alongside clinicians without interfering
- **Privacy and consent**: Ethical data handling for vulnerable populations

## Key Publications

- **[Multi-party Multimodal Conversations Between Patients, Their Companions, and a Social Robot in a Hospital Memory Clinic](https://aclanthology.org/2024.eacl-demo.8.pdf)** (EACL 2024, **Best Demo Award**)
- **[Socially Pertinent Robots in Gerontological Healthcare](https://link.springer.com/article/10.1007/s12369-025-01330-6)** (International Journal of Social Robotics, 2025)

## Media Coverage

> "Robots Are Being Tested in Hospitals. Here's What Patients Think of Them", TIME Magazine

The article discusses how patients and healthcare professionals responded to the robot, the challenges of deployment, and the future of AI assistance in clinical settings.
