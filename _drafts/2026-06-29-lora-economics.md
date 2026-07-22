---
layout: post
title: "LoRA, QLoRA, and the Economics of Fine-Tuning"
date: 2026-06-29 10:00:00
description: A technical deep-dive into LoRA, QLoRA and the wider PEFT family: the rank-decomposition that turned customisation into a laptop-scale problem, the operational story of serving many adapters, and where the economics still haven't finished adjusting.
tags: fine-tuning lora qlora peft machine-learning
categories: technical
toc:
  beginning: true
---

In 2020 the cost of fine-tuning a model at the largest scales anyone had was a research grant. By 2024, fine-tuning a 70B model was a long weekend on a single rented A100. What closed the gap was not Moore's law, a new accelerator, or a better optimiser. It was a one-page idea about rank. Hu et al. wrote LoRA in 2021, Dettmers et al. bolted 4-bit quantisation onto it two years later, and the economics of LLM customisation re-folded around two small matrices and a quantile-spaced number format. Frontier labs still do full fine-tuning when it matters. Almost nobody else does, and most of them never need to.

This is the deep-dive I'd point engineers at when they ask why everyone uses LoRA, what QLoRA actually changed, and which of the dozen LoRA-flavoured papers are real improvements versus arXiv noise. PEFT didn't just make fine-tuning faster; it changed who is allowed to do it, which changed what gets done.

## What LoRA actually does (the maths)

The premise rests on one robust empirical observation: when you fine-tune a pretrained model, the weight update $\Delta W$ has _low intrinsic rank_. Even when you allow the optimiser the full $d \times k$ degrees of freedom, the effective dimensionality of what it learns is much smaller than the parameter count suggests. Most of the adaptation lives in a handful of directions in weight space.

LoRA exploits this directly. For each weight matrix $W_0 \in \mathbb{R}^{d \times k}$, you freeze it and add a low-rank update factored as a product:

$$W = W_0 + \Delta W = W_0 + BA, \qquad B \in \mathbb{R}^{d \times r},\; A \in \mathbb{R}^{r \times k}, \; r \ll \min(d, k).$$

The forward pass becomes $h = W_0 x + (\alpha/r) B A x$, with $\alpha$ a scaling factor controlling how loud the adapter is relative to the base. $A$ is initialised from a Gaussian, $B$ from zero, so $BA = 0$ at step zero and training starts exactly at the pretrained weights, a symmetry-breaking detail that matters more than it sounds, and is why naïve pre-LoRA "just add a low-rank perturbation" implementations didn't quite work.

The parameter savings are obvious once you do the arithmetic. A $4096 \times 4096$ projection has 16.7M parameters; rank-16 LoRA adds $\approx 131$k. Two orders of magnitude. Across a 7B model, "all linear layers at rank 16" is around 0.6% of total parameters, and only that 0.6% needs gradients, optimiser states, and checkpoint storage. Adam's moment buffers are a 4× memory multiplier on every trainable parameter; cutting trainable parameters by 100× cuts optimiser memory by 100×, which is most of the win.

The other elegant property is the merge step. After training, $W_{\text{merged}} = W_0 + (\alpha/r) B A$ is a one-time matrix addition, and the result is bit-for-bit a normal model: same architecture, same FLOPs, same latency. There is no inference tax for having fine-tuned. That is the property adapters never had, and it is most of why LoRA won.

## The QLoRA economics

LoRA made fine-tuning cheap in optimiser memory but did nothing about the base model. A 70B model in bf16 still needs ~140GB just to sit in GPU memory, before activations, before LoRA, before anything. That ruled out most hardware most people had.

QLoRA's contribution was to notice that the base weights only need to be _read_ during LoRA training, never written; gradients flow exclusively through $A$ and $B$. So you can store the base in something far more compressed than bf16, dequantise on the fly during the forward pass, and pay essentially no quality cost as long as the quantisation is good enough. Dettmers et al. picked three pieces:

1. **NF4 (4-bit NormalFloat)**: a data type whose 16 quantisation levels are the quantiles of a standard normal, not equally-spaced bins. Pretrained weights are approximately Gaussian; uniform int4 wastes resolution in the empty tails. NF4 is information-theoretically optimal for normally distributed data, and the empirical gap between NF4 and bf16 fine-tuning was, in their experiments, indistinguishable from noise.
2. **Double quantisation**: quantising the per-block quantisation _constants_ themselves at 8-bit, shrinking their overhead from ~0.5 to ~0.13 bits per parameter. A saving of ~0.37 bits per parameter is small in absolute terms, but it adds up.
3. **Paged optimisers**: NVIDIA unified memory so optimiser state spills to CPU RAM during long-sequence forward passes instead of OOMing. Less mathematically interesting, more operationally important than people give it credit for.

The forward pass becomes $h = \text{dequant}(W_{\text{4bit}}) x + (\alpha/r) B A x$, with $W_{\text{4bit}}$ frozen and the LoRA matrices in bf16. The 65B model Dettmers fine-tuned on a single 48GB GPU would have needed ~780GB in 16-bit full fine-tuning. That is a 16× memory reduction at negligible quality cost, and the ratio is the point: QLoRA changed which hardware tier the problem lived on. 65B fine-tuning became something a graduate student could do.

The cost is real: dequantising 4-bit weights on every forward pass is not free, and QLoRA training is roughly 20–40% slower per step than 16-bit LoRA on the same hardware. The trade is worth it whenever the alternative is "the model doesn't fit." Whenever bf16 LoRA does fit, prefer it. And the under-appreciated detail: QLoRA produces standard LoRA adapter weights; the 4-bit base is a training-time choice, decoupled from serving. That decoupling is how a research paper turned into an entire downstream ecosystem of consumer-grade fine-tuned models.

## The LoRA family

The original paper landed in 2021 and variants arrived immediately. Most are noise. Three are worth knowing.

**LoRA+ (Hayou et al., 2024)** is the closest thing PEFT has to a free lunch. The two matrices play different roles and have different shapes, and Hayou et al. show that this gives them asymmetric learning dynamics at scale; giving them the same learning rate is provably suboptimal. LoRA+ trains $B$ faster than $A$: $\eta_B = \lambda \cdot \eta_A$ with $\lambda \gg 1$, and the paper recommends $\lambda \approx 16$ in practice. One optimiser parameter group, 1–2% accuracy, 10–20% faster convergence. There is no reason not to use it; the only reason most people don't is that they haven't heard of it.

**DoRA (Liu et al., 2024)** is the more interesting structural variant. The observation: full fine-tuning makes _large directional changes with relatively small magnitude changes_, and standard LoRA's coupled update can't represent that pattern cleanly. DoRA decomposes each weight matrix column-wise into magnitude and direction, then applies the low-rank update only to the directional component:

$$W' = m' \cdot \frac{V + BA}{\|V + BA\|_c},$$

with $m'$ a separately-learnable per-column scalar. Empirically DoRA closes most of the remaining gap to full fine-tuning at the same rank, costing a column-wise norm per forward pass (~10–20% layer-level overhead). DoRA is a slightly more honest parameterisation of what fine-tuning actually does, and the consistent 1–3% gain at no parameter cost suggests the honesty is worth something.

**Rank selection** is where most of LoRA's hyperparameter risk lives. Hu et al. originally found NLU tasks on GPT-3 saturated at $r = 4$. Subsequent work on instruction tuning, code, and reasoning found that 64 or 128 give meaningful gains. The rough heuristic:

- Style or tone adjustment: $r = 4$–$8$.
- Instruction tuning, chat, moderate domain shift: $r = 16$–$32$.
- Code, maths, deep behavioural changes: $r = 64$–$128$.
- New language, large distribution shift: $r = 128$–$256$. At this point, ask whether full fine-tuning is structurally a better fit.

The other rule worth internalising: at fixed parameter budget, _adapt more layers at lower rank_ rather than fewer layers at higher rank. "All linear layers at rank 16" beats "$Q$ and $V$ only at rank 64" almost every time. Adaptive methods like AdaLoRA learn the distribution per-layer, but I haven't seen them justify the additional tuning complexity often enough to recommend them as a default.

## Where LoRA is the wrong tool

LoRA's rank constraint is a real constraint. It is most of why the method works as well as it does: the low-rank structure is a regulariser, the parameter savings are a memory optimiser, and most fine-tuning tasks live in the low-rank subspace anyway. But "most" is not "all."

**Continued pretraining on a large corpus.** If you are extending a model with a billion new tokens of domain-specific text, you are not fine-tuning, you are pretraining. The update is genuinely high-rank: you are reorganising the model's representation of an entire domain. LoRA at rank 256 will give you a worse model than full fine-tuning, and you will spend more compute getting there.

**Adding a new language to a model that has never seen it.** The directions in weight space the model needs are largely orthogonal to anything LoRA can express at moderate rank. You can _try_ at rank 256, but at that point you are using LoRA as a clumsy approximation to full fine-tuning.

**Tasks where the last 1–2% is load-bearing.** In my experience LoRA gets you most of the way to full fine-tuning quality on most benchmarks, and the remaining gap is usually fine. But for the frontier-grade post-training that defines a flagship model, the last percentage points are the entire point of the exercise. Frontier labs do full fine-tuning for headline alignment runs and LoRA for the 90% of experiments that aren't. That is the right division.

**Anything you intend to use as a reward model.** Reward models are scalar regression heads trained on Bradley-Terry pairwise loss; the calibration of the scalar is what the entire downstream RL run depends on. LoRA reward models do work, and they are widely used for cost reasons (see [reward modelling at scale](/blog/2026/reward-modelling-at-scale/) for the full argument), but I'd think hard about the reliability ceiling before defaulting to LoRA on the reward side.

The principle behind all of these: LoRA's low-rank structure is a prior on the geometry of the update. When the prior matches the task, you get a free 100× win. When it doesn't, the prior is a ceiling, and the ceiling is invisible until you hit it.

## The operational story

The single most underrated property of LoRA is that the trained artefact is small. A rank-16 adapter for a 7B model is about 50MB; you can store thousands in the footprint of one full-fine-tuned model, ship them as if they were config files, and serve a lot of them from a single base.

This is the architecture behind every commercial fine-tuning API I am aware of. Systems like S-LoRA, LoRAX, and Punica keep one copy of the base in GPU memory, pull per-request LoRA weights from a CPU- or NVMe-resident cache, and do the low-rank multiplication as an extra term in the forward pass. The base FLOPs are amortised across thousands of users, and each user gets a personalised model at the marginal cost of one matrix multiply per layer. Multi-tenant LoRA serving is the unit-economics unlock for the entire fine-tuning-as-a-service category.

Once you have hundreds of adapters, the interesting question is which one you serve for a given request. That is an [LLM routing](/blog/2025/llm-routing-at-scale/) problem in miniature, with the same shape and the same operational discipline. The system that owns adapter routing is the system that decides whether the LoRA-per-customer business model holds together.

The case _for_ merging adapters (collapsing task vectors $\tau_i = B_i A_i$ into $W_{\text{merged}} = W_0 + \sum \lambda_i \tau_i$) is that the merged model has zero adapter overhead and no routing layer. TIES-Merging and DARE handle interference better than naïve averaging, and the open-source community has stacked community-trained LoRAs into capable generalists. I'll write more in a future model merging deep-dive; the short version is that merging works well for a small number of compatible adapters and degrades quickly past that. The case _against_ is that you lose dynamic per-request task weighting and the ability to retire one adapter without touching the others. For multi-tenant serving where customer fine-tunes must stay isolated, merging is structurally wrong. For a single-team capability bundle, it is fine. The decision is mostly an organisational one wearing a technical disguise.

## For technical leaders

The strategic point sitting underneath all of this is that PEFT collapsed the distribution of who can run a fine-tuning experiment. Pre-LoRA, fine-tuning a 65B model was a multi-node distributed training problem: a dedicated cluster, an infra team, a quarter of planning. Post-QLoRA, it is something one person can do on a rented GPU between meetings. The number of people who can credibly say "we fine-tuned a 70B model on our domain" went up by roughly two orders of magnitude in two years, and the experiments shifted from "the one we could afford" to "the one we wanted to."

The thing I'd bet has not finished playing out is the implication for build-versus-buy on customisation. The conventional wisdom is still "use the API, prompt-engineer your way out, only fine-tune when you must." That was correct in 2022; in 2026 it is increasingly wrong. The cost of a QLoRA fine-tune of a frontier-class open model is now low enough that the question is not "can we afford to fine-tune?" but "can we afford _not_ to, given how much our prompts have grown to compensate?" The teams I've watched go through this transition rarely regret it. The teams still pretending fine-tuning is exotic are mostly underestimating how much prompt complexity has crept into their stack to avoid it.

None of this has dissolved the quality gap with full fine-tuning at the absolute frontier. The labs running headline alignment runs still pay the full bill. What LoRA did is make that gap matter to a much smaller fraction of the field. For the rest of us (applied teams customising open models for verticals, academics running ablations, indie developers shipping personalised assistants) fine-tuning is now closer to "configure and run" than to "raise capital and plan."

The short version: LoRA gave you a 100× cut in optimiser memory by exploiting the low intrinsic rank of the update. QLoRA gave you a 16× cut in base-model memory by quantising the bit you didn't need to write to. Together they turned customisation from a capital-budget problem into a runtime-config problem, and the field has not finished metabolising what that means. The maths is small, the consequences are not.

_This post reflects my personal views and experience. It does not represent official Amazon positions._
