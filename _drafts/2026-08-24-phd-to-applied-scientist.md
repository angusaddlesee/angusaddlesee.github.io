---
layout: post
title: "Two Years In: A Letter to the PhD Student I Was"
date: 2026-08-24 10:00:00
description: An honest account of what the move from PhD to applied scientist actually requires, what compounds, what has to die, and what I wish I'd known.
tags: career personal phd-to-industry applied-science
categories: personal
toc:
  beginning: false
---

The clearest moment from the transition is not the first day at Amazon. It is a Tuesday afternoon about six weeks in, in a meeting room I'd booked for an hour to "think properly," with a notebook full of the kind of margin notes I used to be proud of. I had spent most of a week characterising a failure mode in an evaluation pipeline (building up the right ablations, drafting a write-up I was mentally formatting for an internal doc) when a colleague messaged me a five-line workaround that solved the immediate problem for the team that needed it on Friday. It was not as careful as what I was doing. It was correct enough, it was shippable, and it was going to compound velocity for half a dozen other people that week. My week of careful work was, in production terms, a hobby.

I closed the notebook and felt something I had not felt in five years: I did not actually know how to be useful at the speed this place wanted me to be useful. I had spent a PhD learning to be slow on purpose, because that's where rigour lived. Here, rigour wore different clothes and, more uncomfortably, kept a different relationship with time.

This post is the one I wish someone had handed me on that Tuesday. Not a memoir about leaving academia, and not the cynical "industry pays more" version either. Something honest about what the move actually requires.

## What the PhD actually trained me for

It is fashionable, on either side of the transition, to say the PhD doesn't prepare you for industry. That has never matched my experience. It trained me for a specific set of things, and two years in I can name them precisely.

It trained me to sit with a problem that was not yet legible. Most of what an applied scientist does on a frontier-AI team is not the stuff that has a name in a textbook yet. The first time I had to design an evaluation for a behaviour we couldn't define crisply, only point to and say "we want more of that, less of this", every instinct that fired was a PhD instinct: read the adjacent literature, find the closest formalism, run the cheapest experiment that would falsify the simplest hypothesis. Those are, almost without modification, the right reflexes.

It trained me to read papers as a working tool. Half my [day-job on reward modelling](/blog/2026/reward-modelling-at-scale/) is built on papers I read in the first month and have re-read several times since. The PhD built the muscle of reading hostile to my own opinions: looking for the assumption a result depends on, the experiment that wasn't run, the dataset that's hiding the answer. That muscle gets used harder in industry, on a tighter clock.

And it trained me to present work to people who actively want to break it. Every conference Q&A where someone went straight to the weakest part of the argument was rehearsal for design reviews doing precisely the same thing for precisely the same reason. The student who learns to defend the work without taking it personally, and to update visibly when they're wrong, walks into industry with one of the rarer skills on offer.

## What had to die

The harder part of the transition was not what I was missing. It was what I had to actively unlearn.

The first was research-grade thoroughness on the wrong things. In a PhD, the marginal hour spent on completeness pays; the work has to survive a viva, and every loose end gets pulled by a stranger. In industry, that hour usually doesn't pay. The right number of ablations is the number that lets the team decide; the right number of decimal places on a metric is the number above which nobody changes their mind. The fluency I had to develop was knowing, before starting a piece of work, what level of evidence would change the next decision, and stopping there. Rigour didn't stop mattering; it had to be re-pointed at the decision rather than at the page.

The second was the single-author identity. The PhD is structurally a piece of work with your name first, and you're trained to optimise for being the person whose contribution is legible. In a frontier modelling team, your contribution is a load-bearing wall in a building several others are also holding up. The first six months I caught myself choosing a more elegant version of a piece of work because it was more clearly _mine_, when the less elegant version would have plugged in to what someone else was building and saved the team a fortnight. That instinct is honest (academia rewards it) but it had to die. What compounds inside an industrial team is work that takes the load off the next person, not work that has your initials carved into it.

The third was perfectionism about communication. PhD writing rewards a sentence that survives ten years of citation; industry writing rewards a paragraph that survives until Friday. The first time a senior colleague gently told me a doc would have been more useful two days earlier and one third as polished, I felt the wound in a way that's only fair to admit publicly because it was pure ego. It needed to be a decision-quality artefact, available now, not a paper.

## What I kept that compounds

What I kept is, oddly, less negotiable than what I gave up. The unlearning was situational; the keeping was structural.

The first was rigour about evaluation. The single largest predictor of whether a piece of applied-AI work will land, in my experience, is whether the team built the evaluation before they built the thing. Every time I have skipped that step in industry (usually because the deadline was real and the evaluation felt like a luxury) I have paid for it later, with interest. The habit of asking "how would I know this is wrong?" before "is this right?" is the most portable skill I came in with, and it's the one underneath the [routing and evaluation work](/blog/2025/speech-llm-integration/) the PhD turned out, in retrospect, to have been preparing me for.

The second was reading the original paper. Not the blog post about the paper, not the tweet thread, the paper. Industry incentives push hard against this (there is always something on fire, the summary "is enough for now") and the people I most respect on my team are the ones who quietly refuse to take the summary. They read the original. They find the assumption. They are right about things first.

The third was intellectual honesty about my own results. The PhD beats out of you, if you let it, the urge to round numbers in the direction of the conclusion you wanted. I have been in industry rooms where the right thing to do, when the metric did not move, was to say "the metric did not move" and walk people through what we'd actually learned. I learned that in front of a panel that would not let me get away with anything else.

The fourth, and I'm including it even though it sounds twee, was caring about the user the system is for. My PhD was on conversational AI for people with dementia, which meant I sat in a hospital memory clinic and watched what happens when a system optimised on average users meets the people the average doesn't describe. That is not a sentimental lesson; it's a quantitative one about the variance of the user distribution and what your system owes the tail.

## What I wish I'd known

A few things I'd say to the version of me on that Tuesday afternoon.

The transition stops being abstract the moment one ugly, concrete, somebody-needs-this-by-Friday problem is in front of you. The temptation is to pick something theoretically elegant and close to your PhD work. The better choice is the thing that makes the team faster. The PhD instincts redirect themselves on their own; they don't need to be coddled with a familiar topic.

The work I'm proudest of from the last two years is not the cleverest. It is the work that took the largest amount of friction out of the largest number of other people's weeks. The cleverness is in the choice of where to push, not in the prettiness of the push.

Writing publicly, even badly, pays in a way the PhD doesn't prepare you for. The PhD trained me to write only when the work was finished. That instinct, in industry, is a slow-motion mistake. The pieces I've written since I joined have done more for my ability to think clearly about my own work than any internal doc I've written in the same period; publicly written ideas survive a wider gauntlet, which is exactly why they sharpen faster.

And the PhD itself is best held lightly. Two years on, I still describe myself in some rooms as "ex-academic," which is a small tell. The colleagues who flourished fastest after the transition treated the doctorate as one tool in the kit (heavy, well-made, useful for a specific class of problem) rather than as the identity from which the rest of the career was a deviation. I am still working on this one.

## Why I'm glad I did it

A friend asked me recently, over coffee in Cambridge, whether I'd do it again: the doctorate, the move, the lot. The honest answer is that I would, and not for any of the reasons I'd have given on day one. Not because the PhD "prepared me for industry," which is true only in a flattened way. And not because industry is "the real world" and academia isn't; the clinic where I deployed a robot during the SPRING project was as real as any production system I've worked on since. The axis isn't real and unreal; it's what kind of compounding you want. The PhD compounds depth in one direction over five years; industry compounds breadth across a system over a quarter. Neither is more honourable than the other.

The reason I'd do it again is that I came out of the PhD with a particular set of habits (the slow read, the suspicious eye on my own results, the willingness to be wrong in public) and I came into industry with a set of problems that needed those habits applied at speed. The fit, two years on, is the bit nobody told me about. Some Tuesdays, I still book a meeting room and think properly for an hour. The notebook is thinner. The questions are sharper. The point of the hour is the same as it ever was.

If you are a PhD student reading this in August, six months from your viva and six months from a job offer you haven't fully made peace with: what's load-bearing tends to come with you whether you ask it to or not.

_This post reflects my personal views and experience. It does not represent official Amazon positions._
