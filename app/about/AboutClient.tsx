"use client";
// app/about/AboutClient.tsx

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MapPin, Sparkles, Code, Brain, Zap } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export function AboutClient() {
  return (
    <div className="py-16 md:py-24 space-y-24">

      {/* ── Hero section — photo + name ─────────────────────────── */}
      <div className="container-padded">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">

          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden aspect-[4/5] bg-secondary max-w-sm mx-auto md:mx-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/emmanuel.jpg"
                alt="Emmanuel Ariyo — Ememzyvisuals"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent pointer-events-none" />
            </div>

            {/* Available badge */}
            <div className="absolute bottom-5 left-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/90 backdrop-blur-sm border border-border shadow-card text-sm font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Available for work
            </div>
          </motion.div>

          {/* Intro text */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="space-y-5"
          >
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-[0.15em]">
              <Sparkles size={12} />
              About Me
            </div>

            <h1
              className="font-extrabold text-foreground leading-[1.05]"
              style={{ fontSize: "clamp(2.2rem, 6vw, 3.8rem)", letterSpacing: "-0.04em" }}
            >
              Emmanuel Ariyo.
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Self-taught Creative Software Developer and AI Systems Engineer
              based in Nigeria. I build scalable web applications, AI-powered
              systems, and automation tools that solve real problems.
            </p>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin size={14} />
              Nigeria · Available worldwide
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/contact" className="btn-primary group text-sm">
                Work With Me
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/work" className="btn-outline text-sm">
                See My Work
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container-padded"><div className="section-divider" /></div>

      {/* ── My Story ────────────────────────────────────────────── */}
      <div className="container-padded">
        <div className="max-w-2xl space-y-8">
          <motion.div {...fadeUp} transition={{ duration: 0.5 }}>
            <h2 className="section-heading">My Story.</h2>
          </motion.div>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-5 text-muted-foreground leading-relaxed text-[16px]"
          >
            <p>
              I never went to a university for computer science. I never attended
              a bootcamp. Everything I know about software development, AI systems,
              and building products — I taught myself.
            </p>
            <p>
              I started with the basics. HTML, CSS, JavaScript. The free tutorials,
              the documentation, the trial and error at 2am. No structured curriculum.
              No professor to ask. Just curiosity and a stubborn refusal to stay confused
              about anything for long.
            </p>
            <p>
              What changed everything was shipping my first real project. Not a tutorial
              clone. Not a demo. Something real that other people could use. The feedback
              loop of building something, watching people use it, and understanding what
              actually matters — that became my education.
            </p>
            <p>
              Today I build production-grade platforms, AI systems, and automation
              tools used by real users. I published a benchmark on Kaggle that
              contributes to AI safety research. I built a multi-agent AI platform,
              a streaming and academy product, a fintech simulation, and offline-first
              PWAs for Nigerian students — all self-taught, all shipped.
            </p>
            <p>
              Being self-taught isn&apos;t a gap in my background. It&apos;s the most
              important thing about how I work. I learned to figure things out. I
              learned to read documentation. I learned that the only thing between
              where I am and where I want to be is whether I&apos;m willing to sit
              with the discomfort of not knowing something yet.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container-padded"><div className="section-divider" /></div>

      {/* ── What I Do ───────────────────────────────────────────── */}
      <div className="container-padded space-y-10">
        <motion.h2
          {...fadeUp}
          transition={{ duration: 0.5 }}
          className="section-heading"
        >
          What I Do.
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              icon: Code,
              title: "Build Websites & Web Apps",
              desc: "Premium websites, SaaS platforms, e-commerce stores, and full-stack applications. From landing pages to complex multi-user systems — built clean, fast, and ready for production.",
              iconBg: "bg-blue-50 dark:bg-blue-950",
              iconColor: "text-blue-600 dark:text-blue-400",
            },
            {
              icon: Brain,
              title: "Engineer AI Systems & Models",
              desc: "AI-powered applications using Groq API, LLaMA, RAG pipelines, and multi-agent architectures. I also build and publish open-source AI models — Africlaude (language model series) and NaijaVox (Nigerian speech recognition) — under Axiveri, my African AI research initiative.",
              iconBg: "bg-violet-50 dark:bg-violet-950",
              iconColor: "text-violet-600 dark:text-violet-400",
            },
            {
              icon: Zap,
              title: "Automate Business Processes",
              desc: "Telegram bots, WhatsApp automation, AI agents, and workflow systems. Lumeo AI handles thousands of Telegram interactions. Microdragon executes complex real-world tasks from natural language.",
              iconBg: "bg-amber-50 dark:bg-amber-950",
              iconColor: "text-amber-600 dark:text-amber-400",
            },
          ].map(({ icon: Icon, title, desc, iconBg, iconColor }, i) => (
            <motion.div
              key={title}
              {...fadeUp}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card-surface p-6 space-y-4"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
                <Icon size={18} className={iconColor} />
              </div>
              <h3 className="font-extrabold text-foreground leading-tight">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="container-padded"><div className="section-divider" /></div>

      {/* ── AI & ML Research ─────────────────────────────────── */}
      <div className="container-padded space-y-8">
        <motion.div {...fadeUp} transition={{ duration: 0.5 }}>
          <h2 className="section-heading">AI Research.</h2>
          <p className="text-muted-foreground mt-3 text-lg max-w-2xl">
            Beyond building products, I conduct open-source AI research under{" "}
            <a href="/axiveri" className="text-foreground font-bold hover:underline underline-offset-4">Axiveri</a> —
            my African AI research initiative.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5 max-w-3xl">
          {[
            {
              title: "Africlaude — Language Model Series",
              desc: "Open-source language models built for African contexts. Africlaude-7B is live on HuggingFace. v2 with Yoruba, Igbo, and Hausa support is in development.",
              link: "/axiveri/africlaude",
              badge: "Live",
            },
            {
              title: "NaijaVox — Speech Recognition",
              desc: "Nigerian speech recognition (ASR) model series. NaijaVox-V1 supports Yoruba, Hausa, Igbo, Nigerian Pidgin, and Nigerian Accented English.",
              link: "https://huggingface.co/Axiveri/Naijavox-V1",
              badge: "Live",
            },
            {
              title: "TruthGuard Benchmark",
              desc: "A 120-question confidence calibration benchmark for evaluating the metacognitive abilities of LLMs. Published on Kaggle, open-source under CC BY-SA 4.0.",
              link: "https://www.kaggle.com/code/ememzyvisuals/truthguard-benchmark-metacognition-evaluation",
              badge: "Published",
            },
            {
              title: "ML Engineering Stack",
              desc: "Jupyter Notebooks, HuggingFace Transformers, Datasets, Gradio, PyTorch, GPU/CUDA training, pipeline filtering, data curation, web scraping for dataset building.",
              link: null,
              badge: "Core Skills",
            },
          ].map(({ title, desc, link, badge }, i) => (
            <motion.div
              key={title}
              {...fadeUp}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="card-surface p-6 space-y-3"
            >
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-lg bg-foreground text-background uppercase tracking-widest">
                  {badge}
                </span>
              </div>
              <h3 className="font-extrabold text-foreground leading-tight">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              {link && (
                <a href={link} target={link.startsWith("http") ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground hover:opacity-70 transition-opacity">
                  View → 
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="container-padded"><div className="section-divider" /></div>

      {/* ── Values ──────────────────────────────────────────────── */}
      <div className="container-padded space-y-10">
        <motion.h2
          {...fadeUp}
          transition={{ duration: 0.5 }}
          className="section-heading"
        >
          How I Work.
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl">
          {[
            { title: "Ship before it's perfect", desc: "Real users teach you more in one week than months of planning. I build, ship, and improve from feedback." },
            { title: "Build for real constraints", desc: "Most of my work is built for users on slow networks and low-end devices. Those constraints make everything better." },
            { title: "Understand your tools deeply", desc: "I don't use what I don't understand. When something breaks at 11pm before a deadline, mystery code is your enemy." },
            { title: "AI as leverage, not replacement", desc: "AI eliminates the boring repetitive parts so I can spend energy on architecture, user experience, and the logic that makes a product unique." },
          ].map(({ title, desc }, i) => (
            <motion.div
              key={title}
              {...fadeUp}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="card-surface p-6 space-y-2 border-l-2 border-foreground/20"
            >
              <h3 className="font-extrabold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="container-padded"><div className="section-divider" /></div>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <div className="container-padded">
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5 }}
          className="rounded-2xl bg-foreground text-background p-10 md:p-14 text-center space-y-5 max-w-2xl mx-auto"
        >
          <h2
            className="font-extrabold leading-tight"
            style={{ fontSize: "clamp(1.8rem, 5vw, 3rem)", letterSpacing: "-0.04em" }}
          >
            Let&apos;s build something.
          </h2>
          <p className="text-background/70 leading-relaxed">
            Open to freelance contracts, full-time roles, and interesting
            collaborations. If you have a project in mind, I&apos;d love to hear about it.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-background text-foreground font-bold text-sm hover:opacity-90 transition-opacity"
            >
              Get In Touch <ArrowRight size={14} />
            </Link>
            <Link
              href="/work"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border-2 border-background/30 text-background font-bold text-sm hover:border-background/60 transition-colors"
            >
              View My Work
            </Link>
          </div>
        </motion.div>
      </div>

    </div>
  );
}
