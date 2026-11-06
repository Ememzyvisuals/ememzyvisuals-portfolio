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

const BRAND: Record<string, { bg: string; ink: string; pill: string; tile: string; tileInk: string; glow: string; full?: boolean; mark: string }> = {
  plotweaver: { bg: "linear-gradient(165deg,#d6ff3a,#a8d400)", ink: "#0e1a17", pill: "rgba(14,26,23,.14)", tile: "#ffffff", tileInk: "#c4f000", glow: "rgba(255,255,255,.35)", mark: "/brand/plotweaver-icon.svg" },
  axiveri: { bg: "linear-gradient(165deg,#ff7a1a,#d94f00)", ink: "#ffffff", pill: "rgba(255,255,255,.16)", tile: "#ffffff", tileInk: "#d94f00", glow: "rgba(255,255,255,.18)", full: true, mark: "/brand/axiveri-mono.png" },
  renncora: { bg: "linear-gradient(165deg,#e21fe2,#8a0a9a)", ink: "#ffffff", pill: "rgba(255,255,255,.2)", tile: "#ffffff", tileInk: "#8a0a9a", glow: "rgba(255,255,255,.18)", mark: "/brand/renncora-mono.png" },
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
        <ol className="mx-auto mt-14 grid max-w-7xl items-stretch gap-6 lg:grid-cols-3">
          {JOBS.map((job, i) => {
            const c = BRAND[job.id];
            return (
              <motion.li
                key={job.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: i * 0.12, ease: [0.2, 0.75, 0.2, 1] }}
                className="exp-card relative flex h-full flex-col overflow-hidden rounded-[32px] p-8 text-center transition-transform duration-500 hover:-translate-y-1.5 md:p-9"
                style={{ background: c.bg, color: c.ink }}
              >
                {/* the company's mark, large and faded in the corner, like a watermark on an ID card */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.mark} alt="" aria-hidden className="pointer-events-none absolute -bottom-10 -right-10 h-56 w-auto opacity-[0.09]" />

                {/* the company, as on its ID card: its mark with its name beside it */}
                <div className="relative flex items-center justify-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.mark} alt="" className="h-9 w-auto object-contain" />
                  <span className="font-display text-[26px] font-extrabold tracking-[-0.04em]">{job.company}</span>
                </div>
                <div className="relative mx-auto mt-6 h-px w-16" style={{ background: c.pill }} />

                <h3 className="relative mt-6 font-display text-[28px] font-extrabold leading-tight tracking-tight">{job.role}</h3>
                <div className="relative mt-3 flex flex-wrap items-center justify-center gap-2">
                  <span className="rounded-full px-3 py-1 text-[12.5px] font-bold" style={{ background: c.pill }}>{job.period}</span>
                  <span className="rounded-full px-3 py-1 text-[12.5px] font-semibold" style={{ background: c.pill }}>{job.where}</span>
                  {job.current && <span className="rounded-full px-3 py-1 text-[12.5px] font-extrabold" style={{ background: c.ink, color: c.tileInk }}>Current</span>}
                </div>
                <p className="relative mt-5 text-[15px] font-medium leading-relaxed opacity-90">{job.summary}</p>

                {/* what I did, as clean lines */}
                <ul className="relative mb-8 mt-6 w-full self-stretch text-[14px] font-semibold leading-snug">
                  {job.did.map((d) => (
                    <li key={d} className="border-t py-3" style={{ borderColor: c.pill }}>{d}</li>
                  ))}
                </ul>
                {/* the card's foot, at the bottom so all three line up */}
                <div className="relative mt-auto flex w-full items-center justify-between self-stretch border-t pt-4 text-[12px] font-extrabold uppercase tracking-[0.14em] opacity-80" style={{ borderColor: c.pill }}>
                  <span>{String(i + 1).padStart(2, "0")} / {String(JOBS.length).padStart(2, "0")}</span>
                  <span>{job.where}</span>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
