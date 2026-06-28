// data/contextChunks.ts
// These chunks are ingested into pgvector for the RAG pipeline
// Run `npm run db:seed` to embed and store them

export const knowledgeChunks = [
  // ─── BIO ──────────────────────────────────────────────────────────────────
  {
    source: "bio",
    content: `Emmanuel Ariyo, known online as Ememzyvisuals, is a Creative Software Developer and AI Systems Engineer based in Nigeria. He specializes in building scalable web applications, AI-powered systems, and automation tools that solve real-world problems. Emmanuel is the CEO of Ememzyvisuals Digitals.`,
  },
  {
    source: "bio",
    content: `Emmanuel's engineering philosophy centers on building systems that actually work in the real world — offline-first, network-resilient, AI-augmented, and production-ready. He doesn't just build MVPs; he builds platforms. His work spans from consumer apps serving Nigerian students to AI benchmarking research published on Kaggle.`,
  },
  {
    source: "bio",
    content: `Emmanuel is available for freelance contracts, full-time roles, and collaborations. He can be reached at contact@ememzyvisuals.com. His GitHub is @ememzyvisuals, his X/Twitter is @ememzyvisuals, and his Kaggle profile is @ememzyvisuals.`,
  },

  // ─── PROJECTS ─────────────────────────────────────────────────────────────
  {
    source: "project",
    content: `ClaudGPT is a production-grade multi-agent AI development platform built by Emmanuel Ariyo. It features 9 specialized AI agents that collaborate across planning, architecture, coding, debugging, and review stages to deliver finished, exportable full-stack applications from natural language prompts. Tech: Next.js 14, TypeScript, Groq API, Supabase PostgreSQL with RLS, Docker, SSE streaming. Live at claudgpt.vercel.app.`,
  },
  {
    source: "project",
    content: `AethLife is an intelligent 4-in-1 personal life operating system built by Emmanuel. It connects workouts, spending, habits, and energy levels using AI to analyze cross-domain correlations. Built with Next.js 15, Supabase, Groq Vision, LLaMA 70B, Firebase Cloud Messaging, and offline PWA support. Live at aethlife.vercel.app. Featured project.`,
  },
  {
    source: "project",
    content: `FlonexTV is a modern streaming and learning platform built by Emmanuel. It offers movies, series, educational shorts, and a full Academy with AI-powered task review, exam submissions, and certificate generation. Built with Next.js, TypeScript, Tailwind CSS, and TMDB API. Live at flonextv.vercel.app. Featured project.`,
  },
  {
    source: "project",
    content: `NaijaPrep is an offline-first PWA built by Emmanuel to help Nigerian students prepare for JAMB, WAEC, and NECO examinations. It works fully without internet using Service Workers and IndexedDB. Built with React, TypeScript, Vite, Tailwind CSS. Live at naijaprep.netlify.app.`,
  },
  {
    source: "project",
    content: `StudentHub NG is a comprehensive online exam preparation platform for Nigerian students built by Emmanuel. Features interactive mock exams, progress analytics, streak tracking, and community tools for JAMB, WAEC, and NECO prep. Built with React, TypeScript, Vite, Tailwind CSS. Live at studenthub-ng.vercel.app.`,
  },
  {
    source: "project",
    content: `NairaNest is a high-fidelity fintech simulation platform built by Emmanuel that replicates core digital banking processes — account management, transfers, bill payments, and real-time transaction monitoring. Built with React, Firebase, Tailwind CSS, Docker. Live at nairanest.netlify.app.`,
  },
  {
    source: "project",
    content: `StoreJet is a no-code mini online store builder built by Emmanuel for Nigerian small businesses and vendors. Creates professional product catalogs with direct WhatsApp order integration in under 60 seconds. Built with React, Tailwind CSS, Firebase. Live at storejet-ng.netlify.app.`,
  },
  {
    source: "project",
    content: `A.R. Toluwani Store is a complete e-commerce platform built by Emmanuel for home appliances and kitchen essentials, featuring promotions, categories, cart management, and local delivery. Built with React, Tailwind CSS. Live at ar-toluwani-store.netlify.app.`,
  },

  // ─── AUTOMATION ───────────────────────────────────────────────────────────
  {
    source: "automation",
    content: `Lumeo AI is a production-ready AI-powered Telegram bot built by Emmanuel. It's a full-featured personal assistant with image generation, media downloads, voice notes, PDF creation, group management, a Mini App with games, and a Telegram Stars payment system. Built with Python, python-telegram-bot, Groq API, and Docker sandboxing. Live at t.me/lumeoai_bot.`,
  },
  {
    source: "automation",
    content: `Microdragon is a powerful local-first CLI AI agent built by Emmanuel and published on npm as @ememzyvisuals/microdragon. It's a Distributed Intelligence Network that executes complex real-world tasks from natural language commands. Features: Dragon Harness 7-layer model amplification, 9-Phase Execution Pipeline, Hierarchical Agent Council. Built with Rust, Python, Node.js, Ollama, Playwright. GitHub: github.com/Ememzyvisuals/microdragon.`,
  },

  // ─── BENCHMARK ────────────────────────────────────────────────────────────
  {
    source: "benchmark",
    content: `TruthGuard is a 120-question confidence calibration benchmark created by Emmanuel Ariyo, designed to evaluate the metacognitive abilities of Large Language Models. It measures how accurately models align their stated confidence levels with their actual correctness, exposing metacognitive overconfidence. Published on Kaggle at kaggle.com/code/ememzyvisuals/truthguard-benchmark-metacognition-evaluation. The dataset is also public. This is Emmanuel's primary AI safety and alignment research contribution.`,
  },

  // ─── STACK ────────────────────────────────────────────────────────────────
  {
    source: "stack",
    content: `Emmanuel's frontend stack: Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion, shadcn/ui, Radix UI, Zustand, React Hook Form, Zod, Vite. He builds pixel-perfect, responsive UIs with strong attention to accessibility and performance.`,
  },
  {
    source: "stack",
    content: `Emmanuel's backend stack: Node.js, Express.js, Supabase PostgreSQL, Prisma ORM, Firebase (Firestore, Auth, Cloud Messaging), Resend, NextAuth.js, Docker, docker-compose, Server-Sent Events (SSE), REST APIs.`,
  },
  {
    source: "stack",
    content: `Emmanuel's AI and ML stack: Groq API, LLaMA 70B, Mixtral, Groq Vision, Ollama (local models), pgvector (vector search), RAG pipelines, prompt engineering, LLM evaluation and benchmarking. He builds production-ready AI systems, not just chatbots.`,
  },
  {
    source: "stack",
    content: `Emmanuel's automation stack: Python, python-telegram-bot, Playwright, Rust, Node.js CLI tools, agentic orchestration systems. He builds multi-step autonomous agents with real-world execution capabilities.`,
  },
  {
    source: "stack",
    content: `Emmanuel's DevOps and deployment stack: Vercel, Netlify, Render, Docker, docker-compose, GitHub Actions, Neon (serverless Postgres), pgvector, multi-key API rotation and failover. He deploys and maintains production systems.`,
  },

  // ─── PHILOSOPHY ───────────────────────────────────────────────────────────
  {
    source: "philosophy",
    content: `Emmanuel's engineering philosophy: "Build systems that work for people who don't have perfect conditions — no stable internet, low-end devices, limited data." This drives his offline-first approach (NaijaPrep) and his focus on Nigerian market needs. He believes in measurable results over impressive demos.`,
  },
  {
    source: "philosophy",
    content: `Emmanuel believes AI should be honest and self-aware. This drove him to create TruthGuard — a benchmark that exposes LLM overconfidence. He contributes to AI safety through practical tools the community can use and build upon.`,
  },

  // ─── AXIVERI ──────────────────────────────────────────────────────────────
  {
    source: "axiveri",
    content: `Emmanuel Ariyo is the founder of Axiveri — an African AI research initiative. Axiveri builds open-source language models for African contexts. The Axiveri HuggingFace organization is at huggingface.co/Axiveri.`,
  },
  {
    source: "axiveri",
    content: `Africlaude is a series of open-source language models developed by Axiveri, founded by Emmanuel Ariyo. Africlaude-7B is the first model in the series — a 7-billion parameter open-source language model freely available on HuggingFace at huggingface.co/Axiveri/Africlaude-7B. More models (13B, 70B) are in development.`,
  },
  {
    source: "axiveri",
    content: `Axiveri's mission is to build AI that understands African languages, African contexts, and African problems. All models are published open-source. Researchers, developers, and businesses can download, fine-tune, and deploy Africlaude models freely. Support Axiveri via crypto or partnership at ememzyvisuals.vercel.app/axiveri.`,
  },
  {
    source: "axiveri",
    content: `NaijaVox is a Nigerian speech recognition (ASR) model series by Axiveri, founded by Emmanuel Ariyo. NaijaVox-V1 is live on HuggingFace at huggingface.co/Axiveri/Naijavox-V1. It supports Yoruba, Hausa, Igbo, Nigerian Pidgin Creole, and Nigerian Accented English.`,
  },
];
