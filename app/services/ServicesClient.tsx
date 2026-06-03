"use client";
// app/services/ServicesClient.tsx

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Globe,
  Layers,
  Bot,
  Zap,
  Server,
  ArrowRight,
  CheckCircle2,
  MessageSquare,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const SERVICES = [
  {
    id: "website",
    icon: Globe,
    title: "Website Development",
    tagline: "High-quality websites that make people stop scrolling.",
    description:
      "Modern, responsive websites built with Next.js and Tailwind CSS. Fast-loading, SEO-optimized, and pixel-perfect on every device. Whether you need a landing page, business site, portfolio, or e-commerce store — it gets built right.",
    deliverables: [
      "Landing pages & business websites",
      "Portfolio & personal brand sites",
      "E-commerce stores",
      "Company websites & corporate sites",
      "Event & campaign pages",
    ],
    timeline: "3 – 14 days",
    stack: ["Next.js", "React", "Tailwind CSS", "TypeScript", "Vercel"],
    color: "border-blue-200 dark:border-blue-800",
    iconBg: "bg-blue-50 dark:bg-blue-950",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    id: "webapp",
    icon: Layers,
    title: "Web Application Development",
    tagline: "Full-stack platforms built to scale.",
    description:
      "SaaS products, dashboards, internal tools, and full web applications with authentication, real-time features, and production-grade backends. Built with the same stack powering ClaudGPT and AethLife.",
    deliverables: [
      "SaaS platforms and dashboards",
      "User authentication systems",
      "Real-time features (SSE, WebSocket)",
      "Admin panels and CMS",
      "Database design and architecture",
    ],
    timeline: "2 – 8 weeks",
    stack: ["Next.js 15", "TypeScript", "Supabase", "PostgreSQL", "Prisma"],
    color: "border-violet-200 dark:border-violet-800",
    iconBg: "bg-violet-50 dark:bg-violet-950",
    iconColor: "text-violet-600 dark:text-violet-400",
  },
  {
    id: "ai",
    icon: Bot,
    title: "AI System Development",
    tagline: "AI that actually works for your product.",
    description:
      "AI-powered applications using Groq API, LLaMA, RAG pipelines, and multi-agent architectures. From AI chatbots embedded in your website to full multi-agent development platforms like ClaudGPT.",
    deliverables: [
      "AI chatbots and assistants",
      "RAG pipelines and knowledge bases",
      "Multi-agent AI systems",
      "AI features integrated into existing apps",
      "LLM evaluation and benchmarking",
    ],
    timeline: "1 – 6 weeks",
    stack: ["Groq API", "LLaMA 70B", "pgvector", "Python", "Next.js"],
    color: "border-emerald-200 dark:border-emerald-800",
    iconBg: "bg-emerald-50 dark:bg-emerald-950",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    id: "automation",
    icon: Zap,
    title: "Business Automation",
    tagline: "Stop doing manually what a bot can do in seconds.",
    description:
      "Telegram bots, WhatsApp automation, AI agents, and workflow automation systems that handle your business operations around the clock. The same engineering behind Lumeo AI and Microdragon — built for your business.",
    deliverables: [
      "Telegram bots for business",
      "WhatsApp automation systems",
      "Workflow and process automation",
      "AI agents for repetitive tasks",
      "Notifications and scheduling systems",
    ],
    timeline: "1 – 4 weeks",
    stack: ["Python", "Groq API", "Docker", "Node.js", "Playwright"],
    color: "border-amber-200 dark:border-amber-800",
    iconBg: "bg-amber-50 dark:bg-amber-950",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  {
    id: "api",
    icon: Server,
    title: "API & Backend Development",
    tagline: "Solid backends that your frontend can rely on.",
    description:
      "Scalable REST APIs, database design, and backend systems. Whether you need a standalone API for your mobile app, a backend for your web app, or a data pipeline — it gets built clean and documented.",
    deliverables: [
      "REST API design and development",
      "Database architecture and design",
      "Third-party API integrations",
      "Authentication systems (JWT, OAuth)",
      "Backend for mobile and web apps",
    ],
    timeline: "1 – 4 weeks",
    stack: ["Node.js", "Express", "PostgreSQL", "Prisma", "Docker"],
    color: "border-cyan-200 dark:border-cyan-800",
    iconBg: "bg-cyan-50 dark:bg-cyan-950",
    iconColor: "text-cyan-600 dark:text-cyan-400",
  },
];

const FAQS = [
  {
    q: "How much does it cost to hire you?",
    a: "Pricing depends on the scope and complexity of your project. I work with startups, small businesses, and clients worldwide. Send me a message with what you need and I'll send you a clear quote — no surprises.",
  },
  {
    q: "Can you build a website for my business in Nigeria?",
    a: "Absolutely. I build premium business websites, landing pages, e-commerce stores, and full web platforms. Fast delivery, clean code, and a result you'll be proud to share.",
  },
  {
    q: "How long does it take to deliver a project?",
    a: "A landing page: 3–7 days. A full web app or SaaS platform: 2–8 weeks. Automation bots: 1–2 weeks. I give you a clear timeline upfront for every project.",
  },
  {
    q: "Do you work with clients outside Nigeria?",
    a: "Yes. I work with clients worldwide. Remote-first, async-friendly, and comfortable with any timezone. USD, NGN, and other currencies accepted.",
  },
  {
    q: "Can you add AI to my existing website or app?",
    a: "Yes. I can integrate AI features — chatbots, recommendations, content generation, smart search — into an existing product. No need to rebuild from scratch.",
  },
  {
    q: "What makes your websites different from generic developers?",
    a: "I build with modern stacks (Next.js 15, TypeScript, Tailwind), write clean maintainable code, optimize for SEO and performance, and deliver products that actually look premium. See the work page for proof.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4"
      >
        <span className="font-semibold text-foreground">{q}</span>
        <ChevronDown
          size={18}
          className={cn(
            "text-muted-foreground flex-shrink-0 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <p className="text-muted-foreground text-sm leading-relaxed pb-5">{a}</p>
      )}
    </div>
  );
}

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
};

export function ServicesClient() {
  return (
    <div className="py-16 md:py-24 space-y-24">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div className="container-padded">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl space-y-6"
        >
          <div className="inline-flex items-center gap-2 pill">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium">Available for new projects</span>
          </div>
          <h1 className="section-heading">
            Need a website,<br />AI system, or<br />automation?
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
            I build premium digital products — from clean business websites to
            full AI-powered platforms. Fast, high-quality, and built to grow
            your business.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/contact" className="btn-primary">
              Start a Project <ArrowRight size={16} />
            </Link>
            <Link href="/work" className="btn-outline">
              See My Work
            </Link>
          </div>
        </motion.div>
      </div>

      {/* ── Quick trust bar ──────────────────────────────────────────── */}
      <div className="border-y border-border bg-secondary/30">
        <div className="container-padded py-6">
          <div className="flex flex-wrap items-center gap-6 md:gap-12">
            {[
              { value: "10+", label: "Projects Shipped" },
              { value: "3+", label: "AI Systems Built" },
              { value: "Worldwide", label: "Clients Served" },
              { value: "Fast", label: "Delivery" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-bold text-lg text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Service cards ────────────────────────────────────────────── */}
      <div className="container-padded space-y-6">
        <motion.div {...fadeUp} transition={{ duration: 0.5 }}>
          <h2 className="text-4xl font-bold tracking-tight">What I Build</h2>
          <p className="text-muted-foreground mt-2 text-lg max-w-xl">
            Every service below is backed by real shipped products. Not demos — production systems.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {SERVICES.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                id={service.id}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className={cn(
                  "card-surface p-7 space-y-5 border-l-2",
                  service.color
                )}
              >
                {/* Icon + title */}
                <div className="flex items-center gap-3">
                  <div className={cn("p-2.5 rounded-xl", service.iconBg)}>
                    <Icon size={20} className={service.iconColor} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground">{service.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{service.tagline}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {service.description}
                </p>

                {/* Deliverables */}
                <ul className="space-y-2">
                  {service.deliverables.map((d) => (
                    <li key={d} className="flex items-start gap-2 text-sm text-foreground">
                      <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                      {d}
                    </li>
                  ))}
                </ul>

                {/* Footer row */}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground">Typical delivery</p>
                    <p className="text-sm font-semibold text-foreground">{service.timeline}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-w-[55%] justify-end">
                    {service.stack.slice(0, 3).map((t) => (
                      <span key={t} className="tech-badge">{t}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Process section ──────────────────────────────────────────── */}
      <div className="container-padded space-y-10">
        <motion.div {...fadeUp} transition={{ duration: 0.5 }}>
          <h2 className="text-4xl font-bold tracking-tight">How It Works</h2>
          <p className="text-muted-foreground mt-2 text-lg max-w-xl">
            Simple, transparent, no back-and-forth confusion.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {[
            {
              step: "01",
              title: "Tell Me What You Need",
              desc: "Send a message with your idea, requirements, or problem. No long forms — just talk to me.",
            },
            {
              step: "02",
              title: "Get a Clear Quote",
              desc: "I'll send you a scope, timeline, and price. No hidden fees. No surprises.",
            },
            {
              step: "03",
              title: "I Build It",
              desc: "You get progress updates. I deliver clean, tested, production-ready code.",
            },
            {
              step: "04",
              title: "Launch & Grow",
              desc: "Your product is live, fast, and SEO-ready. I'm available post-launch for support.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              {...fadeUp}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card-surface p-6 space-y-3"
            >
              <span className="text-3xl font-black text-muted-foreground/20">
                {item.step}
              </span>
              <h3 className="font-bold text-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <div className="container-padded space-y-8">
        <motion.div {...fadeUp} transition={{ duration: 0.5 }}>
          <h2 className="text-4xl font-bold tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground mt-2 text-lg max-w-xl">
            If your question isn&apos;t here, just ask directly.
          </p>
        </motion.div>

        <div className="max-w-2xl space-y-0">
          {FAQS.map((faq) => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>

      {/* ── Final CTA ────────────────────────────────────────────────── */}
      <div className="container-padded">
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5 }}
          className="rounded-2xl bg-foreground text-background p-10 md:p-14 text-center space-y-6"
        >
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-background/20 bg-background/10 text-sm font-medium text-background/80">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Available right now
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Ready to build something?
          </h2>
          <p className="text-background/70 text-lg max-w-xl mx-auto leading-relaxed">
            Whether you need a website this week, an AI system for your product,
            or automation that saves your team hours every day — let&apos;s talk.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-background text-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              <MessageSquare size={15} />
              Start a Project
            </Link>
            <Link
              href="/work"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border-2 border-background/30 text-background font-semibold text-sm hover:border-background/60 transition-colors"
            >
              See My Work <ArrowRight size={15} />
            </Link>
          </div>

          <p className="text-background/40 text-xs">
            contact@ememzyvisuals.com · Available worldwide
          </p>
        </motion.div>
      </div>
    </div>
  );
}
