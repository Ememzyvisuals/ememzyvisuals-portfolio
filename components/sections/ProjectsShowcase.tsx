// components/sections/ProjectsShowcase.tsx
// Each shipped product with its real desktop and phone screens side by side, details beside them.
import Image from "next/image";
import Link from "next/link";
import { Github } from "lucide-react";
import { ALL_PROJECTS } from "@/data/projects";
import { SectionHeader } from "@/components/ui/SectionHeader";

// projects that have both a desktop and a mobile screen in /public/shots
const ON_DEVICES = ["claudgpt", "aethlife", "flonextv", "naijaprep", "studenthub", "nairanest", "storejet", "artoluwani"];

export function ProjectsShowcase({ showAll = true, page = false }: { showAll?: boolean; page?: boolean } = {}) {
  const items = ON_DEVICES.map((key) => ({
    key,
    p: ALL_PROJECTS.find((x) => x.slug === key || x.slug?.startsWith(key) || x.coverImage?.includes(`/${key}-`)),
  })).filter((i) => i.p);

  return (
    <section id="showcase" className={page ? "pb-section pt-12 md:pt-16" : "py-section"}>
      <div className="container-padded">
        <SectionHeader
          as={page ? "h1" : "h2"}
          title="Built and shipped"
          intro="Live products I designed, built and run, from AI tools to streaming, banking and exam prep."
          action={showAll ? <Link href="/work" className="btn-outline">See all projects</Link> : undefined}
        />

        <div className="mt-stack space-y-section-sm">
          {items.map(({ key, p }, i) => {
            const flip = i % 2 === 1;
            return (
              <article key={key} className="grid min-w-0 items-center gap-8 lg:grid-cols-12 lg:gap-8">
                <div className={`min-w-0 lg:col-span-5 ${flip ? "lg:order-2 lg:col-start-8" : "lg:order-1"}`}>
                  <p className="text-caption font-semibold text-sun-ink">{p!.isMobilePrimary ? "Mobile app" : "Web app"}</p>
                  <h3 className="mt-2">{p!.title}</h3>
                  {p!.subtitle && <p className="mt-2 text-lead font-medium text-foreground/85">{p!.subtitle}</p>}
                  <p className="mt-4 max-w-prose text-body text-muted-foreground">{p!.description}</p>
                  {p!.techStack && (
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {p!.techStack.map((t) => (
                        <li key={t} className="tech-badge">{t}</li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-7 flex flex-wrap items-center gap-3">
                    {p!.liveUrl && (
                      <a href={p!.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                        Visit live site
                      </a>
                    )}
                    {p!.githubUrl && (
                      <a href={p!.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-outline">
                        <Github size={16} aria-hidden /> View code
                      </a>
                    )}
                  </div>
                </div>

                <div className={`min-w-0 lg:col-span-7 ${flip ? "lg:order-1 lg:col-start-1" : "lg:order-2 lg:col-start-6"}`}>
                  <div className="relative pb-8 pr-6 sm:pb-10 sm:pr-10">
                    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lift">
                      <div className="flex h-8 items-center gap-1.5 border-b border-border px-3" aria-hidden>
                        <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
                        <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
                        <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
                      </div>
                      <div className="relative aspect-[1366/766]">
                        <Image src={`/shots/${key}.webp`} alt={`${p!.title} on desktop`} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover object-top" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 right-0 w-[22%] min-w-[84px] overflow-hidden rounded-[18px] border-[5px] border-foreground bg-foreground shadow-lift">
                      <div className="relative aspect-[720/1558] overflow-hidden rounded-[13px]">
                        <Image src={`/shots/${key}-m.webp`} alt={`${p!.title} on a phone`} fill sizes="200px" className="object-cover object-top" />
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
