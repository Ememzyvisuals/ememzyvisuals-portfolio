"use client";
// components/sections/ProjectsShowcase.tsx
// Each project on its own laptop and phone (Emmanuel's Jagora devices), with its details beside it.
// Tap the laptop: the lid closes, it turns round and opens again. Tap the phone: it shows its back, then returns.

import Image from "next/image";
import Link from "next/link";
import { Github } from "lucide-react";
import { Devices3D } from "@/components/three/devices/Devices3D";
import { ALL_PROJECTS } from "@/data/projects";

// projects that have both a desktop and a mobile screen in /public/shots
const ON_DEVICES = ["claudgpt", "aethlife", "flonextv", "naijaprep", "studenthub", "nairanest", "storejet", "artoluwani"];
const SHOT: Record<string, string> = { studenthub: "studenthub", artoluwani: "artoluwani" };

export function ProjectsShowcase({ showAll = true }: { showAll?: boolean } = {}) {
  const items = ON_DEVICES.map((key) => ({
    key,
    p: ALL_PROJECTS.find((x) => x.slug === key || x.slug?.startsWith(key) || x.coverImage?.includes(`/${key}-`)),
  })).filter((i) => i.p);

  return (
    <section id="showcase" className="section-padding container-padded overflow-hidden">
      <div className="mb-14 md:mb-20">
        <h2 className="section-heading">Built and shipped</h2>
        <p className="text-muted-foreground mt-3 max-w-xl">
          Live products, each on its own screens. Tap the laptop or the phone, or drag to turn them.
        </p>
      </div>

      <div className="space-y-24 md:space-y-32">
        {items.map(({ key, p }, i) => {
          const flip = i % 2 === 1;
          return (
            <article
              key={key}
              className="grid gap-8 min-w-0 lg:grid-cols-2 lg:items-center lg:gap-14"
            >
              <div className={`min-w-0 order-2 ${flip ? "lg:order-2" : "lg:order-1"}`}>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {String(i + 1).padStart(2, "0")} &nbsp;/&nbsp; {p!.isMobilePrimary ? "Mobile app" : "Web app"}
                </div>
                <h3 className="mt-3 font-display text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
                  {p!.title}
                </h3>
                {p!.subtitle && <p className="font-museum mt-2 text-xl md:text-2xl text-foreground/80">{p!.subtitle}</p>}
                <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground max-w-xl">{p!.description}</p>
                {p!.techStack && (
                  <ul className="mt-6 flex flex-wrap gap-2 max-w-xl">
                    {p!.techStack.map((t) => (
                      <li key={t} className="rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground/80">
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  {p!.liveUrl && (
                    <Link
                      href={p!.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground hover:opacity-85"
                    >
                      Live site </Link>
                  )}
                  {p!.githubUrl && (
                    <Link
                      href={p!.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary"
                    >
                      <Github size={15} /> Code
                    </Link>
                  )}
                </div>
              </div>
              <div className={`min-w-0 order-1 ${flip ? "lg:order-1" : "lg:order-2"}`}>
                <Devices3D
                  scene={`p:${SHOT[key] ?? key}`}
                  className="relative w-full min-w-0 aspect-square sm:aspect-[5/3.4] min-h-[280px]"
                  fallback={
                    <Image src={`/shots/${key}.webp`} alt={`${p!.title} on a laptop`} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-contain" />
                  }
                />
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
