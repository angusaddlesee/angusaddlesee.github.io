---
layout: post
title: "Phase by Phase: Migrating a Production Voice Assistant Off Its Cascade"
date: 2026-06-15 10:00:00
description: A field guide to the four-phase cascaded-to-end-to-end voice migration — what each phase preserves, what it quietly destroys, and how the rollback architecture has to be designed before any of it ships.
tags: speech voice-assistants llm migration alexa
categories: technical
toc:
  beginning: true
---

The first time I sat in a meeting where someone said, with a straight face, "let's just go end-to-end next quarter," I realised the gap between the speech-LLM research literature and the engineering reality of replacing a production voice assistant is wider than almost any migration in modern AI. The papers describe a destination. The roadmap that gets you there from a decade-old cascade serving millions of users is somebody else's problem — usually yours.

I wrote the [pillar post on speech-LLM integration](/blog/2025/speech-llm-integration/) to lay out the strategic shape of the transition. This is the operational sibling. If you have accepted that the cascade is on borrowed time and are now staring at how to actually run the migration without breaking the product, this is the piece I want to point you at. The four-phase ordering is not a suggestion. The rollback architecture is not optional. The capabilities you are about to lose are not the ones you think.

## What "migration" actually means here

"Migration" gets used to mean three different things in voice-AI conversations and the conflation is expensive. It can mean a model swap inside one stage, an architectural collapse fusing two stages into one model, or a paradigm change replacing the entire cascade with a single speech-native LLM. Only the third is what this post is about, and it is structurally different because the artefact you are replacing is not a model but a *contract*.

A cascaded pipeline is a series of contracts between teams. ASR promises a transcript with a particular WER and latency profile. NLU promises typed intents and slots conforming to a schema. TTS promises a certified voice within a known prosody envelope. End-to-end migration dissolves all of those contracts and replaces the guarantees with new ones the field has not yet figured out how to write down. The only safe way is in phases that dissolve one at a time.

## Why phasing is non-negotiable

The recurring instinct in leadership is to compress the migration. The instinct is wrong for a structural reason. A cascaded pipeline fails component-wise: when something goes wrong, you isolate the failure by inspecting the intermediate representations between stages. An end-to-end model fails holistically — no transcript to inspect, no intent to second-guess, no SSML to compare against generated prosody, only audio in and audio out and a model that did the wrong thing somewhere in the middle.

Collapse all four stages at once and every regression is opaque. You have stripped yourself of the diagnostic surface that made the cascade debuggable, before building the new one an end-to-end system needs. Phasing preserves the diagnostic surface of the contract it is *not* dissolving — rungs on a ladder that lets you climb down into the opacity gradually, the previous rung still load-bearing if the next one breaks.

## The four phases in detail

### Phase 1: collapse ASR into the LLM

The model ingests speech directly via a speech encoder — Whisper, Conformer, or a learned codec front-end — and emits text. The existing TTS handles generation. Most open speech-LLMs today (Qwen-Audio, SALMONN, the GPT-4o voice mode in its understanding leg) sit at this point.

The win is real: acoustic cues the transcript discarded — emphasis, hesitation, the rising tone that turns a statement into a question — now reach the LLM. ASR errors stop propagating as clean text mistakes.

The risk is almost entirely downstream of one fact: you have just deleted the transcript. Production systems I have seen always turn out more dependent on it than anyone admitted on a whiteboard. Logging, debugging, contextual biasing, safety filtering, NLU training data, screen-side "here's what I heard" features, analytics — every one was quietly built on the transcript being a free byproduct of the pipeline. Phase 1 is mostly the project of replacing those dependencies.

### Phase 2: collapse NLU into the LLM

The LLM now handles speech understanding *and* response generation in one forward pass. The intent classifier, slot filler, and any rule-based routing dissolve into the model's reasoning.

The reward is conceptual freedom. The intent-and-slot schema, however carefully designed, was always a strict subset of what users actually want to say. You can now handle ambiguous, multi-intent, context-dependent utterances no schema captured — and ship capabilities without schema extension, NLU retraining, and downstream handler updates that used to take a quarter each.

The risk is the loss of structured output guarantees. NLU produced typed values downstream business logic could trust; the LLM produces text, and "trust the parse" is more fragile. Constrained decoding, JSON mode, tool use, function calling each re-introduces a structural constraint the LLM has to respect. NLU misclassifications were also inspectable; LLM response errors are not. By Phase 2 you have lost two of the four intermediate representations the cascade gave you for free.

### Phase 3: collapse TTS into the LLM

The model emits speech tokens directly. The TTS service goes away. Audio comes out the back of the LLM, decoded by a codec rather than rendered by a separately-tuned synthesis stack.

This is the highest-risk single phase, because voice quality is not a metric — it is a brand. Your TTS voice has been polished over years, certified by legal and accessibility, recognised by users, embedded in marketing. A slight degradation in naturalness will be noticed and complained about even when task completion improves. Users do not credit the architectural elegance of a single model emitting prosody-aware speech; they complain when the voice they have known for five years suddenly sounds, in some hard-to-articulate way, *off*.

The reward when you nail it is genuine: prosody matches content, latency drops, the model adapts pacing rather than reading every sentence the same way. The representation choice underneath is the audio tokeniser, which I argued in [the audio tokenisation post](/blog/2026/audio-tokenisation/) is the most consequential foundation in the voice-LLM stack. If your codec's reconstruction ceiling does not clear your existing TTS baseline, no amount of training data will get you to parity — you have a representation problem dressed up as a generation problem.

### Phase 4: full speech-to-speech

A single model that ingests and emits speech, ideally with an inner monologue text stream as the reasoning anchor, capable of full-duplex interaction — listening and speaking simultaneously, handling barge-in, emitting backchannels while the user is still talking. Moshi is the cleanest open-source datapoint; GPT-4o voice and Gemini's audio mode reach for the same end state.

For most organisations Phase 4 is a multi-year horizon. Overlapping conversational audio is more expensive to source than the speech-text pairs that suffice for half-duplex. The objective shifts to parallel prediction across multiple streams plus the inner monologue. There is no community benchmark for turn-taking quality yet. Phase 4 does not begin until Phases 1–3 are stable long enough for the team to have built the infrastructure [full-duplex training](/blog/) requires.

## What each phase quietly destroys, and how to keep it

The cascade is not just a set of models. It is a set of capabilities sitting silently in the gaps between stages, doing load-bearing work nobody wrote down.

**The transcript.** Phase 1 deletes it. The viable replacements are an inner monologue — a parallel text stream alongside the model's audio reasoning, invisible to the user but available for everything the transcript used to do — or a shadow ASR running purely for diagnostics. Most production migrations end up using both. The inner monologue does more than transcribe: it preserves text-based reasoning, gives you a place to apply safety filters before audio leaves the model, and turns out to be where most of the model's actual *thinking* happens. Models that skip it and emit audio directly produce fluent-sounding speech that means less. The text stream is the anchor.

**[Contextual biasing](/blog/).** Phase 1 also deletes this, and it is the single hardest capability to replace. Production ASR has years of shallow-fusion biasing toward user-specific entities — contacts, playlists, the unusual restaurant a user has been talking about for a week. None of it survives the ASR collapse. The replacements — entity lists in context, attention-based biasing on the speech encoder, retrieval-augmented recognition, phonetic embedding injection — are not drop-ins for a tuned shallow-fusion stack. In every voice migration I have seen, this is where the gap between research demos and production parity is widest. If users cannot reliably call their contacts by name after your migration, they have not migrated to the future — they have regressed to a worse version of the past.

**Component-level metrics.** WER, intent accuracy, slot F1, MOS — every one depends on an intermediate representation the migration is dissolving. By Phase 4 there is no transcript, no intent, no slot, no separately-renderable speech to grade. Quality has to be measured end-to-end: task completion rate, user satisfaction, error distribution against a frozen cascaded baseline, regression against curated hard-case sets. The shift from component to outcome metrics is the biggest cultural change the migration forces.

**Voice identity.** Phase 3 deletes this and there is no clean answer. Voice-conditioning against a reference embedding, post-generation voice conversion, keeping the existing TTS and feeding it the LLM's text for an indefinite period — each has trade-offs and none is free. If the team cannot articulate exactly how the certified voice survives the TTS collapse, Phase 3 is not ready, regardless of how impressive the prosody-aware demos look.

## Rollback architecture and the canary discipline

A migration that cannot be rolled back should not be attempted on a system serving real users. This sounds obvious; it is consistently underbuilt. The rollback architecture has to be designed *before* Phase 1 ships.

The shape is parallel systems behind a traffic router. Both pipelines run, both are deployable, and a router decides which path serves each request. Routing strategies layer:

- *Percentage-based canary*: 1%, 5%, 10%, 25%, 50%, 100%, each step gated on quality metrics holding against the cascaded baseline.
- *Quality-based routing*: simple commands go to the speech-native path for the latency win; entity-heavy queries stay on the cascaded path until biasing parity is reached. The migration does not have to be uniform across the traffic mix.
- *Sticky routing by user*: a user sees the same path consistently within a session. Switching mid-session creates inconsistencies that look like model regressions but aren't.

Automatic rollback triggers matter more than the canary curve. Define the thresholds — task completion rate drop versus baseline, P95 latency breach within the [voice latency budget](/blog/), error rate spike, real-time CSAT signals — and wire them to revert traffic without human intervention. The failure mode you are guarding against is a regression that runs for hours overnight before anyone notices.

The cost is real: two systems running for the duration of each phase, and each phase lasts at least a year. Holdback testing — keeping a small slice of traffic on the cascaded baseline indefinitely — is the best defence against slow degradation that A/B tests miss because both arms are degrading together. The canary discipline is expensive. Not having one is more expensive, just less visible until it isn't.

Once the speech-native system has held full traffic with stable metrics long enough that the team's confidence is genuine rather than rhetorical, the cascaded infrastructure scales down: emergency capacity, then minimal viable rollback, then archive. "Archive" means redeployable, not deleted. The cascade earns retirement, not deletion.

## For technical leaders

The hardest part of communicating this work upward is that the migration's value is mostly invisible during the phases where the risk is highest. Phase 1 collapses one model and you spend a year rebuilding contextual biasing, transcripts, and safety filtering — the user sees no improvement, just a model swap that was hard to ship. Phase 2 unlocks a more flexible LLM, but the wins are subtle until the team ships capabilities the old NLU schema would have blocked. Only at Phase 3 does the user experience change in obvious ways, and only at Phase 4 does the product feel like a different kind of assistant.

The failure mode for leadership is impatience that compresses phases to "show progress." Compressing phases converts a three-year successful migration into a one-year publicly broken product.

If I had to leave one line on a leadership slide: *the cascade is on borrowed time, but borrowing on a five-year mortgage is not the same as borrowing on a credit card, and the credit card is what most teams accidentally take out.*

## Where this fits

The migration is the operational layer of [the speech-LLM integration story](/blog/2025/speech-llm-integration/). Underneath it sits [audio tokenisation](/blog/2026/audio-tokenisation/), the representation choice that determines what each phase is trying to learn. Beside it sit [voice latency budgeting](/blog/) and the [full-duplex training](/blog/) curriculum Phase 4 reaches toward.

The cascade is not dead. The next decade of voice AI will be built on top of teams that ran this migration with discipline, learned which capabilities the cascade was quietly providing, and rebuilt each one before the old foundation was retired. The teams that get this right will look like they made it easy. They didn't. They phased.

_This post reflects my personal views and experience. It does not represent official Amazon positions._
