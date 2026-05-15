"use client";
// components/sections/Hero.tsx

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Globe, Bot, Zap } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

// These scroll-through words cover every intent type
const SERVICE_PILLS = [
  { icon: Globe, label: "Premium Websites" },
  { icon: Sparkles, label: "AI Systems" },
  { icon: Zap, label: "Business Automation" },
  { icon: Bot, label: "Telegram & WhatsApp Bots" },
];

export function Hero() {
  return (
    <section className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">

      {/* Subtle grid */}
      <div className="absolute inset-0 bg-grid-pattern dark:bg-grid-pattern-dark opacity-60 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto space-y-8">

        {/* Available badge */}
        <motion.div
          variants={fadeUp} initial="initial" animate="animate"
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-background/80 backdrop-blur-sm text-sm text-muted-foreground shadow-card">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Available for new projects — worldwide
          </div>
        </motion.div>

        {/* Main headline */}
        <motion.div
          variants={fadeUp} initial="initial" animate="animate"
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-1"
        >
          <h1 className="text-[clamp(2.8rem,8.5vw,6.5rem)] font-bold tracking-tight leading-[1.02] text-foreground">
            Hi. I&apos;m Emmanuel.
          </h1>
          <h2 className="text-[clamp(1.6rem,5vw,3.8rem)] font-bold tracking-tight leading-[1.08] text-foreground">
            I build websites, AI systems
          </h2>
          <h2 className="text-[clamp(1.6rem,5vw,3.8rem)] font-bold tracking-tight leading-[1.08] text-muted-foreground">
            & business automation.
          </h2>
        </motion.div>

        {/* Subheadline — speaks to client intent */}
        <motion.p
          variants={fadeUp} initial="initial" animate="animate"
          transition={{ duration: 0.6, delay: 0.35 }}
          className="max-w-xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed"
        >
          Need a high-quality website, an AI-powered product, or automation
          that saves your business hours every week? Let&apos;s build it.
        </motion.p>

        {/* Service pills */}
        <motion.div
          variants={fadeUp} initial="initial" animate="animate"
          transition={{ duration: 0.5, delay: 0.42 }}
          className="flex flex-wrap items-center justify-center gap-2"
        >
          {SERVICE_PILLS.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-secondary text-xs font-medium text-muted-foreground"
            >
              <Icon size={11} />
              {label}
            </div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          variants={fadeUp} initial="initial" animate="animate"
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link href="/services" className="btn-primary group">
            See What I Build
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/work" className="btn-outline">
            View Projects
          </Link>
          <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors px-2">
            Start a Project →
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={fadeUp} initial="initial" animate="animate"
          transition={{ duration: 0.5, delay: 0.65 }}
          className="flex flex-wrap items-center justify-center gap-8 pt-4"
        >
          {[
            { value: "10+", label: "Projects Shipped" },
            { value: "3+", label: "AI Systems Built" },
            { value: "1", label: "Published AI Benchmark" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-1.5">
          <p className="text-xs text-muted-foreground/60">scroll</p>
          <div className="w-px h-8 bg-gradient-to-b from-border to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}
