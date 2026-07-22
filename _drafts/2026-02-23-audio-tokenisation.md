---
layout: post
title: "Audio Tokenisation: The Design Choice That Shapes Every Voice-LLM"
date: 2026-02-23 10:00:00
description: A deep dive into the foundational representation decision under every speech-native LLM — semantic tokens, acoustic codecs, hybrid approaches, codebook hierarchies, and how the choice quietly determines everything downstream.
tags: speech audio-tokenisation voice-assistants llm machine-learning
categories: technical
thumbnail: assets/img/misc.jpg
toc:
  beginning: true
---

Almost every interesting argument I have had about voice-LLM architecture in the last two years has, on close inspection, been an argument about audio tokenisation. People think they are debating streaming, full-duplex training, the inner monologue, or whether to keep TTS around for another generation. They aren't. They are debating, downstream of a representation choice nobody made deliberately, what that choice forces them into.

In my [pillar post on speech-LLM integration](/blog/2025/speech-llm-integration/), I argued that collapsing the cascaded voice pipeline is the hardest production migration in AI right now. The reason it is so hard isn't the migration mechanics — those are at least visible. The reason is that one of the earliest choices you make, audio tokenisation, propagates into latency, evaluation, training data requirements, generation quality, and the shape of every subsequent architectural decision. Choose wrong and you are still paying for it three phases later.

This post is the deep dive on that choice: what audio tokenisation actually is, the semantic-versus-acoustic-versus-hybrid landscape, why the codebook hierarchy is doing more work than people realise, the failure modes I have watched teams fall into, and how I would think about choosing today.

## What audio tokenisation actually is

Text is already discrete. "Hello" is five characters or one BPE token; the model never has to ask what "hello" *is* at the level of bits. Speech is continuous. A 16kHz waveform produces 16,000 floating-point samples per second. To feed that into an LLM whose entire architecture assumes a sequence of discrete tokens, you have to compress audio down to roughly 25–100 tokens per second — comparable to text token rates — while still preserving enough of the signal to be useful for whatever the LLM is going to do with it.

Formally, the problem is to find an encoder $E: \mathbb{R}^{T} \to \{1, \dots, V\}^{T'}$ that maps a $T$-sample waveform to a sequence of $T'$ tokens from a vocabulary of size $V$, with $T' \ll T$, and a decoder $D$ such that $D(E(x))$ is "close enough" to $x$ on the dimensions that matter. The catch is that the dimensions that matter are not the same across applications.

The fundamental tension, the one I find people still flinch from naming, is between **semantic content** — what was said — and **acoustic detail** — how it was said: voice identity, prosody, emotion, recording conditions, the slight tremble that signals the user is upset. Text captures semantics perfectly and discards acoustics entirely. Raw audio preserves everything but at an impractical rate. Audio tokenisation has to find the right compromise on this spectrum, and "right" is application-dependent. There is no neutral choice here — even doing nothing, by projecting continuous Whisper features into the LLM's embedding space without discretisation, is a choice with consequences.

## Semantic, acoustic, or hybrid?

Three families of audio tokenisers dominate today, and they answer the semantics-versus-acoustics question very differently.

**Semantic tokens** are the closest thing to "speech as if it were text". Run a self-supervised speech model — HuBERT, wav2vec 2.0 — on the audio, take a hidden layer, and k-means cluster the activations into 500–2000 clusters at around 50 tokens per second. They capture phonetic and linguistic content but discard speaker identity, prosody, and most acoustic detail. Whisper-encoder-derived discrete tokens sit here too. Clean, low-rate, easy for an LLM to consume, structurally incapable of carrying voice quality. For understanding-only systems, the obvious starting point.

**Acoustic tokens** come from neural audio codecs — EnCodec (Meta, 2022), SoundStream (Google, 2021), DAC (Descript, 2023). They compress audio to discrete codes through an encoder, a residual vector quantisation (RVQ) bottleneck, and a decoder, jointly trained for reconstruction. EnCodec runs at 75Hz with $Q = 8$ codebooks of 1024 entries, giving 6kbps and near-transparent reconstruction. Acoustic tokens preserve everything — speaker, prosody, recording quality — at the cost of many more tokens per second, with a substantial fraction encoding information an LLM reasoning about meaning fundamentally does not need.

**Hybrid tokens** try to have it both ways. SpeechTokenizer (Zhang et al., 2023) is the cleanest example: an RVQ codec where codebook 1 is explicitly distilled to match HuBERT semantic tokens, and subsequent codebooks pick up the residual acoustic detail. SemantiCodec and Mimi (the codec inside Moshi) occupy this design space. Hybrids are where the field is converging for joint understanding-and-generation models.

| Strategy | Tokens/sec | Semantics | Acoustics | Best for |
|----------|-----------|-----------|-----------|----------|
| HuBERT k-means | ~50 | Strong | None | Pure understanding |
| EnCodec, codebook 1 only | 75 | Moderate | Coarse | Light understanding + basic generation |
| EnCodec, all codebooks | 75 × 8 = 600 | Moderate | Strong | High-quality generation |
| SpeechTokenizer / Mimi | ~50 semantic + ~50 × 7 acoustic | Strong | Strong | Joint understanding + generation |
| Continuous features (no discretisation) | 50–75 | Strong | Moderate | Understanding-only on an existing LLM |

The honest summary is that there is no globally best row in that table — only a row that is best for the system you are actually trying to ship.

## The codebook hierarchy — and why it matters more than people think

Almost every modern audio codec uses residual vector quantisation, and RVQ's structure is doing more work than its surface description suggests.

In RVQ, each frame is quantised through $Q$ codebooks sequentially. Codebook 1 picks the nearest entry to the latent. Codebook 2 quantises the *residual error* left from codebook 1. Codebook 3 quantises the residual from 1 and 2, and so on. With $z$ the latent, $c_q(\cdot)$ the $q$-th codebook's nearest-neighbour function, and $\hat{z}_q$ the cumulative reconstruction:

$$\hat{z}_q = \sum_{i=1}^{q} c_i\big(z - \hat{z}_{i-1}\big), \quad \hat{z}_0 = 0.$$

What this produces in practice is a hierarchy. The first codebook captures the coarsest, most semantically loaded content — what was said. Each subsequent codebook captures finer-grained residual detail: speaker, prosody, room acoustics, breath. By codebook 8 you are encoding things a human would barely notice but a discriminator would.

The implication I keep coming back to: an RVQ codec gives you, for free, an internal axis from semantic to acoustic. You do not pick semantic *or* acoustic — you pick how many codebooks to use and at what stage. Codebook 1 only for understanding, full stack for generation. Hybrid tokenisers like SpeechTokenizer and Mimi formalise this, sharpening the natural hierarchy into an explicit semantic-acoustic split the model can reason about.

It also explains why the *multi-codebook problem* matters. Eight codebooks at 75Hz is 600 tokens per second. A 10-second utterance becomes 6,000 tokens of audio alone. For an LLM with a fixed context window and per-token compute cost, that is brutal. Four common ways to handle it:

- **Flattened sequence:** interleave codebooks in token order — $[c^1_1, c^2_1, \dots, c^8_1, c^1_2, \dots]$. Simplest, sequence-length-wise the worst.
- **Delayed pattern:** offset codebooks in time so codebook $q$ at frame $t$ is predicted alongside codebook $q-1$ at $t+1$ (SoundStorm / MusicGen). Reduces effective sequence length without sacrificing autoregressive structure.
- **Hierarchical generation:** semantic codebook autoregressively with the LLM, acoustic codebooks in parallel with a smaller non-autoregressive model. AudioLM and VALL-E sit here, and most production voice-generation systems converge toward something like it.
- **Skip discretisation:** project continuous encoder features directly into the LLM's embedding space. Qwen-Audio, SALMONN, and most "speech-aware LLM" Phase 1 migrations live here.

The choice between these is not just an efficiency optimisation — it changes what the model can learn, how it streams, and where the latency budget lands. I will go deeper into it in [a follow-up on speech-text interleaving](/blog/), because the interleaving pattern is downstream of the tokenisation choice and is where most of the practical engineering happens.

## The failure modes

A short tour of what I have watched go wrong, roughly in order of frequency.

**Acoustic tokens for an understanding-only system.** You pay 600 tokens per second of context and compute the model never uses, because your task is transcription-shaped. The first sign is inference cost two to three times what it should be. Step back to semantic tokens, continuous features, or just the first one or two RVQ codebooks.

**Semantic tokens, then trying to generate speech later.** Semantic tokens discard speaker and prosody by construction, so whatever generation model you bolt on is either operating on a different tokenisation than the rest of your stack or producing speech with no acoustic conditioning. Hybrid tokenisers exist precisely to avoid this trap.

**Underestimating the codec quality ceiling.** The codec's reconstruction quality is an absolute upper bound on the speech your generation system can produce. If your EnCodec checkpoint has a slightly metallic high end, every word your voice-LLM ever speaks will have it. Teams skip evaluating codec reconstruction in isolation, then are confused when generation-side metrics top out below the TTS baseline. Always reconstruct first, generate second.

**Vocabulary integration without continued pretraining.** Bolting audio tokens onto an existing text LLM means extending the text vocabulary or using a separate embedding table. Either is workable, neither is free — both need continued pretraining on speech-text data large enough for the model to learn the new embeddings. Skip it and you ship a model that technically consumes audio tokens and substantively cannot reason about them.

**Ignoring tokenisation in evaluation.** There is no single metric. PESQ and STOI capture reconstruction fidelity. Phone error rate on resynthesised speech captures semantic preservation. Downstream task performance captures everything else. You need at least three numbers, tracked at every tokenisation change. This becomes load-bearing during the migration phases from [the pillar post](/blog/2025/speech-llm-integration/) — when WER stops applying, codec-side metrics are some of the only diagnostic signal left.

**Locking the tokeniser in too early.** The decision I have seen teams regret most. Retraining everything downstream when the tokeniser changes is enormously expensive. If you have any uncertainty, start with continuous features and a frozen speech encoder — cheapest to swap out — and only commit to discrete tokenisation when the rest of the architecture forces it.

## How to choose

The decision tree I would actually run is shorter than people expect.

1. **What does the model need to do — understand, generate, or both?** Understanding only: continuous features or semantic tokens. Generation: acoustic information somewhere. Both: a hybrid.
2. **Existing text LLM or trained from scratch?** Existing LLMs strongly favour continuous-feature projection in early phases — it preserves text capabilities and avoids vocabulary extension. From-scratch joint models can commit to discrete tokens earlier.
3. **What is your latency budget?** Lower token rates buy context-window headroom and reduce per-step cost. Continuous features and pure semantic tokens win on token rate. Multi-codebook RVQ loses unless you use delayed-pattern or hierarchical-generation tricks.
4. **What is your evaluation infrastructure?** If you cannot independently measure reconstruction fidelity, semantic preservation, and downstream task quality, you are not yet ready to commit to a tokeniser. Build the evaluation first.
5. **Is voice quality a brand asset?** For any consumer voice product, yes. Your codec's reconstruction ceiling needs to clear your existing TTS baseline before any generation-side migration begins. This is the tokenisation question hiding inside what looks like a TTS migration question.

If I had to give a default for someone starting a serious voice-LLM project today: continuous features for understanding-only systems, SpeechTokenizer-family hybrids for joint systems, and a hard rule that no tokenisation choice gets locked in until evaluation infrastructure can independently grade reconstruction, semantics, and downstream task quality.

## For technical leaders

The point I would press hardest if I were briefing a director or VP on this work: audio tokenisation is not a low-level implementation detail you can delegate to one researcher and revisit at review time. It is an architectural commitment that propagates into every other decision in the voice-LLM stack — context length, latency, training data, evaluation, voice quality ceiling, and the migration phasing I laid out in [the pillar post](/blog/2025/speech-llm-integration/). Treat it as a top-level decision, owned by someone who understands both speech and LLMs, with explicit success criteria and an explicit reversibility plan. Teams that get this right make it look easy. Teams that don't are the ones whose voice quality, evaluation pipelines, or inference costs quietly fail to converge eighteen months in — and by then the cost of switching tokenisers is enormous.

If you cannot articulate, for your product, *which* of the three tokenisation families you are committing to and *why*, your voice-LLM roadmap has a gap at the foundation.

## Where this fits

Audio tokenisation is the input layer to everything else in the voice-LLM stack. The next layer up is [speech-text interleaving](/blog/) — how speech tokens, text tokens, and the inner monologue coexist in a single sequence. Above that is [streaming speech input](/blog/), which determines whether tokenisation is even compatible with real-time interaction, and [full-duplex training](/blog/), which redefines what the model is trying to predict. Underneath all of it is the [voice latency budget](/blog/) — the fixed time between the user finishing their sentence and the system needing to respond, into which every tokenisation, encoding, and decoding cost has to fit.

This is the cleanest example of why I argued in the [pillar post](/blog/2025/speech-llm-integration/) that the speech-LLM migration is the hardest one in AI right now. The migration mechanics — phasing, rollback, canary, evaluation — are tractable. The chain of foundational representation choices on which all of those mechanics rest is not, except by patient and deliberate work. Audio tokenisation is the first of those choices, and it sets the ceiling for everything that comes after. The cascade is on borrowed time, and the architecture that replaces it will be defined, more than anything else, by the design choice underneath every voice-LLM: how to turn sound into tokens.

_This post reflects my personal views and experience. It does not represent official Amazon positions._
