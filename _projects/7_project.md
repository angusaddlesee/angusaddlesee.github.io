---
layout: page
title: Abuse Detection & Question Analysis on the Alexa Prize Corpus
description: Two MSc projects analysing roughly 1.7 million real Alexa Prize utterances; one for abuse detection, one for conversational question analysis.
img: assets/img/8.jpg
importance: 7
category: research
related_publications: true
---

## Overview

During my MSc at Heriot-Watt I worked on two distinct projects that shared one thing: a corpus of **roughly 1.7 million real utterances** from my lab's **Alexa Prize Chatbot**. With that data in hand, I led two different lines of work, one with **Professor Verena Rieser** on detecting abuse directed at conversational agents, and one with **Professor Arash Eshghi** analysing how people ask questions via voice.

## Project 1: Abuse Detection (with Verena Rieser)

Voice assistants need to detect when users say inappropriate things, but this is more nuanced than simple keyword filtering. **Swearing does not always indicate offence (especially in Scotland!)**, and seemingly innocuous terms like *"sleep with"* can be used in inappropriate sentences. Traditional profanity filters fail to capture this.

**Approach:**

1. We **filtered the Alexa Prize corpus** for certain words and phrases to surface a candidate set of potentially abusive utterances.
2. We **annotated** this candidate set.
3. We then **bootstrapped further candidates** by exploiting the observation that a user who has said something offensive once is more likely to have said other offensive things. Following users into their other utterances surfaced abuse that simple keyword filters could not catch (the *"sleep with"* type cases).
4. With the resulting corpus, we **trained abuse detector models**.

**Outcome:** The trained abuse detector was **deployed in the Alexa Prize Challenge system**, going beyond keyword filtering to use context and a wider vocabulary of harmful patterns.

## Project 2: How People Ask Questions via Voice (with Arash Eshghi)

People ask questions very differently when speaking to a voice assistant compared with typing into a search engine. Understanding those differences matters for designing voice-first QA systems that don't fail on natural speech.

**Approach:**

1. **Filtered the same Alexa Prize corpus** for question utterances.
2. **Analysed how voice questions differed** from typed-question QA datasets: voice questions were far more colloquial and frequently contained anaphora to previous turns, both of which standard QA systems struggle with.
3. **Classified the questions into types**, including:
    - **Sluices** (incomplete clarification-style questions like *"the one with the dragons?"*)
    - **Explanation questions** (*"why does X happen?"*)
    - **Personal questions to the bot** (*"what is your favourite colour?"*)
    - And several other categories

**Outcome:** A characterisation of the question landscape that voice assistants face in the wild, very different from the clean question forms in benchmark QA datasets.

**A fun connection:** I then trained question classifiers on the annotated question corpus and built a **QA system in which the question type informed which underlying QA system was called**. This was back during my MSc, but with the benefit of hindsight, it is a clear early hint of the **LLM routing** work I now do on Alexa+, picking the right downstream system for each user request based on what the request actually looks like.

## Why This Matters

Both projects shared the same insight: **real spoken interactions are messier and more contextual than the data most systems are trained on.** Whether you're building a safety classifier or a QA model, you need data that reflects how people actually speak. The Alexa Prize corpus made that possible at scale, and these two projects laid groundwork I'd return to throughout my PhD and beyond.

## Related Work

- **[Voice Assistants for Dementia](/projects/2_project/)**: PhD work on accessible dialogue, including incomplete and disrupted questions
- **[Amazon Alexa+](/projects/1_project/)**: Production conversational AI at scale
