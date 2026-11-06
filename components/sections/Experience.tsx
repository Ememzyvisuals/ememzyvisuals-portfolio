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

const BRAND: Record<string, { bg: string; ink: string; pill: string; tile: string; tileInk: string; glow: string; full?: boolean }> = {
  plotweaver: { bg: "linear-gradient(165deg,#d6ff3a,#a8d400)", ink: "#0e1a17", pill: "rgba(14,26,23,.1)", tile: "#ffffff", tileInk: "#c4f000", glow: "rgba(255,255,255,.35)" },
  axiveri: { bg: "linear-gradient(165deg,#ff7a1a,#d94f00)", ink: "#ffffff", pill: "rgba(255,255,255,.16)", tile: "#ffffff", tileInk: "#d94f00", glow: "rgba(255,255,255,.18)", full: true },
  renncora: { bg: "linear-gradient(165deg,#e21fe2,#8a0a9a)", ink: "#ffffff", pill: "rgba(255,255,255,.16)", tile: "#ffffff", tileInk: "#8a0a9a", glow: "rgba(255,255,255,.18)" },
};

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

        {/* one card per company, side by side, each in that company's own colours with its mark on top */}
        <ol className="mx-auto mt-14 grid max-w-7xl gap-6 lg:grid-cols-3">
          {JOBS.map((job, i) => {
            const c = BRAND[job.id];
            return (
              <motion.li
                key={job.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: i * 0.12, ease: [0.2, 0.75, 0.2, 1] }}
                className="relative flex flex-col overflow-hidden rounded-[32px] p-8 text-center transition-transform duration-500 hover:-translate-y-1.5 md:p-10"
                style={{ background: c.bg, color: c.ink }}
              >
                <span aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full" style={{ background: c.glow }} />
                <span className="relative mx-auto grid h-20 w-20 place-items-center overflow-hidden rounded-[24px]" style={{ background: c.full ? "transparent" : c.tile, boxShadow: c.full ? "none" : "0 14px 30px -12px rgba(0,0,0,.45)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.full ? "/brand/axiveri-mono.png" : job.mark.src} alt={`${job.company} logo`} className={c.full ? "h-16 w-auto object-contain" : "h-11 w-auto object-contain"} />
                </span>
                <div className="relative mt-6 flex flex-wrap items-center justify-center gap-2">
                  <span className="rounded-full px-3 py-1 text-[13px] font-bold" style={{ background: c.pill, color: c.ink }}>{job.period}</span>
                  <span className="rounded-full px-3 py-1 text-[13px] font-semibold" style={{ background: c.pill, color: c.ink }}>{job.where}</span>
                  {job.current && <span className="rounded-full px-3 py-1 text-[13px] font-extrabold" style={{ background: c.ink, color: c.tileInk }}>Current</span>}
                </div>
                <h3 className="relative mt-5 font-display text-3xl font-extrabold leading-tight tracking-tight">{job.role}</h3>
                <p className="relative mt-1 text-lg font-bold opacity-80">{job.company}</p>
                <p className="relative mt-4 text-[15px] font-medium leading-relaxed opacity-85">{job.summary}</p>
                <ul className="relative mt-6 grid gap-2">
                  {job.did.map((d) => (
                    <li key={d} className="rounded-2xl px-4 py-3 text-[14px] font-semibold leading-relaxed" style={{ background: c.pill }}>{d}</li>
                  ))}
                </ul>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
