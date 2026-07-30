---
layout: page
title: NHS & Scottish Government ML Projects
permalink: /projects/nhs-scotgov-ml/
description: Machine learning systems for healthcare information extraction and patient care management.
img: assets/img/nhs.png
importance: 4
category: work
---

## Overview

Before specialising in conversational AI, I worked as a **Machine Learning Engineer** focused on information extraction from unstructured data into knowledge graphs. These projects with the **NHS in Scotland** and the **Scottish Government** applied NLP and machine learning to improve patient care and healthcare operations.

## NHS Scotland: Patient Management Platform

The primary NHS project parsed **hospital discharge letters in real time** using ML models I trained. The system did three things at once:

1. **Information extraction**: Pulled structured patient information (identifiers, conditions, medications, etc.) directly out of unstructured discharge letters.
2. **Knowledge graph construction**: Inserted the extracted information into a live structured knowledge graph, with terminology grounded in **SNOMED**.
3. **Risk identification**: Identified high-risk patients (e.g. somebody whose discharge letter looks routine in isolation, but whose graph shows recurring heart problems across multiple visits, raising the risk profile).

A **live user interface for GP practices** sat on top of this graph, surfacing high-risk patients to their GPs in real time. Risk scoring itself was developed in close collaboration with GPs and SNOMED, so the model surfaced clinically meaningful signals rather than statistical noise.

## Scottish Government: Child Protection

The Scottish Government project was in the **child protection** domain (so I'll keep details deliberately vague). The shape of the work was similar to the NHS project: I trained ML models that analysed patterns, joined unstructured data into knowledge graphs, and surfaced findings to Scottish Government staff to inform decision making.

## Why This Mattered to Me

I really enjoyed getting up every day to work on projects with **direct, positive real-world impact**. That feeling of tangible, human-relevant outcomes is what motivated my move into PhD research on conversational AI for healthcare, and is the same reason I switched to Amazon: to keep building things that affect real people, at scale.

## Knowledge Graphs Beyond the Day Job

Around this work I became a **leading user and communicator of knowledge graph technology**. I wrote a series of articles on linked data (some with well over **100,000 views**), spoke at events like the **DBpedia Conference** at Leipzig University, and helped organise **SLiDInG 7** with the Scottish Government as a community gathering for Scotland's linked data practitioners.

### Selected articles

- 📝 **[The Olympics: How to Build a Linked Data Application](https://medium.com/wallscope/the-olympics-how-to-build-a-linked-data-application-f6f844b3a19c)**
- 📝 **[Comparison of Linked Data Triplestores: A New Contender](https://medium.com/wallscope/comparison-of-linked-data-triplestores-a-new-contender-c62ae04901d3)**
- 📝 **[Constructing More Advanced SPARQL Queries](https://medium.com/wallscope/constructing-more-advanced-sparql-queries-72d5ade1eedc)**
- 📝 **[Linked Data Reconciliation in GraphDB](https://medium.com/wallscope/linked-data-reconciliation-in-graphdb-cd2796d2870b)**

The full set of linked data articles, plus tutorials and conference write-ups, is on my [blog](/blog/).

## Related Work

- **[Voice Assistants for Dementia](/projects/voice-assistants-dementia/)**: PhD work on accessibility-focused dialogue
- **[SPRING Hospital Robot](/projects/spring-hospital-robot/)**: Conversational AI in clinical settings
- **[Amazon Alexa+](/projects/alexa-llm-systems/)**: Production conversational AI at scale
