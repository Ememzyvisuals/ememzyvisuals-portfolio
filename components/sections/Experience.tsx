"use client";
// components/sections/Experience.tsx
// Editorial timeline: each role is a row with the company's real mark, the period, the role and what I actually did.

import Image from "next/image";
import { motion } from "framer-motion";

type Job = {
  id: string;
  role: string;
  company: string;
  period: string;
  where: string;
  current?: boolean;
  mark: { src?: string; bg: string; fg?: string; text?: string };
  summary: string;
  did: string[];
};

const JOBS: Job[] = [
  {
    id: "plotweaver",
    role: "Machine Learning Engineer",
    company: "PlotWeaver",
    period: "Aug 2026, now",
    where: "Remote",
    current: true,
    mark: { src: "/brand/plotweaver-icon.svg", bg: "#c4f000" },
    summary:
      "I work on speech AI for African languages: voices that carry emotion and expression, and that can hold a real conversation instead of reading text out flat.",
    did: [
      "Text to speech in Nigerian English, Yoruba, Hausa, Igbo and Nigerian Pidgin, including voice cloning across them",
      "Speech recognition fine-tuned on noisy, code-switched speech so it holds up outside a quiet studio",
      "Translation between English and the four Nigerian languages",
      "Streaming APIs that let voice agents and live apps use the models in real time",
    ],
  },
  {
    id: "axiveri",
    role: "Founder",
    company: "Axiveri",
    period: "Ongoing",
    where: "Open source",
    current: true,
    mark: { src: "/brand/axiveri.png", bg: "#ffffff" },
    summary:
      "An open research lab on Hugging Face. I publish the models and datasets so other builders can start from something that already understands African speech.",
    did: [
      "NaijaVox 2.0, a speech recognition model for Nigerian languages and accents",
      "WazobiaVoice and Renpiper, text to speech for several Nigerian languages and Pidgin",
      "Open speech datasets that other teams download and train on every month",
    ],
  },
  {
    id: "renncora",
    role: "AI Engineer",
    company: "Renncora",
    period: "Contract",
    where: "Remote",
    mark: { src: "/brand/renncora.png", bg: "#ffffff" },
    summary:
      "Renncora is a growing social platform. I built them a speech to speech system for Nigerian Pidgin: you speak Pidgin, it answers back in a natural Pidgin voice.",
    did: [
      "Real time pipeline from speech in to speech out",
      "A reply voice tuned to sound like a person, not a reader",
    ],
  },
];

function Mark({ m, name }: { m: Job["mark"]; name: string }) {
  return (
    <span
      className="grid h-14 w-14 flex-shrink-0 place-items-center overflow-hidden rounded-2xl border border-border md:h-16 md:w-16"
      style={{ background: m.bg }}
    >
      {m.src ? (
        <Image src={m.src} alt={`${name} logo`} width={40} height={40} className="h-8 w-auto object-contain md:h-9" />
      ) : (
        <span className="font-display text-2xl font-extrabold" style={{ color: m.fg }}>{m.text}</span>
      )}
    </span>
  );
}

export function Experience() {
  return (
    <section id="experience" className="py-section">
      <div className="container-padded">
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <h2 className="section-heading">Experience.</h2>
            <p className="font-museum mt-3 max-w-xl text-xl text-foreground/75 md:text-2xl">
              Teaching machines to hear and speak African languages, in production.
            </p>
          </div>
        </div>

        <ol className="mt-12 border-t border-border">
          {JOBS.map((job, i) => (
            <motion.li
              key={job.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="grid gap-6 border-b border-border py-10 md:grid-cols-[220px_1fr] md:gap-12 md:py-14"
            >
              <div className="flex items-center gap-4 md:flex-col md:items-start">
                <Mark m={job.mark} name={job.company} />
                <div>
                  <p className="font-display text-lg font-bold text-foreground">{job.period}</p>
                  <p className="text-sm text-muted-foreground">
                    {job.where}
                    {job.current && <span className="ml-2 font-semibold text-brand">Current</span>}
                  </p>
                </div>
              </div>

              <div className="min-w-0">
                <h3 className="font-display text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
                  {job.role}
                </h3>
                <p className="font-museum mt-1 text-xl text-foreground/70">{job.company}</p>
                <p className="mt-5 max-w-4xl text-[15px] leading-relaxed text-foreground/80 md:text-base">{job.summary}</p>
                <ul className="mt-6 grid gap-x-10 sm:grid-cols-2">
                  {job.did.map((d) => (
                    <li key={d} className="border-t border-border py-3 text-sm leading-relaxed text-foreground/85">
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
