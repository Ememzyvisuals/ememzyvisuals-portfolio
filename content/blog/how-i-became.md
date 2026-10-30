---
title: "How I Became an AI/ML Engineer in Nigeria: My Real Roadmap, Failures and What Actually Worked"
slug: how-i-became
date: 2026-07-23
excerpt: "From web development to shipping open Nigerian language models and landing a real AI role. The honest technical journey, with practical lessons."
tags: [career, machine-learning, nigeria, axiveri]
cover: /blog/how-i-became.webp
---

*Written in July 2026. Since August I work as a Machine Learning Engineer at PlotWeaver, building multilingual speech AI for Nigerian languages.*

The journey was never linear. There were nights I stared at failing training runs wondering if I was wasting my time. There were moments I wanted to quit and go back to regular web development. What kept me going was one belief: we can build AI that understands Nigerians in our own voice and context.

In July I started as the Machine Learning and AI Engineer at a fast-growing Nigerian social super-app. This is the technical story of how that happened.

## My background

I am Emmanuel Ariyo, known online as Ememzyvisuals and founder of Axiveri. For years I focused on web development. I built NaijaPrep for exam preparation, StoreJet for small businesses, automation bots and more.

I enjoyed shipping web products, but I wanted deeper impact. I wanted to build AI that can understand and generate Nigerian languages naturally, especially Pidgin with its constant code-switching.

## The learning phase: courses versus real systems

I started with Udemy courses on machine learning, deep learning and PyTorch. They gave me solid foundations in data handling, model architecture, training loops and evaluation metrics.

Courses alone were not enough. The real growth came when I started building production systems and learning from failures in the wild.

I spent countless evenings and weekends fine-tuning open models, curating datasets, building pipelines and testing them hard on Nigerian speech data.

## Key releases from Axiveri

At Axiveri we have released open models and datasets that other people can build on.

**NaijaVox-2.0** is an open multilingual speech recognition model for Nigerian languages. It is built on Whisper-large-v3 with LoRA fine-tuning, SpecAugment and realistic noise augmentation. Pidgin reaches roughly 85% accuracy, with strong handling of code-switching.
Link: https://huggingface.co/Axiveri/NaijaVox-2.0

**Africlaude-7B** is a 7 billion parameter language model tuned for African developers and fintech use cases. It understands Nigerian Pidgin, USSD flows, payment integrations and CBN compliance contexts. It topped our own AfriclaudeBench evaluation.
Link: https://huggingface.co/Axiveri/Africlaude-7B

**Wazobia-TTS-CC** is our open dataset and related text-to-speech work for natural, culturally accurate voices in major Nigerian languages. It is one piece of a full speech-to-speech pipeline.

All of these are open under permissive licenses, so the community can build on them.

## Landing the role

The public work and steady sharing on X and Hugging Face led to the opportunity. After we aligned on vision with the Co-Founder and CTO, I joined as an independent ML and AI engineer.

The mandate: design and build real-time Pidgin speech-to-speech AI with authentic Nigerian voices, for a platform serving over 20,000 users. That covers user voice data pipelines, model training and fine-tuning, evaluation frameworks and production API integration.

The first payment came quickly, the contract was signed, and we started defining the working framework and milestones. The initial term is six months with clear deliverables.

## My practical roadmap: what moved the needle

This is the sequence that worked for me.

1. **Learn the fundamentals deeply.** Use structured courses to learn concepts fast, then apply them straight away.
2. **Find a painful, real problem.** Look at the gaps in your own environment. For me it was language AI that failed Nigerians in daily use.
3. **Ship small and iterate in public.** Release v1 even if it is imperfect. Learn from community feedback and fix it in v2.
4. **Test under real conditions.** Try noisy rooms, code-switching and low-resource settings. A lab model that fails in the field is not useful.
5. **Document and share.** Write detailed model cards, post your progress, upload datasets and code. Visibility creates opportunities.
6. **Stay consistent through doubt.** Progress is rarely linear. Keep small daily wins alive even when motivation is low.

## Hard truths and failures

I wasted time on approaches that did not scale. Early models overfit badly. Compute costs added up fast on a small budget. There were long stretches where I felt stuck and questioned the whole path.

The turning point was treating every failure as data. Each bad run taught me something about data quality, hyperparameters or architecture.

## Advice for aspiring AI and ML engineers in Nigeria and Africa

- Start today with whatever hardware and data you have. Kaggle, Colab and free tiers are enough to begin.
- Pick problems that matter locally. Global models rarely work well here without targeted adaptation.
- Build in public from day one. Your open work becomes your strongest portfolio.
- Share useful things. Genuine connections follow.
- Protect your energy. The road is long, so celebrate small milestones.

I am still learning every day, and this role is another chapter of that.

Future posts will go deeper into the technical side: how I curate datasets, the training tricks that worked, evaluation frameworks and what I learned from deploying to production.

Let us keep building African AI infrastructure that serves us.

Emmanuel Ariyo, Founder of Axiveri
