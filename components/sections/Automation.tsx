"use client";
// components/sections/Automation.tsx

import { motion } from "framer-motion";
import Link from "next/link";
import { Terminal, Bot, ArrowUpRight, Github, ExternalLink } from "lucide-react";

const AUTOMATION_PROJECTS = [
  {
    id: "lumeo",
    title: "Lumeo AI",
    subtitle: "Intelligent Telegram Automation Bot",
    description:
      "A full-featured AI assistant inside Telegram. Image generation, media downloads, voice notes, PDF creation, group management, Mini App with games, and a Telegram Stars payment system.",
    icon: Bot,
    iconBg: "bg-blue-50 dark:bg-blue-950",
    iconColor: "text-blue-600 dark:text-blue-400",
    accentColor: "border-blue-200 dark:border-blue-800",
    techStack: ["Python", "Groq API", "python-telegram-bot", "Docker"],
    links: {
      live: "https://t.me/lumeoai_bot",
      github: "https://github.com/Ememzyvisuals/lumeo-tel-bot",
    },
    highlights: [
      "Advanced conversational AI assistant",
      "Docker sandboxed execution",
      "Secure private file browsing",
      "Agentic tool orchestration",
    ],
  },
  {
    id: "microdragon",
    title: "Microdragon",
    subtitle: "Local-First CLI AI Agent",
    description:
      "A Distributed Intelligence Network and Cognitive Autonomous Worker. Executes complex real-world tasks from natural language — code generation, cybersecurity auditing, desktop automation, and more.",
    icon: Terminal,
    iconBg: "bg-cyan-50 dark:bg-cyan-950",
    iconColor: "text-cyan-600 dark:text-cyan-400",
    accentColor: "border-cyan-200 dark:border-cyan-800",
    techStack: ["Rust", "Python", "Node.js", "Ollama", "Playwright"],
    links: {
      github: "https://github.com/Ememzyvisuals/microdragon",
      npm: "https://npmjs.com/package/@ememzyvisuals/microdragon",
    },
    highlights: [
      "Dragon Harness 7-layer amplification",
      "9-Phase execution pipeline",
      "Local-first (Ollama) + cloud providers",
      "Published on npm",
    ],
  },
];

export function AutomationSection() {
  return (
    <section id="automation" className="py-section">
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
            <h2 className="section-heading">Automation.</h2>
            <p className="text-muted-foreground mt-3 text-lg max-w-md">
              AI agents and autonomous systems that execute real-world tasks end-to-end.
            </p>
          </div>
          <Link href="/automation" className="btn-outline self-start text-sm">
            Explore All
          </Link>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {AUTOMATION_PROJECTS.map((project, i) => {
            const Icon = project.icon;
            return (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`card-surface p-6 space-y-5 border-l-2 ${project.accentColor}`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${project.iconBg}`}>
                      <Icon size={20} className={project.iconColor} />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">{project.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {project.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {project.links.live && (
                      <a
                        href={project.links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                    {project.links.github && (
                      <a
                        href={project.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Github size={14} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {project.description}
                </p>

                {/* Highlights */}
                <ul className="space-y-1.5">
                  {project.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2 text-sm text-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-foreground/40 flex-shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>

                {/* Tech */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {project.techStack.map((t) => (
                    <span key={t} className="tech-badge">{t}</span>
                  ))}
                  {project.links.npm && (
                    <a
                      href={project.links.npm}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tech-badge flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                      <ArrowUpRight size={11} />
                      npm
                    </a>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
