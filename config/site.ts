// config/site.ts

export const siteConfig = {
  name: "Ememzyvisuals",
  fullName: "Emmanuel Ariyo",

  title: "Emmanuel Ariyo — Web Developer, AI Engineer & Automation Expert | Ememzyvisuals",
  shortTitle: "Emmanuel Ariyo | Ememzyvisuals",
  description:
    "Need a high-quality website, AI system, or business automation? Emmanuel Ariyo (Ememzyvisuals) builds premium web apps, AI-powered tools, and automation systems that grow your business. Based in Nigeria, available worldwide.",

  url: process.env.NEXT_PUBLIC_APP_URL || "https://ememzyvisuals.com",
  ogImage: "/og/og-image.png",

  keywords: [
    // ── Name & brand (people who already know you) ──
    "Emmanuel Ariyo",
    "Ememzyvisuals",
    "Ememzyvisuals Digitals",
    "Emmanuel Ariyo developer",
    "Emmanuel Ariyo Nigeria",
    "Emmanuel Ariyo portfolio",
    "@ememzyvisuals",
    "ememzyvisuals.com",

    // ── "I need a website" searches ──
    "web developer for hire",
    "website developer Nigeria",
    "professional website developer",
    "high quality website developer",
    "good website developer",
    "best website developer Nigeria",
    "hire website developer",
    "affordable website developer Nigeria",
    "website developer for small business",
    "custom website development",
    "build me a website",
    "I need a website built",
    "website design and development",
    "professional website design Nigeria",
    "premium web design Nigeria",
    "modern website developer",
    "website developer for startup",
    "web developer for business",
    "ecommerce website developer Nigeria",
    "landing page developer Nigeria",

    // ── "I need a web app" searches ──
    "web application developer Nigeria",
    "full stack developer Nigeria",
    "full stack web developer for hire",
    "Next.js developer for hire",
    "React developer Nigeria",
    "React developer for hire",
    "Next.js developer Nigeria",
    "TypeScript developer Nigeria",
    "SaaS developer Nigeria",
    "SaaS product builder",
    "build web application Nigeria",
    "custom web app developer",
    "full stack developer for hire Africa",

    // ── "I need AI" searches ──
    "AI developer Nigeria",
    "AI developer for hire",
    "AI systems engineer",
    "artificial intelligence developer Nigeria",
    "AI-powered website developer",
    "ChatGPT integration developer",
    "Groq API developer",
    "LLM developer Nigeria",
    "AI chatbot developer",
    "build AI chatbot",
    "AI integration for business",
    "AI software developer Africa",
    "machine learning developer Nigeria",
    "AI app developer",
    "hire AI engineer",
    "AI engineer for hire Nigeria",

    // ── "I need automation" searches ──
    "business automation developer",
    "automation developer Nigeria",
    "automation developer for hire",
    "workflow automation developer",
    "business process automation Nigeria",
    "automate my business Nigeria",
    "business automation tools Nigeria",
    "Telegram bot developer",
    "WhatsApp bot developer Nigeria",
    "Telegram bot for business",
    "chatbot automation Nigeria",
    "AI automation for business",
    "automation software developer",
    "build automation for my business",
    "business workflow automation",
    "process automation developer Africa",

    // ── "I want to know more about him" searches ──
    "who is Emmanuel Ariyo",
    "who is Ememzyvisuals",
    "Ememzyvisuals projects",
    "Emmanuel Ariyo projects",
    "Emmanuel Ariyo AI engineer",
    "Emmanuel Ariyo software engineer",
    "Nigerian software developer portfolio",
    "African software developer portfolio",
    "best Nigerian developer",
    "Nigerian AI developer",

    // ── Service-specific searches ──
    "hire freelance developer Nigeria",
    "freelance developer Africa",
    "software developer for hire Nigeria",
    "software engineer for hire",
    "freelance Next.js developer",
    "freelance AI developer",
    "remote developer Nigeria",
    "remote developer Africa",
    "developer for startup Nigeria",

    // ── Project-specific (rank when people search these) ──
    "TruthGuard benchmark",
    "LLM metacognition evaluation",
    "ClaudGPT AI",
    "AethLife app",
    "FlonexTV streaming",
    "NaijaPrep JAMB app",
    "Lumeo AI Telegram bot",
    "Microdragon CLI agent",
    "StudentHub NG",
    "NairaNest digital banking",

    // ── Technical depth (for technical clients) ──
    "Supabase developer",
    "PostgreSQL developer Nigeria",
    "pgvector RAG developer",
    "Docker developer Nigeria",
    "PWA developer Nigeria",
    "offline-first app developer",
    "API developer Nigeria",
    "REST API developer",
  ],

  author: {
    name: "Emmanuel Ariyo",
    alternateName: "Ememzyvisuals",
    email: "contact@ememzyvisuals.com",
    twitter: "@ememzyvisuals",
    location: "Nigeria",
    jobTitle: "Web Developer, AI Engineer & Automation Expert",
  },

  socials: {
    github: "https://github.com/ememzyvisuals",
    twitter: "https://twitter.com/ememzyvisuals",
    tiktok: "https://tiktok.com/@ememzyvisuals",
    kaggle: "https://www.kaggle.com/ememzyvisuals",
  },

  // Services Emmanuel offers — used in structured data
  services: [
    {
      name: "Website Development",
      description: "Premium, modern websites built with Next.js, React, and Tailwind CSS. Fast, responsive, and SEO-optimized.",
    },
    {
      name: "Web Application Development",
      description: "Full-stack SaaS platforms and web applications with authentication, databases, and real-time features.",
    },
    {
      name: "AI System Development",
      description: "AI-powered applications using Groq API, LLaMA, RAG pipelines, and multi-agent systems.",
    },
    {
      name: "Business Automation",
      description: "Telegram bots, WhatsApp integrations, workflow automation, and AI agents that automate your business operations.",
    },
    {
      name: "LLM Benchmarking & Evaluation",
      description: "Evaluation systems and benchmarks for testing large language model capabilities and reliability.",
    },
  ],

  availableForWork: true,
};

export const navItems = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "Automation", href: "/automation" },
  { label: "Benchmarks", href: "/benchmarks" },
  { label: "Blogs", href: "/blogs" },
  { label: "Gallery", href: "/gallery" },
  { label: "Ask About Me", href: "/ask-about-me" },
  { label: "Reviews", href: "/reviews" },
  { label: "Contact", href: "/contact" },
];
