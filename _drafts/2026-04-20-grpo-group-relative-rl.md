---
layout: post
title: "GRPO and Group-Relative RL: Why Everyone Is Moving Past PPO"
date: 2026-04-20 10:00:00
description: A technical deep-dive into GRPO, RLOO, GSPO and the group-relative family: why critic-free RL has eaten frontier LLM training, what the maths actually buys you, and the failure modes that bite in production.
tags: rlhf grpo reinforcement-learning reward-modelling alexa
categories: technical
thumbnail: assets/img/misc.jpg
toc:
  beginning: true
---

For most of the post-InstructGPT era, the canonical answer to "how do we run RL on a language model?" was PPO with a learned critic. Schulman et al. brought it over from continuous control, Ouyang et al. industrialised it into RLHF, and every frontier lab maintained it as their gold-standard alignment loop. Then in early 2024 DeepSeek published GRPO in the DeepSeekMath paper, used it a year later to train DeepSeek-R1, and within months the open-source RL stack had reorganised itself around critic-free, group-relative methods. By the time Qwen2.5-Math and a long tail of community reasoning models had landed, PPO was quietly demoted from "the algorithm" to "one algorithm in the family."

This is the algorithmic side of the [Reward Modelling at Scale](/blog/2026/reward-modelling-at-scale/) pillar: the optimiser that sits on top of the reward model and either stays out of its way or makes its job impossible. GRPO is one of my day-job specialisations at the Alexa+ Frontier AI Modelling Lab; this is the deep-dive I'd point ML engineers at when they ask why everyone left PPO behind.

## Why PPO is structurally awkward for LLMs

PPO was designed for continuous control, where state is a pose vector, action is a torque, and a value function $V_\phi(s)$ approximating expected return is a reasonable supervised regression problem. It came over to LLMs more or less verbatim, and the awkwardness shows up in three places anyone who has babysat an RLHF run will recognise.

First, the four-model setup: policy $\pi_\theta$, frozen reference $\pi_{\text{ref}}$ for KL, frozen reward model $r_\phi$, and a learned value model $V_\psi$. For a 7B policy that is roughly 28B parameters plus optimiser states; for a 70B policy you need multiple nodes just to fit the training loop. The value head is the single biggest reason RLHF clusters look the way they do.

Second, the value function is genuinely hard to train. It has to estimate expected reward for a partial token sequence, where the reward arrives at the end and is itself the output of a learned reward model. The supervision is sparse, delayed, non-stationary. An inaccurate $V_\psi$ produces noisy advantages, noisy advantages produce a noisy gradient, and the policy update is what is supposed to be making the value targets converge. It is held together by hyperparameter tuning and faith.

Third, what the value function is actually doing. PPO's per-token advantage uses GAE,

$$\hat{A}_t = \sum_{l=0}^{T-t} (\gamma\lambda)^l \delta_{t+l}, \qquad \delta_t = r_t + \gamma V(s_{t+1}) - V(s_t),$$

inside the clipped surrogate

$$\mathcal{L}^{\text{CLIP}}_t = \min\!\left(\rho_t \hat{A}_t,\; \text{clip}(\rho_t, 1-\epsilon, 1+\epsilon) \hat{A}_t\right).$$

But for an LLM with one reward at the end, GAE collapses. With $\gamma = 1$ (which everyone uses, because discounting tokens has no semantic meaning), the advantage at every token is essentially the final reward minus the value baseline. The value function is doing nothing more sophisticated than approximating a prompt-level baseline, and a 7B-parameter network is a remarkably expensive way to compute one number per prompt. If that is the whole job, there is a cheaper way.

## The group-relative idea

The trick is embarrassingly simple. Instead of training a network to estimate expected reward for a prompt, sample a group of completions for that prompt, score them, and use the empirical group statistics as the baseline.

This is a textbook variance-reduction move. The policy gradient with a baseline is

$$\nabla_\theta J(\theta) = \mathbb{E}\!\left[(R - b) \nabla_\theta \log \pi_\theta(y \mid x)\right],$$

and any baseline $b$ that does not depend on the action $y$ leaves the gradient unbiased. Variance is minimised when $b$ is close to $\mathbb{E}[R \mid x]$. PPO's value function is one estimator. The leave-one-out group mean is another: model-free, unbiased by construction, with the same favourable variance properties as $G$ grows.

The cost trade: generating $G$ completions per prompt is $G\times$ the generation cost of single-sample PPO, but you save the entire value network: weights, optimiser states, loss term, hyperparameters, failure modes. The saved compute can be spent on more generation, which is exactly what the new estimator wants. With modern inference engines (vLLM, SGLang, paged attention, continuous batching), batched group generation is cheap enough that the trade is dominantly favourable.

What also changes is what gets rewarded. The advantage now answers a sharper question than "is this better than my value function predicted?"; it answers "is this better than the other things I would have generated for the same prompt?" That is far more useful for tasks where reward is prompt-dependent. Some prompts are trivial (everyone gets reward 1), some are impossible (everyone gets reward 0). The group-relative baseline normalises out prompt difficulty automatically.

## GRPO mechanics

GRPO is the cleanest realisation of this idea, and it is the formulation DeepSeek used to train R1. For each prompt $x$, sample $G$ completions $\{y_1, \ldots, y_G\}$ from $\pi_\theta$, score them to obtain $\{r_1, \ldots, r_G\}$, and compute the z-score advantage

$$\hat{A}_i = \frac{r_i - \text{mean}(\{r_1, \ldots, r_G\})}{\text{std}(\{r_1, \ldots, r_G\})}.$$

That's the entire baseline. No value function, no GAE, no critic learning rate. The numerator centres rewards around the prompt-level mean; the denominator scales by the group's spread. When $\text{std} = 0$ the advantages are masked, which is exactly right because there is no signal to extract from a uniformly-scored group.

The policy update keeps the PPO clipped surrogate, since clipping's variance-control story is independent of where the advantage came from:

$$\mathcal{L}_{\text{GRPO}} = -\frac{1}{G}\sum_{i=1}^{G} \min\!\left(\rho_i \hat{A}_i,\; \text{clip}(\rho_i, 1-\epsilon, 1+\epsilon)\hat{A}_i\right) + \beta \cdot D_{\text{KL}}(\pi_\theta \,\|\, \pi_{\text{ref}})$$

where $\rho_i = \pi_\theta(y_i \mid x) / \pi_{\text{old}}(y_i \mid x)$ and the KL term stops the policy drifting into the reward model's blind spots.

What this expression _doesn't_ contain is per-token advantage. Every token in $y_i$ gets the same scalar $\hat{A}_i$, a coarser credit-assignment scheme than PPO's GAE. For verifiable reasoning with sparse outcome rewards, this is a feature: the reward only arrives at the end of the sequence anyway. PPO's per-token advantages were mostly an artefact of the value-function machinery, not information you actually had. Sequence-level credit assignment is being honest about what the reward function is telling you.

The mechanical details that matter: $G = 16$ is the standard default, with $G = 32$ or $G = 64$ for binary-reward tasks where you need a mix of correct and incorrect solutions before std-normalisation gives useful signal. Smaller groups make the std estimate noisy. $\beta$ starts at 0.01–0.04: raise it if KL climbs past 10–15 nats, drop it if the policy is barely moving. Clip $\epsilon = 0.2$. One or two epochs per generation batch. The hyperparameter that cuts hardest in production is $G$: generation is the bottleneck and $G$ multiplies it. The compute you would have spent training a value network is the compute you now spend generating more samples per prompt.

## GSPO, RLOO, and the family

GRPO is one point in a family, and the differences are illuminating once you see the shared skeleton.

**RLOO** (REINFORCE Leave-One-Out, Ahmadian et al., 2024) is the closest cousin and the most theoretically clean. Instead of the group mean, it uses a leave-one-out baseline:

$$b_i = \frac{1}{G-1}\sum_{j \neq i} r_j, \qquad A_i = r_i - b_i.$$

This is provably unbiased: $b_i$ is independent of $y_i$, so the gradient direction is correct in expectation. GRPO's all-sample mean introduces a small $O(1/G)$ bias, negligible at $G = 16$ but not at $G = 4$. RLOO also drops PPO-style clipping and std-normalisation, recovering plain REINFORCE with a strong baseline. Without clipping, multi-epoch updates are riskier, so most RLOO implementations stick to a single epoch. The trade: GRPO accepts a slightly biased baseline for std-normalisation and multi-epoch stability; RLOO accepts higher variance for an unbiased baseline and a simpler estimator. Both work.

**GSPO** (Group Sequence Policy Optimization, Qwen, 2025) keeps GRPO's group-relative advantage and asks a different question: if the advantage is sequence-level, why is the importance ratio per-token? GSPO replaces GRPO's token-level ratios with a single length-normalised sequence-level ratio,

$$s_i(\theta) = \left(\frac{\pi_\theta(y_i \mid x)}{\pi_{\theta_{\text{old}}}(y_i \mid x)}\right)^{1/|y_i|},$$

and clips that instead. The argument is that per-token ratios multiplied by a sequence-level advantage inject noise that accumulates over long completions, and clipping token-by-token means different fractions of each sequence get silently dropped from the gradient. Matching the unit of clipping to the unit of reward removes both problems. Qwen reports it is noticeably more stable for long-completion and MoE training, with comparable or better results on reasoning benchmarks. The implementation is also simpler, because the per-token ratio bookkeeping disappears.

The pattern is the same across the family: sample a group, score the group, use the group statistics as the baseline. The variants differ in how much PPO machinery they keep around that core: RLOO strips it out, GRPO keeps token-level clipping, GSPO lifts the clipping to sequence level. The group-relative trick is doing the heavy lifting either way.

## What GRPO actually buys you in production

The headline argument is four-models-becomes-three. That matters as policies grow. But the more subtle wins change how an RL run behaves day-to-day.

**Debuggability.** PPO has a value-function loss curve, a policy-loss curve, a clip-fraction, a KL trajectory, an explained-variance for $V_\psi$, and roughly a dozen interaction effects between them. When training goes sideways, "was it the policy or the value function?" is almost never answerable in real time. GRPO has a single loss, a clip-fraction, a KL trajectory, and per-group reward statistics. Stare at the group reward distributions and you can usually see what is happening.

**Verifiable-reward compatibility.** GRPO's strongest empirical results (DeepSeek-R1, Qwen2.5-Math, the open-source maths and code reasoning models) all use binary or rule-based rewards. "Did the final answer match?" "Did the code pass the tests?" Sparse, discrete, free of the calibration problems a learned reward model has. The group-relative baseline tolerates them gracefully; PPO with sparse rewards is harder, because the value function struggles to fit a near-zero target with occasional spikes.

**Synergy with the [reward modelling stack](/blog/2026/reward-modelling-at-scale/).** The optimiser sitting on top of the reward model has limited room to compensate for a bad reward model; what it _can_ do is fail gracefully when the signal is noisy. The value network in PPO concentrates and amplifies reward-model errors: it learns a smooth approximation of a noisy signal, which makes the noise harder to detect. The group-relative baseline is non-parametric and doesn't pretend to know more than the data shows. When the reward signal is bad, GRPO tells you about it directly.

For technical leaders, the strategic point is this: GRPO is what makes RL-on-reasoning operationally feasible at moderate compute budgets. The recipe that turned DeepSeek-R1 into a reasoning model was not reachable with PPO at the budget DeepSeek had. Dropping from four models to three changes which teams can afford to run RL at all, and a GRPO run is simple enough to tune within a sprint rather than a quarter, which compresses the loop between reward-modelling improvements and policy improvements. In a domain where the reward model is the ceiling, the optimiser that lets you iterate faster on the reward model is the optimiser that wins.

## The failure modes

GRPO is not magic. Its failure modes are different enough from PPO's that migrating teams need to recalibrate.

**Zero-variance groups.** When all $G$ completions get the same reward, $\text{std} = 0$ and advantages collapse to zero (or NaN). Common with binary rewards on trivially easy or impossibly hard prompts. Filter these at data-loading or floor-clamp the std. Without this, you silently lose the prompts at the extremes of difficulty.

**Curriculum sensitivity.** Because the method depends on intra-group variance, prompt difficulty matters more than in PPO. Too-easy batches produce all-correct groups; too-hard batches produce all-incorrect ones. Either way, no learning. Teams that get the most out of GRPO run an explicit curriculum loop: re-rank prompts by current pass-rate, oversample the 30–70% band, evolve as the policy improves.

**Reward hacking, but moved.** The optimiser that finds reward-model exploits in PPO finds them in GRPO too; both are policy gradient with a KL constraint. With a learned value function smoothing the signal, PPO-trained policies often hack gradually. With GRPO and rule-based rewards, hacking tends to be sharper and more visible: the policy discovers a degenerate output that scores 1 and over-represents it. Preferable for monitoring, but it still requires the operational discipline I described in the [reward modelling pillar](/blog/2026/reward-modelling-at-scale/) and the [reward hacking deep-dive](/blog/2026/reward-hacking/).

**Sequence-length artefacts.** GRPO's per-completion advantage applies the same scalar to every token. If completions have very different lengths, the longer ones accumulate more total log-prob gradient for the same advantage, biasing the optimiser toward whichever length was rewarded. Length-normalise the log-probability or the advantage, or apply a reward-side length penalty. Monitor mean response length.

**KL accounting.** The unbiased k3 estimator is more numerically stable at small KL values than the naïve per-token form, and it is what most production GRPO implementations now use. The choice changes the effective $\beta$ by a small but non-trivial factor, and several public reproductions have hit instability traceable to using a different estimator than the paper.

## How to use it

These are the defaults I hand to teams starting out, roughly in the order the decisions come up.

1. **Start with a verifiable reward.** GRPO's strongest setting is sparse, rule-based rewards on maths or code. Get the verifier working, then check that $G = 16$ to $32$ produces a mix of correct and incorrect solutions. If it doesn't, your prompts are mis-targeted for the policy's current capability.
2. **Warm-start from a strong SFT checkpoint.** The initial generation distribution sets the ceiling on what the group-relative baseline can do. A weak SFT model produces low-variance groups and GRPO has nothing to learn from.
3. **Group size $G = 16$ as default.** Drop to 8 if generation cost dominates; raise to 32 or 64 for binary-reward tasks. Baseline quality is monotonic in $G$; when in doubt, go larger.
4. **Build the prompt curriculum from the start.** The single biggest gap between teams that get GRPO working and teams that don't.
5. **Use the k3 KL estimator.** $\beta = 0.01$–$0.04$, adapt based on the KL trajectory.
6. **Standard PPO clip $\epsilon = 0.2$, one or two epochs per batch.**
7. **Plan the reward-hacking monitoring loop on day one.** Fresh on-policy human spot-checks, KL budget tracking, length-normalisation. The defences are the same in GRPO as in PPO; GRPO is cheap enough that you have less excuse not to monitor.
8. **If long completions or MoE training destabilise GRPO, try GSPO.** Sequence-level clipping is simpler to implement than per-token ratio bookkeeping and performs comparably on reasoning tasks; it is a drop-in swap, not a re-architecture.

Get the first four right and the rest is tuning.

## The bigger shift

GRPO and the group-relative family are the algorithmic substrate of the new RL-on-reasoning era. They are why the reasoning-model wave was an open-source story rather than a closed-frontier one: DeepSeek-R1 was reproducible at moderate budgets _because_ GRPO is cheap enough to fit in moderate budgets. They are the optimiser side of the same problem the [reward modelling pillar](/blog/2026/reward-modelling-at-scale/) addresses from the reward side: making preference learning at scale operationally tractable.

The next thing to come out of this family is trajectory-level RL for agents: multi-step interaction groups where the "completion" being scored is a tool-using rollout rather than a flat text response. That is the topic of the [agentic RL deep-dive](/blog/2026/agentic-rl/), and it is where the group-relative trick really earns its keep, because the alternative (training a per-step value function for arbitrary tool-call trajectories) is even worse than training one for plain LLM responses.

PPO was an algorithm built for a different problem, dragged into LLM training because nothing better existed. Group-relative methods are the first family of RL algorithms designed with the actual structure of LLM rewards in mind: sparse, sequence-level, prompt-conditioned, and cheap to characterise empirically once you commit to multi-sample generation. The shift from PPO to GRPO is not just an efficiency win; it is the field finally finding an optimiser that fits the problem.

The short version: stop training value functions for LLM RL. Sample groups, normalise within them, let the empirical baseline do the work. The maths is simpler, the implementation is shorter, and the failure modes are the ones you can actually see.

_This post reflects my personal views and experience. It does not represent official Amazon positions._
