"use client";
// components/sections/Benchmarks.tsx

import { motion } from "framer-motion";
import Link from "next/link";
import { FlaskConical, Database, ExternalLink, BarChart3, BookOpen } from "lucide-react";

export function BenchmarkSection() {
  return (
    <section id="benchmarks" className="py-section bg-[hsl(var(--section-alt))]">
      <div className="container-padded space-y-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <h2 className="section-heading">Benchmarks.</h2>
            <p className="text-muted-foreground mt-3 text-lg max-w-md">
              AI evaluation research and LLM testing infrastructure I&apos;ve published.
            </p>
          </div>
          <Link href="/benchmarks" className="btn-outline self-start text-sm">
            View Research
          </Link>
        </motion.div>

        {/* TruthGuard — Featured Benchmark */}
        <motion.article
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="card-surface overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* Left — Info */}
            <div className="p-8 md:p-10 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-xl bg-violet-50 dark:bg-violet-950">
                    <FlaskConical size={18} className="text-violet-600 dark:text-violet-400" />
                  </div>
                  <span className="pill text-xs">
                    Metacognition Track · AGI Cognitive Abilities
                  </span>
                </div>
                <h3 className="text-3xl font-bold tracking-tight">TruthGuard</h3>
                <p className="text-muted-foreground text-base leading-relaxed">
                  A 120-question confidence calibration benchmark designed to evaluate
                  the metacognitive abilities of Large Language Models. Measures how
                  accurately models align stated confidence with actual correctness —
                  exposing metacognitive overconfidence in AI systems.
                </p>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: "120", label: "Questions" },
                  { value: "3", label: "Difficulty Tiers" },
                  { value: "CC BY-SA 4.0", label: "License" },
                ].map((m) => (
                  <div key={m.label} className="space-y-0.5">
                    <p className="text-xl font-bold text-foreground">{m.value}</p>
                    <p className="text-xs text-muted-foreground">{m.label}</p>
                  </div>
                ))}
              </div>

              {/* Difficulty tiers */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Question Tiers
                </p>
                <div className="flex gap-2 flex-wrap">
                  {["Easy", "Tricky", "Hard (Trap)"].map((tier) => (
                    <span key={tier} className="tech-badge font-medium">{tier}</span>
                  ))}
                </div>
              </div>

              {/* Tech stack */}
              <div className="flex flex-wrap gap-1.5">
                {["Python", "Pandas", "NumPy", "Matplotlib", "Seaborn", "Kaggle"].map((t) => (
                  <span key={t} className="tech-badge">{t}</span>
                ))}
              </div>

              {/* Links */}
              <div className="flex items-center gap-3 flex-wrap pt-1">
                <a
                  href="https://www.kaggle.com/code/ememzyvisuals/truthguard-benchmark-metacognition-evaluation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-sm"
                >
                  <BookOpen size={15} />
                  View Notebook
                </a>
                <a
                  href="https://www.kaggle.com/datasets/ememzyvisuals/truthguard-benchmark-metacognition"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline text-sm"
                >
                  <Database size={14} />
                  Dataset
                </a>
              </div>
            </div>

            {/* Right — Visual */}
            <div className="bg-secondary border-l border-border p-8 md:p-10 flex flex-col justify-center gap-6">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                What It Measures
              </p>

              {[
                {
                  icon: BarChart3,
                  title: "Calibration Error",
                  desc: "Measures the gap between stated confidence and actual accuracy",
                },
                {
                  icon: FlaskConical,
                  title: "Overconfidence Analysis",
                  desc: "Identifies systematic overconfidence patterns in frontier models",
                },
                {
                  icon: Database,
                  title: "Cross-Difficulty Correlation",
                  desc: "Tracks confidence-accuracy alignment across Easy, Tricky, and Trap tiers",
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex gap-4">
                  <div className="p-2 rounded-lg bg-background border border-border flex-shrink-0 h-fit">
                    <Icon size={15} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}

              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Contributes to the AI safety and alignment field by providing a
                  practical tool for improving model calibration. Open dataset available
                  for the research community.
                </p>
              </div>
            </div>
          </div>
        </motion.article>
      </div>
    </section>
  );
}
