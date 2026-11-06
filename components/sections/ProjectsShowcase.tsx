"use client";
// components/sections/ProjectsShowcase.tsx
// Each project on its own laptop and phone (Emmanuel's Jagora devices), with its details beside it.
// Tap the laptop: the lid closes, it turns round and opens again. Tap the phone: it shows its back, then returns.

import Image from "next/image";
import Link from "next/link";
import { Github } from "lucide-react";
import { Devices3D } from "@/components/three/devices/Devices3D";
import { ALL_PROJECTS } from "@/data/projects";
import { ProjReveal } from "./ProjReveal";

// projects that have both a desktop and a mobile screen in /public/shots
const ON_DEVICES = ["claudgpt", "aethlife", "flonextv", "naijaprep", "studenthub", "nairanest", "storejet", "artoluwani"];
const SHOT: Record<string, string> = { studenthub: "studenthub", artoluwani: "artoluwani" };
// each project's own colour: a soft gradient behind its devices and its name in a deeper shade of the same colour
const LOOK: Record<string, { bg: string; word: string; name?: string }> = {
  claudgpt: { bg: "linear-gradient(160deg,#f3e6d3,#d9c3a3)", word: "rgba(120,84,40,.22)" },
  aethlife: { bg: "linear-gradient(160deg,#d8f3e6,#9fd8bf)", word: "rgba(20,110,72,.22)" },
  flonextv: { bg: "linear-gradient(160deg,#5c1620,#2a0a0f)", word: "rgba(255,120,130,.16)" },
  naijaprep: { bg: "linear-gradient(160deg,#d6efd2,#8fc98a)", word: "rgba(30,100,30,.22)" },
  studenthub: { bg: "linear-gradient(160deg,#d6e4ff,#94b3f2)", word: "rgba(30,60,150,.22)", name: "StudentHub" },
  nairanest: { bg: "linear-gradient(160deg,#f7e7b0,#d9b75a)", word: "rgba(120,86,10,.24)" },
  storejet: { bg: "linear-gradient(160deg,#3a2368,#1b0f33)", word: "rgba(190,160,255,.16)" },
  artoluwani: { bg: "linear-gradient(160deg,#f8d9e0,#e4a2b4)", word: "rgba(140,40,70,.22)", name: "Toluwani" },
};

export function ProjectsShowcase({ showAll = true }: { showAll?: boolean } = {}) {
  const items = ON_DEVICES.map((key) => ({
    key,
    p: ALL_PROJECTS.find((x) => x.slug === key || x.slug?.startsWith(key) || x.coverImage?.includes(`/${key}-`)),
  })).filter((i) => i.p);

  return (
    <section id="showcase" className="section-padding container-padded overflow-hidden">
      <ProjReveal />
      <div className="mb-14 text-center md:mb-20">
        <h2 className="section-heading">Built and shipped</h2>
        <p className="text-muted-foreground mx-auto mt-3 max-w-xl text-lg">
          Selected work: live products, each on its own screens. Drag or tap any of them.
        </p>
      </div>

      {/* a staggered two-column grid: each project a big rounded card in its own colour, its name huge and faded
          behind its devices, with the name, a line and its tags underneath */}
      <div className="mx-auto grid max-w-7xl gap-x-8 gap-y-16 md:grid-cols-2">
        {items.map(({ key, p }, i) => {
          const look = LOOK[key] ?? LOOK.claudgpt;
          return (
            <article key={key} className={`proj-row group min-w-0 ${i % 2 ? "md:mt-40" : ""}`}>
              <div className="proj-card relative overflow-hidden rounded-[32px]" style={{ background: look.bg }}>
                <p aria-hidden className="pointer-events-none absolute inset-x-0 top-[6%] select-none whitespace-nowrap text-center font-display font-extrabold leading-none tracking-[-0.05em]"
                  style={{ color: look.word, fontSize: "clamp(4rem, 9vw, 9rem)" }}>{look.name ?? p!.title}</p>
                <Devices3D
                  scene={`p:${SHOT[key] ?? key}`}
                  className="relative w-full min-w-0 aspect-[5/4]"
                  fallback={<Image src={`/shots/${key}.webp`} alt={`${p!.title} on a laptop`} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-contain p-10" />}
                />
              </div>
              <div className="proj-text mt-6 text-center">
                <h3 className="font-display text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">{p!.title}</h3>
                {p!.subtitle && <p className="mt-1 text-[16px] font-semibold text-muted-foreground">{p!.subtitle}</p>}
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <span className="rounded-full border border-border px-3 py-1 text-xs font-bold text-foreground/80">{p!.isMobilePrimary ? "Mobile app" : "Web app"}</span>
                  {p!.techStack?.slice(0, 3).map((t) => <span key={t} className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-foreground/70">{t}</span>)}
                </div>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                  {p!.liveUrl && <Link href={p!.liveUrl} target="_blank" rel="noopener noreferrer" className="rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-brand-foreground hover:opacity-85">Live site</Link>}
                  {p!.githubUrl && <Link href={p!.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-sm font-bold text-foreground hover:bg-secondary"><Github size={15} /> Code</Link>}
                </div>
              </div>
            </article>
          );
        })}
      </div>
      {showAll && <div className="mt-20 flex justify-center">
        <Link href="/work" className="btn-outline text-sm">See all projects</Link>
      </div>}
    </section>
  );
}
