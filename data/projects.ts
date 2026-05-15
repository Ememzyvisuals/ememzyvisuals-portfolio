// data/projects.ts
import { Project } from "@/types";

export const FEATURED_PROJECTS: Partial<Project>[] = [
  {
    slug: "claudgpt",
    title: "ClaudGPT",
    subtitle: "Multi-Agent AI Development Platform",
    description:
      "9 specialized AI agents collaborate across planning, architecture, coding, debugging, and review — delivering production-ready, exportable full-stack applications from natural language prompts.",
    longDesc: `ClaudGPT is a production-grade, multi-agent AI development assistant that enables developers to build complete full-stack applications, WhatsApp bots, automation tools, and REST APIs directly from natural language prompts.

It features a sophisticated pipeline of 9 specialized AI agents that collaborate across planning, architecture, coding, debugging, and review stages — delivering finished, exportable projects with live previews.

Key Features:
- 9-agent pipeline: Planner → Architect → Coder → Debugger → Reviewer
- Live project preview in the browser
- Full project export with clean folder structure
- Multi-key Groq API rotation with automatic failover
- Real-time streaming via Server-Sent Events
- Supabase Auth with Email, Google, and GitHub OAuth`,
    category: "AI_ML",
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
      "Intelligent 4-in-1 personal life OS that connects workouts, spending, habits, and energy. AI analyzes cross-domain correlations to deliver actionable insights about your well-being.",
    longDesc: `AethLife is an intelligent 4-in-1 personal life operating system that connects workouts, spending, habits, and energy levels.

Using AI, it analyzes cross-domain correlations to deliver actionable insights that help users optimize their overall well-being.

What makes it different: Most tracking apps operate in silos. AethLife gives you unified visibility across all life domains and tells you how they affect each other.

Key Features:
- Workout, spending, habit, and energy tracking in one app
- AI-powered cross-domain correlation insights
- Complex 15+ table PostgreSQL schema with Row Level Security
- Offline PWA with IndexedDB sync
- Firebase Cloud Messaging for smart notifications
- Google OAuth + email authentication`,
    category: "AI_ML",
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
      "Modern streaming platform offering movies, series, and a full Academy with AI-reviewed practical tasks, exam submissions, and certificate generation.",
    category: "AI_ML",
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
];

export const ALL_PROJECTS: Partial<Project>[] = [
  ...FEATURED_PROJECTS,
  {
    slug: "naijaprep",
    title: "NaijaPrep",
    subtitle: "Offline-First Exam Preparation App",
    description:
      "Offline-first PWA for Nigerian students preparing for JAMB, WAEC, and NECO. Full functionality without internet, rich gamification, and seamless sync when online.",
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
      "Comprehensive online platform centralizing JAMB, WAEC, and NECO preparation with interactive tools, analytics, and community features.",
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
      "High-fidelity fintech simulation platform replicating real-world digital banking — account management, transfers, bill payments, and real-time transaction monitoring.",
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
      "Empowers Nigerian small businesses to create professional mini online stores in under 60 seconds with beautiful product catalogs and direct WhatsApp order integration.",
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
      "Complete e-commerce storefront for home appliances, kitchen utensils, and household essentials with promotions, categories, cart, and local delivery.",
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
];
