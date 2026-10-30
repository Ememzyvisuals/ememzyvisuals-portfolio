"use client";
// components/sections/Experience.tsx

import { motion } from "framer-motion";
import { Briefcase, MapPin } from "lucide-react";

const EXPERIENCE = [
  {
    id: "plotweaver",
    role: "Machine Learning Engineer",
    company: "Plotweaver",
    period: "Aug 2026 — Present",
    location: "Africa · Remote",
    current: true,
    summary:
      "Designing and developing multilingual Speech AI systems focused on African languages, with an emphasis on production-ready inference, real-time applications, and scalable API infrastructure.",
    highlights: [
      "Built multilingual TTS systems supporting Nigerian English, Yoruba, Hausa, Igbo, and Nigerian Pidgin",
      "Developed voice-cloning capabilities enabling cross-lingual speech generation across five Nigerian languages",
      "Engineered streaming-capable APIs for integrating speech models into voice agents and real-time applications",
      "Developed and fine-tuned multilingual ASR models with noise augmentation for real-world robustness",
      "Fine-tuned small and large Whisper-based architectures for Nigerian multilingual speech recognition",
      "Built machine translation systems supporting English ↔ Yoruba, Hausa, Igbo, and Nigerian Pidgin",
      "Contributed across the full Speech AI pipeline — training, evaluation, inference optimization, API engineering, and deployment",
    ],
    tags: ["Data Engineering", "Intelligence Systems"],
  },
  {
    id: "renncora",
    role: "AI Engineer",
    company: "Renncora",
    period: "Contract",
    location: "Remote",
    current: false,
    summary:
      "Renncora is a growing social media platform. Built and deployed a real-time speech-to-speech Nigerian Pidgin AI — speak Pidgin, get a natural, human-sounding Pidgin voice reply back.",
    highlights: [
      "Built and deployed a real-time speech-to-speech Nigerian Pidgin AI system",
      "Engineered natural, human-sounding voice output for conversational Pidgin interactions",
    ],
    tags: ["Speech AI", "Voice"],
  },
];

export function Experience() {
  return (
    <section id="experience" className="py-section">
      <div className="container-padded space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="section-heading">Experience.</h2>
          <p className="text-muted-foreground mt-3 text-lg max-w-md">
            Where I&apos;ve put Speech AI and ML into production.
          </p>
        </motion.div>

        <div className="space-y-5">
          {EXPERIENCE.map((job, i) => (
            <motion.article
              key={job.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card-surface p-6 md:p-8 space-y-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-secondary flex-shrink-0">
                    <Briefcase size={18} className="text-foreground" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-foreground">{job.role}</h3>
                    <p className="text-sm text-muted-foreground">{job.company}</p>
                  </div>
                </div>
                {job.current && (
                  <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-foreground text-background uppercase tracking-widest">
                    Current
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground font-medium">
                <span>{job.period}</span>
                <span className="flex items-center gap-1">
                  <MapPin size={11} /> {job.location}
                </span>
              </div>

              <p className="text-sm text-foreground/80 leading-relaxed">{job.summary}</p>

              <ul className="space-y-1.5">
                {job.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-sm text-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-foreground/40 flex-shrink-0 mt-2" />
                    {h}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {job.tags.map((t) => (
                  <span key={t} className="tech-badge">{t}</span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
