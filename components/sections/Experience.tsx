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
        <div className="text-center">
          <h2 className="section-heading">Experience</h2>
          <p className="font-museum mx-auto mt-3 max-w-xl text-xl text-foreground/75 md:text-2xl">
            Teaching machines to hear and speak African languages, in production.
          </p>
        </div>

        {/* a timeline down the middle: each role is a card on alternating sides, its company's mark sitting on the line */}
        <ol className="exp-line relative mx-auto mt-16 max-w-6xl">
          {JOBS.map((job, i) => {
            const right = i % 2 === 1;
            return (
              <motion.li
                key={job.id}
                initial={{ opacity: 0, x: right ? 60 : -60, y: 20 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.2, 0.75, 0.2, 1] }}
                className="relative grid gap-6 pb-16 last:pb-0 md:grid-cols-2 md:gap-20"
              >
                {/* the mark, on the line */}
                <div className="z-10 flex justify-center md:absolute md:left-1/2 md:top-6 md:-translate-x-1/2">
                  <span className="rounded-[22px] bg-background p-1.5 shadow-[0_0_0_1px_hsl(var(--border))]"><Mark m={job.mark} name={job.company} /></span>
                </div>
                <div className={right ? "md:col-start-2" : ""}>
                  <article className="card-surface group relative overflow-hidden p-7 text-center transition-transform duration-500 hover:-translate-y-1 md:p-9">
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <span className="rounded-full border border-border px-3 py-1 text-[13px] font-bold text-foreground">{job.period}</span>
                      <span className="rounded-full border border-border px-3 py-1 text-[13px] font-semibold text-muted-foreground">{job.where}</span>
                      {job.current && <span className="rounded-full bg-brand px-3 py-1 text-[13px] font-bold text-brand-foreground">Current</span>}
                    </div>
                    <h3 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">{job.role}</h3>
                    <p className="font-museum mt-1 text-xl text-foreground/70">{job.company}</p>
                    <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-foreground/80 md:text-base">{job.summary}</p>
                    <ul className="mx-auto mt-6 grid max-w-xl gap-2">
                      {job.did.map((d) => (
                        <li key={d} className="rounded-2xl bg-secondary/70 px-4 py-3 text-sm font-semibold leading-relaxed text-foreground/85">{d}</li>
                      ))}
                    </ul>
                  </article>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
