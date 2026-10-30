---
title: "I'm Fine-Tuning an AI Model Specifically for African Developers. Here's Why."
slug: fine-tuning-ai
date: 2026-05-29
excerpt: "Every major AI assistant was trained on data that does not reflect how African developers build software. So I am building one that does."
topic: AI models
tags: [africlaude, fine-tuning, fintech, axiveri]
cover: /blog/fine-tuning-ai-photo.webp
---

*This post is from May 2026 and describes the early training cycles of Africlaude. The model is now published under Axiveri: https://huggingface.co/Axiveri/Africlaude-7B*

Every major AI assistant was trained on data that reflects how developers in the US and Europe build software.

Ask GPT-4 about Paystack's webhook signature verification. Ask Claude about kobo-to-naira conversion bugs. Ask Gemini about CBN compliance requirements for a Nigerian fintech backend.

You will get answers. They won't be good ones.

That gap is what I am building to close.

## What Africlaude is

Africlaude-7B-QLoRA is a continuously fine-tuned AI assistant built for African developers, under Axiveri.

The base model is Qwen2.5-Coder-7B-Instruct. On top of it I run QLoRA fine-tuning with Unsloth on Kaggle's T4 GPU. I train it on Nigerian fintech patterns, USSD engineering, Paystack and Flutterwave integrations, CBN compliance, security engineering and Nigerian Pidgin.

## Why it needs to exist

The problem is not that existing models are bad. They are excellent for the problems they were trained on.

Nigerian fintech has patterns that don't appear in Western training data. Paystack stores amounts in kobo, not naira. Multiplying or dividing by 100 in the wrong place is one of the most common bugs in Nigerian payment integrations. A model that has not seen this pattern will give you confident, wrong answers.

CBN compliance has specific requirements that are not in any American or European regulatory dataset. USSD flow engineering has its own constraints, like the 182-character limit and session state, that no general model handles well.

Beyond fintech, there is a language gap. Nigerian developers think in Pidgin. They write comments in it and talk to each other in it. An AI assistant that doesn't understand Pidgin is a foreign tool, not a collaborator.

Africlaude is being built to be the collaborator.

## How I am training it

I run multi-cycle progressive fine-tuning. Each cycle builds on the last. The model is trained, evaluated across every category, and improved before the next cycle starts.

After 7 training cycles, this is where it stood:

| Category | Score | Status |
|---|---|---|
| Pidgin understanding | 1.000 | locked in |
| Security engineering | 1.000 | solid |
| Systems programming | 1.000 | solid |
| SQL | 0.922 | strong |
| Fintech | 0.700 | still improving |
| Reasoning | 0.343 | active work |

The fintech score is held back by one specific failure: the kobo and naira conversion bug. The model knows it is a currency issue, but it doesn't yet consistently name it as a kobo conversion error. That is the kind of precision you have to drill on purpose.

## The disasters

Cycle 5 was a lesson I won't repeat.

I called `merge_and_unload()` on a 4-bit quantised model, and the model collapsed completely. Every category went red. Weeks of training, gone.

I recovered from the Cycle 4 adapter and rebuilt from there. The lesson was clear: in QLoRA fine-tuning, the adapter and the base model are separate for a reason. You don't merge them in 4-bit. The rules of low-rank adaptation are not suggestions.

Cycle 7 had a different problem. NB2, my second notebook in each cycle, loaded the wrong adapter. It pulled the Cycle 6 adapter from Hugging Face instead of the freshly trained Cycle 7 output from NB1. The notebooks didn't chain correctly. Cycle 8 fixes this.

I use a two-notebook system to work around Kaggle's 12-hour GPU limit. NB1 runs the heavy training and NB2 runs specialisation on top of it. Without that system I would hit the time limit mid-training with no clean checkpoint.

## The Lumeo connection

I run Lumeo AI, a WhatsApp bot built on Node.js, Baileys and Groq, which handles real developer questions in production.

Those conversations are valuable training data. Lumeo has produced 72 high-quality training records from real patterns: security engineering questions, fintech backend debugging, real problems from real developers. That data feeds directly into Africlaude's training as `lumeo-training-data` on Kaggle.

A production AI assistant producing training data for a better AI assistant. That loop is intentional.

## Where it is going

Africlaude-7B is the foundation. The roadmap goes to 14B.

I have $100 of AMD Developer Cloud credit for an MI300X, which has 192GB of VRAM compared with the T4's 15.6GB. That is not a small upgrade. At 14B parameters I can use higher LoRA ranks, longer sequences and larger batches. A training cycle that takes 15 hours on a T4 should take around 2 hours on the MI300X.

The 14B roadmap has four phases:

1. Foundation training that carries over the 7B curriculum.
2. Specialisation in fraud intelligence and CBN compliance.
3. Agentic ability, with direct Paystack and Flutterwave API function calling.
4. Production hardening, with red-team identity testing and a Nigerian enterprise benchmark against GPT-4, Claude and Gemini.

The benchmark matters. There is no point building something you can't measure.

## What this is really about

There are over 700,000 developers in Nigeria alone, and millions across the continent. They build real products on real infrastructure with real constraints that no existing model was trained to understand.

Africlaude is being built for them.

Not a wrapper. Not a prompt template. A model that has seen the patterns, understands the context and gives answers that reflect how software is actually built in Africa.

That is the goal.
