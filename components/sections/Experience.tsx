"use client";
// components/sections/Experience.tsx
// Editorial timeline: each role is a row with the company's real mark, the period, the role and what I actually did.

import Image from "next/image";
import { SectionHeader } from "@/components/ui/SectionHeader";

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
        <span className="font-display text-h4 font-extrabold" style={{ color: m.fg }}>{m.text}</span>
      )}
    </span>
  );
}

export function Experience() {
  return (
    <section id="experience" className="py-section">
      <div className="container-padded">
        <SectionHeader title="Experience" intro="Teaching machines to hear and speak African languages, in production." />

        <ol className="mt-stack border-t border-border">
          {JOBS.map((job) => (
            <li
              key={job.id}
              className="grid gap-6 border-b border-border py-10 lg:grid-cols-12 lg:gap-8 md:py-14"
            >
              <div className="flex items-center gap-4 lg:col-span-3 lg:flex-col lg:items-start">
                <Mark m={job.mark} name={job.company} />
                <div>
                  <p className="text-small font-semibold text-foreground">{job.period}</p>
                  <p className="text-caption text-muted-foreground">
                    {job.where}
                    {job.current && <span className="ml-2 font-semibold text-sun-ink">Current</span>}
                  </p>
                </div>
              </div>

              <div className="min-w-0 lg:col-span-9">
                <h3>{job.role}</h3>
                <p className="mt-1 text-lead font-medium text-foreground/75">{job.company}</p>
                <p className="mt-5 max-w-prose text-body text-foreground/80">{job.summary}</p>
                <ul className="mt-6 grid gap-x-10 sm:grid-cols-2">
                  {job.did.map((d) => (
                    <li key={d} className="border-t border-border py-3 text-small text-foreground/85">
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
