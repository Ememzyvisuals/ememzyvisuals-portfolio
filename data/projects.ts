// data/projects.ts
import type { Project } from "@/types";

export const ALL_PROJECTS: Partial<Project>[] = [
  {
    slug: "claudgpt",
    title: "ClaudGPT",
    subtitle: "Multi-Agent AI Development Platform",
    description:
      "A production-grade, multi-agent AI development assistant that enables developers to build complete full-stack applications, WhatsApp bots, automation tools, and REST APIs directly from natural language prompts.",
    longDesc: `ClaudGPT is a production-grade, multi-agent AI development assistant that enables developers to build complete full-stack applications, WhatsApp bots, automation tools, and REST APIs directly from natural language prompts. It features a sophisticated pipeline of 9 specialized AI agents that collaborate across planning, architecture, coding, debugging, and review stages — delivering finished, exportable projects with live previews.

Problem Solved:
Traditional AI coding tools are limited to single-turn suggestions and require heavy manual integration. ClaudGPT automates the entire development lifecycle, dramatically reducing time from idea to production-ready code while maintaining high code quality and security standards.

Key Features:
- 9-agent pipeline: Planner, Architect, Coder, Debugger, Reviewer
- Live project preview in the browser
- Full project export with clean folder structure
- Multi-key Groq API rotation with automatic failover
- Real-time streaming via Server-Sent Events (SSE)
- Supabase Auth with Email, Google, and GitHub OAuth

Challenges Faced & Solutions:
- Agent Coordination & Hallucinations: Designed a strict sequential multi-agent pipeline with a dedicated reviewer stage and structured output schemas.
- Cost Management & Reliability: Implemented multi-Groq API key rotation with automatic failover and usage monitoring.
- Real-time Streaming & State Management: Handled complex SSE streaming while maintaining consistent project state across agents.
- Secure Exports & Live Previews: Built robust file generation, validation, and sandboxed live preview systems.`,
    category: "WEB_APP",
    status: "COMPLETED",
    featured: true,
    githubUrl: "https://github.com/Ememzyvisuals/ClaudGPT",
    liveUrl: "https://claudgpt.vercel.app",
    techStack: ["Next.js 14", "TypeScript", "Groq API", "Supabase", "Docker", "SSE", "Zustand", "Tailwind CSS"],
    isMobilePrimary: false,
    coverImage: "/images/projects/claudgpt-web.png",
    webImages: ["/images/projects/claudgpt-web.png"],
    mobileImages: [],
  },
  {
    slug: "aethlife",
    title: "AethLife",
    subtitle: "AI-Powered Life Tracking & Analytics Platform",
    description:
      "An intelligent 4-in-1 personal life operating system that connects workouts, spending, habits, and energy levels. Using AI, it analyzes cross-domain correlations to deliver actionable insights that help users optimize their overall well-being.",
    longDesc: `AethLife is an intelligent 4-in-1 personal life operating system that connects workouts, spending, habits, and energy levels. Using AI, it analyzes cross-domain correlations to deliver actionable insights that help users optimize their overall well-being.

Problem Solved:
Existing tracking apps operate in silos without meaningful insights. AethLife provides unified visibility and AI-driven correlations across life domains.

Key Features:
- Workout, spending, habit, and energy tracking in one app
- AI-powered cross-domain correlation insights
- Complex 15+ table PostgreSQL schema with Row Level Security
- Offline PWA with IndexedDB sync
- Firebase Cloud Messaging for smart notifications
- Google OAuth + email authentication

Challenges Faced & Solutions:
- Complex Database Design & RLS: Built and normalized a 15+ table schema with secure Row Level Security policies.
- Cross-Domain AI Insights: Engineered robust data aggregation pipelines and prompt engineering for meaningful correlations.
- PWA + Offline Experience: Implemented reliable service workers and local storage strategies while maintaining sync with Supabase.`,
    category: "WEB_APP",
    status: "COMPLETED",
    featured: true,
    githubUrl: "https://github.com/Ememzyvisuals/aethlife",
    liveUrl: "https://aethlife.vercel.app",
    techStack: ["Next.js 15", "TypeScript", "Supabase", "Groq Vision", "LLaMA 70B", "Firebase", "PWA", "Framer Motion"],
    isMobilePrimary: false,
    coverImage: "/images/projects/aethlife-web.png",
    webImages: ["/images/projects/aethlife-web.png"],
    mobileImages: [],
  },
  {
    slug: "flonextv",
    title: "FlonexTV",
    subtitle: "Streaming, Entertainment & Academy Platform",
    description:
      "A modern streaming and learning platform offering movies, series, educational shorts, and a full Academy section. Users can enroll in structured courses, complete lessons, take exams, submit practical tasks, get verified by instructors, and receive certificates upon successful completion.",
    longDesc: `FlonexTV is a modern streaming and learning platform offering movies, series, educational shorts, and a full Academy section. Users can enroll in structured courses, complete lessons, take exams, submit practical tasks, get verified by instructors, and receive certificates upon successful completion.

Problem Solved:
Users need a single platform that combines high-quality entertainment with structured, verifiable learning and certification pathways.

Key Features:
- Full streaming platform with movies and series via TMDB integration
- Academy section with structured courses and lessons
- AI-powered practical task review and feedback
- Exam submission and certificate generation system
- Instructor verification workflow
- Mobile-first responsive design

Challenges Faced & Solutions:
- Academy Workflow Implementation: Built end-to-end course progression, exam submission, task review, verification, and certificate generation systems.
- Media Streaming & Performance: Optimized video loading, buffering, and player experience across devices.
- Content Organization: Designed scalable structures for both entertainment catalogs and structured academy courses.`,
    category: "WEB_APP",
    status: "COMPLETED",
    featured: true,
    githubUrl: "https://github.com/Ememzyvisuals/flonextv",
    liveUrl: "https://flonextv.vercel.app",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "TMDB API"],
    isMobilePrimary: true,
    coverImage: "/images/projects/flonextv-web.png",
    webImages: ["/images/projects/flonextv-web.png"],
    mobileImages: ["/images/projects/flonextv-mobile1.png", "/images/projects/flonextv-mobile2.png"],
  },
  {
    slug: "naijaprep",
    title: "NaijaPrep",
    subtitle: "Offline-First Exam Preparation App (2026)",
    description:
      "A robust, offline-first mobile-first web application designed to help Nigerian students prepare for major examinations including JAMB, WAEC, and NECO. Built with a strong emphasis on reliability in low-connectivity environments.",
    longDesc: `NaijaPrep is a robust, offline-first mobile-first web application designed to help Nigerian students prepare for major examinations including JAMB, WAEC, and NECO. Built with a strong emphasis on reliability in low-connectivity environments, it provides comprehensive study tools, progress tracking, and motivational features.

Problem Solved:
Students in areas with unstable internet often cannot access quality digital study tools. NaijaPrep delivers a fully functional offline experience with rich resources and gamification to boost consistency and exam performance.

Key Features:
- Full offline functionality — works without internet
- JAMB, WAEC, and NECO practice questions
- AI Tutor for instant answers
- Daily Challenge and streak tracking
- Practice exams, study notes, and flashcards
- Exam countdown timers
- Progressive Web App (PWA) installable on any device

Challenges Faced & Solutions:
- Full Offline Functionality: Implemented comprehensive data caching, service workers, and sync mechanisms for study materials and progress.
- Performance on Low-End Devices: Optimized bundle size, lazy loading, and resource-heavy mock exam engines.
- Gamification Persistence: Built reliable streak and progress tracking that works seamlessly offline and syncs when online.`,
    category: "EDTECH",
    status: "COMPLETED",
    featured: false,
    githubUrl: "https://github.com/Ememzyvisuals/naijaprep",
    liveUrl: "https://naijaprep.netlify.app",
    techStack: ["React", "TypeScript", "Vite", "Tailwind CSS", "Service Workers", "IndexedDB", "PWA"],
    isMobilePrimary: true,
    coverImage: "/images/projects/naijaprep-web.png",
    webImages: ["/images/projects/naijaprep-web.png"],
    mobileImages: ["/images/projects/naijaprep-mobile.png"],
  },
  {
    slug: "studenthub-ng",
    title: "StudentHub NG",
    subtitle: "Online Exam Preparation & Resource Platform",
    description:
      "A modern, fully online web platform providing comprehensive tools and rich learning resources for Nigerian students preparing for JAMB, WAEC, and NECO examinations.",
    longDesc: `StudentHub NG is a modern, fully online web platform providing comprehensive tools and rich learning resources for Nigerian students preparing for JAMB, WAEC, and NECO examinations. It serves as a complete preparation hub with interactive tools, analytics, and community-focused features.

Problem Solved:
Students struggle with scattered resources and lack structured, engaging digital preparation environments. StudentHub NG centralizes high-quality materials and tools in one accessible, motivating platform.

Key Features:
- Practice exams, mock tests, and flashcards
- Real-time progress analytics and streak tracking
- Dark/light mode with responsive design
- Performance dashboard showing accuracy and questions answered
- Quick Actions for Practice, Mock Exam, Flashcards, and more

Challenges Faced & Solutions:
- Scalable Question Bank & Mock Engine: Designed efficient data structures and rendering for large volumes of practice questions.
- Real-time Progress Analytics: Implemented accurate streak, accuracy, and performance tracking systems.
- User Engagement: Balanced rich features with clean UX to reduce cognitive load during long study sessions.`,
    category: "EDTECH",
    status: "COMPLETED",
    featured: false,
    githubUrl: "https://github.com/Ememzyvisuals/studenthub-ng",
    liveUrl: "https://studenthub-ng.vercel.app",
    techStack: ["React", "TypeScript", "Vite", "Tailwind CSS"],
    isMobilePrimary: false,
    coverImage: "/images/projects/studenthub-web.png",
    webImages: ["/images/projects/studenthub-web.png"],
    mobileImages: [],
  },
  {
    slug: "nairanest",
    title: "NairaNest",
    subtitle: "Fintech Simulation & Digital Banking Demo",
    description:
      "A high-fidelity fintech simulation platform that showcases how real-world digital banking systems operate. Replicates core banking processes including account management, transfers, bill payments, and real-time transaction monitoring.",
    longDesc: `NairaNest is a high-fidelity fintech simulation platform that showcases how real-world digital banking systems operate. It replicates core banking processes including account management, transfers, bill payments, and real-time transaction monitoring in a secure, realistic environment.

Problem Solved:
Understanding complex fintech systems can be challenging. NairaNest serves as an interactive demonstration of modern digital banking architecture and user flows, ideal for portfolios, client pitches, and educational purposes.

Key Features:
- Realistic account management and balance display
- Transfer flows and bill payment simulation
- Real-time transaction monitoring and activity logs
- 256-bit encryption simulation visuals
- Banking-grade UI with smooth animations

Challenges Faced & Solutions:
- Realistic Transaction Simulation: Built accurate real-time balance updates, transfer flows, and activity logs that mimic production fintech systems.
- Security Simulation: Implemented authentication, encryption visuals, and secure transaction patterns to demonstrate compliance best practices.
- Performance & Realism: Achieved smooth, responsive UI with realistic latency handling and error scenarios.`,
    category: "FINTECH",
    status: "COMPLETED",
    featured: false,
    githubUrl: null,
    liveUrl: "https://nairanest.netlify.app",
    techStack: ["React", "Firebase", "Tailwind CSS", "Docker", "TypeScript"],
    isMobilePrimary: false,
    coverImage: "/images/projects/nairanest-web.png",
    webImages: ["/images/projects/nairanest-web.png"],
    mobileImages: [],
  },
  {
    slug: "storejet",
    title: "StoreJet",
    subtitle: "No-Code Mini Online Store Builder",
    description:
      "StoreJet empowers Nigerian small businesses and vendors to create professional mini online stores in under 60 seconds. Features beautiful product catalogs and direct WhatsApp order integration.",
    longDesc: `StoreJet empowers Nigerian small businesses and vendors to create professional mini online stores in under 60 seconds. It features beautiful product catalogs and direct WhatsApp order integration.

Problem Solved:
High barriers to entry for small vendors wanting an online presence. StoreJet provides an instant, WhatsApp-native solution tailored to the Nigerian market.

Key Features:
- Create a complete online store in under 60 seconds
- Beautiful product catalog with categories
- Direct WhatsApp order integration
- Trusted by 500+ Nigerian vendors
- 2K+ products listed, N5M+ in sales facilitated

Challenges Faced & Solutions:
- Seamless WhatsApp Integration: Built reliable order routing and notification systems.
- No-Code Simplicity: Created intuitive store builder flows while maintaining backend flexibility.
- Performance & Mobile Optimization: Ensured fast loading for users on varied network conditions.`,
    category: "WEB_APP",
    status: "COMPLETED",
    featured: false,
    githubUrl: null,
    liveUrl: "https://storejet-ng.netlify.app",
    techStack: ["React", "Tailwind CSS", "Firebase", "Docker"],
    isMobilePrimary: false,
    coverImage: "/images/projects/storejet-web.png",
    webImages: ["/images/projects/storejet-web.png"],
    mobileImages: [],
  },
  {
    slug: "ar-toluwani-store",
    title: "A.R. Toluwani Store",
    subtitle: "Full-Featured E-commerce Platform",
    description:
      "A complete e-commerce storefront for home appliances, kitchen utensils, and household essentials, featuring promotions, category browsing, cart management, and local delivery options.",
    longDesc: `A.R. Toluwani Store is a complete e-commerce storefront for home appliances, kitchen utensils, and household essentials, featuring promotions, category browsing, cart management, and local delivery options.

Problem Solved:
Small retail businesses need professional online sales channels with local marketing and delivery capabilities.

Key Features:
- Full product catalog: Home Appliances, Kitchen Utensils, Plastics & Storage
- Dynamic promotional banners and discount system
- Cart management and checkout flow
- Local delivery options
- Free Delivery Weekend promotions
- Mobile-optimized shopping experience

Challenges Faced & Solutions:
- E-commerce Flow Reliability: Built robust cart, checkout, and order management systems.
- Promotional & Marketing Features: Implemented dynamic banners, discounts, and delivery logic.
- Responsive Product Experience: Optimized image handling and navigation for mobile users.`,
    category: "WEB_APP",
    status: "COMPLETED",
    featured: false,
    githubUrl: "https://github.com/Ememzyvisuals/AR-TOLUWANI-STORE",
    liveUrl: "https://ar-toluwani-store.netlify.app",
    techStack: ["React", "Next.js", "Tailwind CSS"],
    isMobilePrimary: false,
    coverImage: "/images/projects/artoluwani-web.png",
    webImages: ["/images/projects/artoluwani-web.png"],
    mobileImages: [],
  },
  {
    slug: "ajoflow",
    title: "AjoFlow",
    subtitle: "Modern Cooperative Finance Platform for Africa",
    description:
      "A production-grade digital Ajo, Esusu, and cooperative finance operating system powered by Nomba's payment infrastructure — automated virtual accounts, AI-weighted trust scoring, and real-time group treasury management. Built for the Nomba Hackathon 2026.",
    longDesc: `AjoFlow digitizes traditional Ajo, Esusu, and cooperative thrift savings with automated Nomba payments, AI-powered trust scoring, and real-time community collaboration tools. Built for the Nomba Hackathon 2026 — Virtual Accounts Infrastructure Track.

Problem Solved:
Traditional Ajo relies on paper records, cash handling, and WhatsApp groups — all of which create disputes, lost records, and zero financial transparency. AjoFlow solves each of these with bank-grade digital infrastructure while preserving the cultural and social trust mechanics that make Ajo work.

Key Features:
- Rotational Ajo, Target Savings, Cooperative, and Investment groups
- One static, non-expiring NUBAN virtual account per member per group
- Card + bank transfer checkout via Nomba hosted checkout, plus tokenized recurring cards
- AI-weighted Trust Score (0-100) built from real payment behavior
- Conversational AI assistant in English and Nigerian Pidgin
- Admin-approved payouts with bank-side name verification
- Trust-score-gated loan requests within groups
- Group announcements, discussions, and comments
- Installable PWA on Android, iOS, and desktop

Challenges Faced & Solutions:
- Reconciliation at Scale: Every transaction is verified via HMAC-signed Nomba webhooks with idempotency checks before it touches the ledger, so group treasuries stay accurate with zero manual intervention.
- Trust Without a Credit Bureau: Designed a weighted scoring model from on-time payments, consecutive streaks, late payments, missed payments, and loan defaults — a financial reputation system for a market that's never had one.
- Isolated, Per-Group Treasuries: Every cooperative group gets its own isolated treasury and dedicated virtual accounts on top of a single Nomba sub-account, so funds never cross between groups.`,
    category: "FINTECH",
    status: "COMPLETED",
    featured: true,
    githubUrl: "https://github.com/Ememzyvisuals/Ajoflow-hackathon",
    liveUrl: "https://ajoflow.vercel.app",
    techStack: ["Next.js 15", "TypeScript", "Supabase", "Nomba API", "Groq API", "Resend", "PWA"],
    isMobilePrimary: false,
    coverImage: "/images/projects/ajoflow-web.png",
    webImages: ["/images/projects/ajoflow-web.png", "/images/projects/ajoflow-web-full.png"],
    mobileImages: [],
  },
  {
    slug: "ekklesia",
    title: "Ekklesia",
    subtitle: "Multilingual Bible & Church Companion App",
    description:
      "A free, offline-first mobile companion app for reading and listening to the Bible in five languages, keeping up with sermons and live radio, asking an AI assistant for prayer or a devotional, and playing Bible-themed games — all usable with no internet connection.",
    longDesc: `Ekklesia is a free, offline-first companion app for reading and listening to the Bible in English, Yoruba, Hausa, Igbo, and Nigerian Pidgin, keeping up with sermons and live radio, asking an AI assistant for a prayer or a devotional, and playing a couple of Bible-themed games — all in one place, and all still usable with no internet connection once opened at least once.

Problem Solved:
Believers in low-connectivity areas need reliable, offline access to Scripture, sermons, and study tools in their own language — not another app that stops working the moment the signal drops.

Key Features:
- Full Bible in five languages, downloaded on first launch for complete offline reading
- Chapter-by-chapter audio playback with adjustable speed, verse highlighting, and auto-scroll
- Live DCLM Radio streaming (persists through screen lock and app switching) plus a full Sermon Library
- AI Assistant for verse explanations, prayer, and devotionals — powered by the user's own free Groq API key
- Bible Quiz and Bible Word Search, both fully offline
- Downloads manager, adjustable text size app-wide, and light/dark appearance

Challenges Faced & Solutions:
- True Offline-First: All five Bible translations, downloads, bookmarks, and settings are stored entirely on-device, so reading, the games, and playback work with zero network dependency after first setup.
- Bring-Your-Own-Key AI: The AI Assistant runs on a Groq key the user supplies and stores locally, keeping the app free to run while being transparent that it's the one feature that leaves the device.
- Audio Sync at Scale: Built a chapter audio player that highlights the exact verse being read and auto-scrolls to follow it, with prev/next chapter navigation that doesn't interrupt playback.`,
    category: "MOBILE",
    status: "COMPLETED",
    featured: true,
    githubUrl: "https://github.com/Ememzyvisuals/Ekklesia-App/",
    liveUrl: null,
    techStack: ["Offline-First Architecture", "Groq API", "Multilingual (5 languages)", "Android"],
    isMobilePrimary: true,
    coverImage: "/images/projects/felicia-home.png",
    webImages: [],
    mobileImages: [
      "/images/projects/felicia-home.png",
      "/images/projects/felicia-bible.png",
      "/images/projects/felicia-ai.png",
      "/images/projects/felicia-sermons.png",
      "/images/projects/felicia-games.png",
    ],
  },
  {
    slug: "africlaude",
    title: "Africlaude",
    subtitle: "Open-Source Language Model for African Contexts",
    description:
      "A 7B-parameter open-source language model built by Axiveri for African contexts — trained, fine-tuned, and published personally, not a wrapper around someone else's model.",
    longDesc: `Africlaude is an open-source language model series built under Axiveri, the AI research organization I founded. Africlaude-7B is live on HuggingFace; a v2 with dedicated Yoruba, Igbo, and Hausa support is in development.

This is personal engineering work, not integration work — the training, fine-tuning, evaluation, and publishing pipeline for Africlaude was built and run by me end-to-end.`,
    category: "AI_ML",
    status: "COMPLETED",
    featured: true,
    githubUrl: null,
    liveUrl: "https://huggingface.co/Axiveri/Africlaude-7B",
    techStack: ["7B Parameters", "Open Source", "HuggingFace"],
    isMobilePrimary: false,
    coverImage: null,
    webImages: [],
    mobileImages: [],
  },
  {
    slug: "naijavox",
    title: "NaijaVox",
    subtitle: "Nigerian Speech Recognition Model",
    description:
      "A Whisper large-v3 LoRA fine-tune for Nigerian speech recognition, covering Yoruba, Hausa, Igbo, Nigerian Pidgin, and Nigerian-accented English.",
    longDesc: `NaijaVox-V1 is a fine-tuned Whisper large-v3 model (via LoRA) built under Axiveri for Nigerian multilingual speech recognition — trained on a dual-T4 Kaggle setup, covering Yoruba, Hausa, Igbo, Nigerian Pidgin, and Nigerian-accented English.

Along the way this involved resolving real production ML bugs: a dtype mismatch between float32 inputs and fp16 weights under DataParallel, a gradient-checkpointing incompatibility (resolved via use_reentrant=False), a silent augmentation flag bug, and a hardcoded dtype cast at eval time.`,
    category: "AI_ML",
    status: "COMPLETED",
    featured: false,
    githubUrl: null,
    liveUrl: "https://huggingface.co/Axiveri/Naijavox-V1",
    techStack: ["ASR", "Whisper Large-v3", "LoRA", "5 Languages"],
    isMobilePrimary: false,
    coverImage: null,
    webImages: [],
    mobileImages: [],
  },
  {
    slug: "wazobiavoice",
    title: "WazobiaVoice",
    subtitle: "Multilingual TTS & Voice Cloning for Nigerian Languages",
    description:
      "A ~2B-parameter multilingual text-to-speech and zero-shot voice cloning model covering Yoruba, Hausa, Igbo, Nigerian Pidgin, and Nigerian English — one model, five languages.",
    longDesc: `WazobiaVoice extends Chatterbox's multilingual TTS architecture to support Nigerian languages it wasn't originally designed for — including Yoruba's tonal diacritics. Fine-tuned via LoRA adapters on AMD Developer Cloud (ROCm) across a ~31k-clip, ~14GB training set.

Training ran to completion across 7 epochs, with checkpoints merged and published to HuggingFace via an isolated Kaggle merge workflow (built to work around disk-quota constraints). Along the way this involved fixing a silent double from_pretrained call that was discarding prior epoch progress at merge time, missing --no-deps dependencies, a checkpoint epoch-labeling off-by-one, and a CUDA device-side assert crash resolved via per-epoch subprocess isolation. Evaluated across epochs using DNSMOS scoring.`,
    category: "AI_ML",
    status: "COMPLETED",
    featured: true,
    githubUrl: "https://github.com/Ememzyvisuals/wazobiavoice-TTS",
    liveUrl: "https://huggingface.co/Axiveri/WazobiaVoice",
    techStack: ["~2B Parameters", "Voice Cloning", "Chatterbox Architecture", "5 Languages"],
    isMobilePrimary: false,
    coverImage: null,
    webImages: [],
    mobileImages: [],
  },
  {
    slug: "afrivision-base",
    title: "AfriVision-Base",
    subtitle: "Image Generation Model for African Imagery",
    description:
      "A FLUX-based LoRA fine-tune trained on nearly 15,000 captioned images for image generation reflecting African people, places, and contexts.",
    longDesc: `AfriVision-Base is a FLUX.2 klein-base-4B LoRA fine-tune, trained under Axiveri on the Axiveri/AfriVision-30K dataset (14,792 images) via a three-notebook Kaggle pipeline: Florence-2 captioning, LoRA training, and CLIP-based cleanup. The trained LoRA was fused into the base model's attention weights and published to HuggingFace.

Building the pipeline meant resolving a transformers version incompatibility, CLIP pooled-embedding extraction failures, and flash_attn compile hangs on Kaggle — plus a subtler bug where calling device_map='balanced' twice in the same process left stale multi-GPU allocations, fixed with explicit per-device cleanup after each pipeline deletion.`,
    category: "AI_ML",
    status: "COMPLETED",
    featured: false,
    githubUrl: null,
    liveUrl: "https://huggingface.co/Axiveri/AfriVision-Base",
    techStack: ["FLUX LoRA", "Image Generation", "African Imagery"],
    isMobilePrimary: false,
    coverImage: null,
    webImages: [],
    mobileImages: [],
  },
];

export const FEATURED_PROJECTS = ALL_PROJECTS.filter((p) => p.featured);
