---
title: "I Built TruthGuard: A Benchmark That Exposes When AI Lies With Confidence"
slug: truthguard
date: 2026-05-26
excerpt: "Most AI models don't just get things wrong. They get things wrong while sounding completely sure. TruthGuard measures exactly that."
tags: [ai-safety, benchmark, research, kaggle]
cover: /blog/truthguard.webp
---

There is a problem with AI that gets too little attention.

It is not that AI gets things wrong. Every system does. The real problem is that AI gets things wrong while sounding completely certain. No hesitation. No "I'm not sure about this." Just a confident, fluent, wrong answer.

I wanted to measure that, so I built TruthGuard.

## What is TruthGuard?

TruthGuard is a 120-question confidence calibration benchmark I designed to test the metacognition of large language models.

In plain English, it tests whether an AI knows what it knows.

A well-calibrated model should say "I'm 90% confident" only when it is right 90% of the time. When a model says it is 95% confident on questions it gets wrong 40% of the time, that is metacognitive overconfidence. That is what TruthGuard looks for.

## Why I built it

I was using several frontier models on a project and noticed something unsettling. The models that gave the most confident answers were not always the most accurate. Sometimes it was the opposite.

That is dangerous. If you build a product on top of a model, you need to know more than whether it can answer correctly. You need to know whether it knows when it can't.

I could not find a benchmark built to measure this at the metacognition level, so I made one.

## How it works

The benchmark has 120 questions in three difficulty tiers:

- **Easy:** straightforward questions where a capable model should score well and know it.
- **Tricky:** questions designed to expose surface-level pattern matching.
- **Hard/Trap:** adversarial questions that look simple but contain a subtle catch.

For each question the model must give an answer and a confidence score from 0 to 100%. TruthGuard then measures:

- **Calibration error:** how far the stated confidence is from the actual accuracy.
- **Overconfidence rate:** how often the model claims high confidence on wrong answers.
- **Confidence-accuracy correlation:** whether confidence actually predicts correctness.

## What I found

Models consistently overestimated their accuracy on the Tricky and Trap tiers, sometimes by 20 to 30 percentage points. Easy questions showed reasonable calibration. The harder the question, the worse the calibration got.

The pattern: AI models are most overconfident exactly when they should be most uncertain.

## Why this matters

If you are building anything serious with AI, such as a medical tool, a legal assistant or a research platform, you need to know how the model behaves when it is wrong. Does it signal uncertainty? Does it hold back? Or does it carry on in the same confident tone whether it is right or not?

TruthGuard gives you a way to measure that.

## Try it yourself

The benchmark notebook and the dataset are public on Kaggle:

- Notebook: https://www.kaggle.com/code/ememzyvisuals/truthguard-benchmark-metacognition-evaluation
- Dataset: https://www.kaggle.com/datasets/ememzyvisuals/truthguard-benchmark-metacognition

Both are free to use under CC BY-SA 4.0. If you are an AI researcher or developer, run your model against it and see how it scores.

## What is next

TruthGuard v1 is the start. I am working on expanding the question set, adding domain tiers for medicine, law and code, and building a standard evaluation pipeline that any developer can run against any model.

If you find it useful or want to collaborate, email me at ememzyvisuals@gmail.com.
