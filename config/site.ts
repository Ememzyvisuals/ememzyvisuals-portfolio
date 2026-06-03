// config/site.ts

export const siteConfig = {
  name: "Ememzyvisuals",
  fullName: "Emmanuel Ariyo",
  title: "Emmanuel Ariyo — Web Developer, AI Engineer & Automation Expert | Ememzyvisuals",
  shortTitle: "Emmanuel Ariyo | Ememzyvisuals",
  description:
    "Need a high-quality website, AI system, or business automation? Emmanuel Ariyo (Ememzyvisuals) is a self-taught Creative Software Developer and AI Systems Engineer from Nigeria. Builds premium web apps, AI-powered tools, and automation systems worldwide.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://ememzyvisuals.vercel.app",
  ogImage: "/og/og-image.png",

  keywords: [
    "Emmanuel Ariyo", "Ememzyvisuals", "Ememzyvisuals Digitals",
    "Emmanuel Ariyo developer", "Emmanuel Ariyo Nigeria",
    "self-taught developer Nigeria", "self-taught AI engineer Nigeria",
    "web developer for hire", "website developer Nigeria",
    "professional website developer", "high quality website developer",
    "hire website developer", "affordable website developer Nigeria",
    "web application developer Nigeria", "full stack developer Nigeria",
    "Next.js developer for hire", "React developer Nigeria",
    "AI developer Nigeria", "AI developer for hire",
    "AI systems engineer", "ChatGPT integration developer",
    "Groq API developer", "LLM developer Nigeria",
    "business automation developer", "automation developer Nigeria",
    "Telegram bot developer", "WhatsApp bot developer Nigeria",
    "TruthGuard benchmark", "LLM metacognition evaluation",
    "ClaudGPT AI", "AethLife app", "FlonexTV streaming",
    "NaijaPrep JAMB app", "Lumeo AI Telegram bot",
    "Microdragon CLI agent", "StudentHub NG", "NairaNest digital banking",
    "hire Nigerian developer", "freelance developer Nigeria",
    "remote developer Nigeria", "developer for startup Nigeria",
    "SaaS developer Nigeria", "build web application Nigeria",
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

  services: [
    { name: "Website Development", description: "Premium websites built with Next.js, React, and Tailwind CSS." },
    { name: "Web Application Development", description: "Full-stack SaaS platforms with authentication, databases, and real-time features." },
    { name: "AI System Development", description: "AI-powered applications using Groq API, LLaMA, and RAG pipelines." },
    { name: "Business Automation", description: "Telegram bots, WhatsApp automation, and AI agents for business operations." },
    { name: "API & Backend Development", description: "Scalable REST APIs, database design, and backend systems." },
  ],

  availableForWork: true,
};

export const navItems = [
  { label: "Work",         href: "/work" },
  { label: "About",        href: "/about" },
  { label: "Services",     href: "/services" },
  { label: "Automation",   href: "/automation" },
  { label: "Benchmarks",   href: "/benchmarks" },
  { label: "Blogs",        href: "/blogs" },
  { label: "Gallery",      href: "/gallery" },
  { label: "Ask About Me", href: "/ask-about-me" },
  { label: "Reviews",      href: "/reviews" },
  { label: "Contact",      href: "/contact" },
];
