"use client";
// components/sections/Automation.tsx

import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Terminal, Bot, Mic, Github } from "lucide-react";

const AUTOMATION_PROJECTS = [
  {
    id: "lumeo",
    title: "Lumeo AI",
    subtitle: "Intelligent Telegram Automation Bot",
    description:
      "A full-featured AI assistant inside Telegram. Image generation, media downloads, voice notes, PDF creation, group management, Mini App with games, and a Telegram Stars payment system.",
    icon: Bot,
    iconBg: "bg-brand-soft",
    iconColor: "text-brand",
    accentColor: "border-l-sun",
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
      "A Distributed Intelligence Network and Cognitive Autonomous Worker. Executes complex real-world tasks from natural language, code generation, cybersecurity auditing, desktop automation, and more.",
    icon: Terminal,
    iconBg: "bg-brand-soft",
    iconColor: "text-brand",
    accentColor: "border-l-sun",
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
  {
    id: "wazobiavoice-inference",
    title: "WazobiaVoice Inference",
    subtitle: "Nigerian Multilingual TTS & Voice Cloning",
    description:
      "Production inference code for WazobiaVoice, a ~2B-parameter multilingual TTS and zero-shot voice cloning model covering Yoruba, Hausa, Igbo, Nigerian Pidgin, and Nigerian English, built by Axiveri.",
    icon: Mic,
    iconBg: "bg-brand-soft",
    iconColor: "text-brand",
    accentColor: "border-l-sun",
    techStack: ["PyTorch", "Chatterbox Architecture", "Groq", "Python"],
    links: {
      github: "https://github.com/Ememzyvisuals/wazobiavoice-TTS",
    },
    highlights: [
      "5 Nigerian languages, one set of weights",
      "Zero-shot cross-lingual voice cloning",
      "Extended Chatterbox for Yoruba tonal diacritics",
      "Model weights on HuggingFace via Axiveri",
    ],
  },
];

export function AutomationSection({ page = false }: { page?: boolean } = {}) {
  return (
    <section id="automation" className={page ? "pb-section pt-12 md:pt-16" : "py-section"}>
      <div className="container-padded space-y-stack">

        <SectionHeader
          as={page ? "h1" : "h2"}
          title="Automation"
          intro="AI agents and autonomous systems that carry out real tasks from start to finish."
          action={page ? undefined : <Link href="/automation" className="btn-outline">See all automation work</Link>}
        />

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {AUTOMATION_PROJECTS.map((project, i) => {
            const Icon = project.icon;
            return (
              <article
                key={project.id}
               
               
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
                      <p className="text-caption text-muted-foreground mt-0.5">
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
                        className="inline-flex h-9 items-center rounded-full border border-border px-3.5 text-caption font-semibold text-foreground hover:border-foreground transition-colors"
                      >
                        Live
                      </a>
                    )}
                    {project.links.github && (
                      <a
                        href={project.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.title} on GitHub`}
                        className="grid h-9 w-9 place-items-center rounded-full border border-border text-foreground hover:border-foreground transition-colors"
                      >
                        <Github size={16} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-small text-muted-foreground">
                  {project.description}
                </p>

                {/* Highlights */}
                <ul className="space-y-1.5">
                  {project.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2 text-small text-foreground">
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
                    > npm
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
