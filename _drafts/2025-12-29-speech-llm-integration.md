---
layout: post
title: "Collapsing the Voice Pipeline: Why Speech-LLM Integration Is the Hardest Migration in AI Right Now"
date: 2025-12-29 10:00:00
description: A technical and strategic guide to merging ASR, NLU, LLM, and TTS into unified speech-native models: what you gain, what you lose, and how to migrate a production system without breaking it.
tags: speech voice-assistants llm conversational-ai alexa
categories: technical
thumbnail: assets/img/misc.jpg
toc:
  beginning: true
---

For about a decade, "voice AI" has meant the same architecture: a microphone feeds an automatic speech recognition (ASR) model, ASR feeds a natural language understanding (NLU) layer, NLU feeds a dialogue manager and an LLM, the LLM feeds a text-to-speech (TTS) model, and TTS sends audio back to the speaker. Every public voice assistant (Alexa, Google Assistant, Siri) grew up on some variant of this cascade. It works. It scales. Trillions of utterances have flowed through pipelines shaped this way.

It is also the architecture being torn down right now.

GPT-4o's voice mode, Moshi from Kyutai, Gemini's audio capabilities, Meta's Spirit-LM, and a growing list of follow-ups have shown that you can collapse the cascade: let the LLM hear speech directly, reason about it, and produce speech directly back. The latency drops dramatically, the system handles interruption and overlap naturally, and capabilities emerge that the cascaded version structurally cannot achieve. Tone of voice, hesitation, prosody-aware response: none of these survive a transcript. All of them survive an audio token stream.

The catch, and it is the part of this story almost nobody outside production voice teams talks about honestly, is that ripping out a cascade that has been hardened for a decade and replacing it with a research-frontier architecture is the hardest production migration in AI right now. This post is the canonical piece I want to point engineers, product leaders, and VPs to when they ask "how do we get from here to there?" Future posts will go deeper into audio tokenisation, streaming, full-duplex training, and the operational mechanics of each migration phase. Here, the goal is the strategic shape of the problem and an honest tour of the trade-offs.

## What "speech-LLM integration" actually means

Three things that get conflated and shouldn't be:

1. **Speech-aware LLMs.** The LLM ingests speech directly, but still emits text, which is rendered by an existing TTS. ASR has been collapsed into the model; everything else is unchanged.
2. **Joint understanding and generation.** A single model both ingests and emits speech tokens. ASR and TTS are both gone. NLU has been absorbed into the LLM's reasoning.
3. **Full-duplex speech-to-speech.** The model listens and speaks simultaneously, handling interruptions, backchannels, and overlap in real time. This is the end state: what people mean when they say "voice-native AI."

These are not the same architecture and they are not the same engineering problem. The first is a feature; the second is a redesign; the third is a redefinition of what a voice assistant is. They share components (the same audio tokenisation, the same speech-text interleaving) but they sit at very different points on a multi-year migration curve. A team that wants to "go end-to-end" without distinguishing between them is going to ship the wrong project.

Formally, you can think of the cascade as a sequence of bottlenecks: $\text{audio} \to \text{transcript} \to \text{intent} \to \text{response text} \to \text{audio}$. Each arrow discards information. The transcript loses prosody. The intent loses linguistic nuance. The response text loses any acoustic intent the model might have had. End-to-end speech-LLM integration is the engineering answer to "what if we stop discarding?", and the entire migration story is about the consequences of that choice.

## Why the cascade is on borrowed time

Three forces are converging on this transition. They are worth naming, because if you are a leader trying to decide whether to invest, the question is not "is this real?" but "is it real for my product, on my timeline?"

**Latency.** A cascaded pipeline has eight to twelve sequential stages between the user finishing their sentence and the assistant beginning its response. Even with aggressive streaming and speculative execution, the floor on response latency is set by the sum of each stage's overhead. A unified model can begin generating its response while still ingesting the user's speech. The floor moves to something close to one model's first-token latency, well below what cascade optimisation can ever reach. For voice products where conversational naturalness is the differentiator, this matters more than any single accuracy improvement. I'll dedicate a separate post to voice latency budgeting; the short version is that every additional fraction of a second is felt, and the cascade has a structural latency floor that end-to-end does not.

**Capability ceiling.** Cascade architectures cannot do certain things in principle. They cannot respond to tone of voice, because tone is gone after ASR. They cannot match the user's pacing, because there is no audio in the response path. They cannot do natural interruption-and-recovery, because the listening and speaking phases are sequential by design. End-to-end models can do all of this, sometimes still imperfectly, but the ceiling is qualitatively higher.

**Architectural simplification.** A production cascade is a dozen models, each owned by a different team, each with its own evaluation pipeline, its own retraining cadence, and its own deployment surface. A unified model is one. The maintenance, evaluation, and iteration cost of a cascade compounds over years; the maintenance cost of a unified model is closer to constant. For an organisation, that is a strategic difference, not a technical one.

The counterforce is also real. The cascade is battle-tested. Years of production traffic, contextual biasing tuned to your specific users, certified TTS voices that are now part of your brand, an evaluation infrastructure that knows exactly which component to blame when something breaks. Throwing all of that away in one go is reckless. The interesting question is not "should we migrate?" but "in what order, and what do we keep?"

## The migration has a natural ordering

The most important strategic insight in this whole space is that you cannot, and should not, flip a switch. The migration has a natural sequence based on risk and reward, and skipping a step is how teams have publicly broken production systems trying to chase the frontier.

**Phase 1: collapse ASR into the LLM.** The LLM ingests speech directly via a speech encoder, but still produces text; the existing TTS handles speech generation. Highest reward for moderate risk: you get acoustic cues into the LLM, you stop propagating ASR errors, and you remove a model from your stack. You also lose the transcript, and "lose the transcript" sounds small until you realise how many production systems are quietly built on it: logging, debugging, contextual biasing, safety filtering, NLU training data, analytics, the user-facing "show what was heard" feature. None of these vanish; they all need replacement plans.

**Phase 2: collapse NLU into the LLM.** The model now handles both speech understanding and response generation in one pass. Moderate reward for low incremental risk, since most of the architectural pain landed in Phase 1. You gain the ability to handle ambiguous and novel utterances that no NLU schema captured. You lose structured output guarantees, which is a real problem for any downstream business logic that expects typed intent-and-slot structures. The mitigation (constrained decoding, function calling, tool use) is well-understood, but it is not free.

**Phase 3: collapse TTS into the LLM.** The model emits speech tokens directly. Moderate reward for high risk: the prosody-matches-content gain is genuine, but voice quality is immediately perceptible to users and the bar is set by certified TTS that has been polished for years. A slight degradation in voice naturalness will be noticed and complained about even when task completion improves. This is the phase where most migrations stall.

**Phase 4: full speech-to-speech.** A single model that ingests and emits speech, with optional internal text reasoning, capable of true full-duplex interaction. This is the end state: Moshi, GPT-4o voice, what Gemini's audio mode is reaching toward. Highest reward, highest risk. For most organisations this is a multi-year horizon, not a quarterly project.

Each phase is independently deployable, independently evaluable, and independently rollback-able. That is what makes the sequence safe. Trying to do Phase 1 and Phase 3 at the same time is what makes it unsafe.

## What you lose, and how to keep it anyway

The cascade is not just a bag of models; it is a bag of *capabilities* that production teams accumulated over years. Every one of them has to be preserved or replaced during migration, and "we'll figure it out later" is the answer that ends migrations.

The transcript is the largest single loss. It is a free intermediate representation that everything downstream consumes. The two viable replacements are an **inner monologue** (the model emits a parallel text token stream alongside its speech tokens, invisible to the user but available for logging, safety filtering, and debugging) or a **shadow ASR** running in parallel for diagnostic purposes only. Most production paths end up using both. The inner monologue, in particular, turns out to be load-bearing for more than just transcripts: it preserves text-based reasoning quality and gives you a place to apply text-based safety filters before audio is generated. Models that skip the inner monologue and generate audio directly tend to produce fluent-sounding speech that says less meaningful things. The text stream is the anchor.

Contextual biasing is the next biggest. Production ASR systems have years of work in shallow-fusion biasing toward user-specific entities: your contacts, your playlists, the unusual restaurant you've been talking about. Collapse the ASR and that machinery is gone. The replacements are entity lists in the LLM context, attention-based biasing on the speech encoder, or retrieval-augmented recognition. None are drop-in replacements for a tuned ASR biasing stack. This is the area where I expect production migrations to spend the most engineering time per unit reward.

Component-level metrics also disappear. You can no longer measure WER independently. Quality has to be measured end-to-end: task completion, user satisfaction, error type distribution against the cascaded baseline. This is fine in principle but it changes how teams debug. When the new system gets a query wrong, you cannot point at the ASR or the NLU; you have to design a new debugging methodology that probes intermediate representations or compares against a parallel cascaded system on the same traffic.

The certified TTS voice is its own special case. A voice is a brand asset. Users notice when it changes. Migrating to LLM-generated speech without losing the voice requires either voice-conditioning the generation, post-generation voice conversion, or keeping the existing TTS and feeding it the LLM's text output for an indefinite period. There is no clean answer. The honest position is that Phase 3 should not happen until the team has a credible plan for voice consistency.

## Streaming, full-duplex, and the part nobody warns you about

A speech-LLM that processes one full utterance, thinks for a second, then produces a full response is a half-duplex system. It is genuinely useful and it is the right intermediate target for most migrations. But it is not the end state. The end state is full-duplex: the model listens and speaks simultaneously, handles barge-in, emits backchannels ("mm-hmm") while the user is still talking, and adjusts its response mid-flight when the user redirects.

Full-duplex is not a feature you bolt on. It changes the model's training objective, its inference loop, and its compute profile in fundamental ways. The model now has at least two audio streams it processes in parallel (the user's speech and its own), plus, ideally, the inner monologue text stream. Per-step compute roughly doubles. The training data has to include genuinely overlapping conversational audio with both speakers active, which is a different and more expensive corpus than the speech-text pairs that suffice for half-duplex.

The other thing nobody warns you about is that the *evaluation* gets harder. WER does not apply. There is no transcript. Latency is no longer a single number, because the model is doing multiple things at once. Turn-taking quality (when does the model start speaking, when does it yield, how does it recover from interruption) becomes a first-class metric, and there is no community-standard benchmark for it yet. You will be inventing your evaluation infrastructure as you go. This is a frontier problem, not an engineering problem.

The general lesson: streaming is hard, full-duplex is harder, and the part that shocks teams making the transition is how much of the difficulty is in evaluation rather than modelling.

## How to actually start

If you lead a voice product and you are wondering when and how to begin, here is the order I would run it in:

1. **Build the evaluation framework before you change any models.** End-to-end task completion rate, latency percentiles (not averages), per-error-type breakdown, regression analysis against a frozen cascaded baseline. You cannot manage what you cannot measure, and the cascade's main advantage right now is that it is measurable in ways the end-to-end system is not. Close that gap first.
2. **Run a shadow Phase 1 before deploying Phase 1.** A speech-aware LLM running on the same traffic as the cascade, comparing outputs offline, with no user impact. The first six months of any migration should be diagnostic, not deployment.
3. **Decide the inner-monologue question early.** Are you going to keep a parallel text stream from day one? In my view: yes, every time. The ability to log, debug, and apply text-based safety filtering will pay for itself many times over.
4. **Have a plan for contextual biasing before you collapse ASR.** This is the single most production-critical capability that disappears in Phase 1, and the replacement architectures are not yet mature. Do not let this be a surprise.
5. **Canary aggressively, hold back permanently.** Standard canary deployment for the new system, but also keep a small percentage of traffic on the cascaded baseline indefinitely. This catches slow degradation that A/B tests miss.
6. **Maintain rollback for at least a year per phase.** The cascaded pipeline has to be operationally deployable, not just archived. This is expensive. It is also non-negotiable.
7. **Cross-train the team.** The migration requires deep expertise in both speech processing and LLMs, and almost no one has both. Teams that only know one side make costly mistakes. The single highest-leverage hire for this work is someone who has shipped both.

Notice what is not on this list: a target date for full speech-to-speech. The migration finishes when each phase has been validated against the cascaded baseline and the team is ready for the next. Trying to commit to a Phase 4 ship date before Phase 1 is in production is the most reliable way to ship a regression at scale.

## Where this fits

Speech-LLM integration is the place where everything else in the modern LLM stack lands in a single product. It is where [LLM routing](/blog/2025/llm-routing-at-scale/) meets latency budgets that cannot be optimised away. It is where [LLM-as-judge](/blog/2025/llm-as-judge/) has to evaluate outputs that have no transcript. It is where reward modelling has to grade prosody and turn-taking, not just text correctness. It is where every research advance in audio tokenisation, streaming, and full-duplex training has to survive contact with millions of users on real-world hardware over real-world networks.

For technical leaders, the strategic point: the cascade is on borrowed time, but borrowing strategically is not the same as borrowing badly. The teams that migrate well will be the ones that treat this as a multi-year programme with discipline at every phase, not a chase for the frontier headline. The teams that migrate badly will be visible. There is no quiet way to break a voice assistant.

For engineers: the field is genuinely changing under your feet. The production craft of cascaded voice AI is not going to be obsolete tomorrow (it is the substrate of every successful migration), but the new craft of streaming, full-duplex, audio-tokenised, inner-monologue-trained voice models is what is going to define the next decade. Now is the moment to build the depth.

Future posts in this series will go deeper into each piece: audio tokenisation choices, the speech-text interleaving design space, streaming architectures, full-duplex training curricula, and the operational mechanics of a production migration. The short version, for now: the cascade isn't dead, but it isn't the future. The migration is the work.

_This post reflects my personal views and experience. It does not represent official Amazon positions._
