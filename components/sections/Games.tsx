// components/sections/Games.tsx
// Two browser games, each with its key art and what makes it worth playing.
import Image from "next/image";
import Link from "next/link";
import { GAMES } from "@/data/extras";
import { SectionHeader } from "@/components/ui/SectionHeader";

const ART: Record<string, string> = {
  "buka-hustle": "/images/games/buka-hustle.webp",
  "last-bus": "/stills/game-bus.webp",
};

export function GamesSection() {
  return (
    <section id="games" className="py-section">
      <div className="container-padded">
        <SectionHeader
          title="Games"
          intro="Free browser games set in Nigeria. No download, no forced ads."
          action={<Link href="/games" className="btn-outline">Open the games page</Link>}
        />

        <div className="mt-stack grid gap-5 md:grid-cols-2">
          {GAMES.map((g) => (
            <article key={g.slug} className="card-surface flex flex-col">
              <div className={`relative aspect-[16/10] overflow-hidden border-b border-border ${g.slug === "last-bus" ? "bg-[#0b1020]" : "bg-sun-soft"}`}>
                <Image src={g.image ?? ART[g.slug]} alt={`${g.name} key art`} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col p-6 md:p-8">
                <p className="text-caption font-semibold text-sun-ink">{g.genre}</p>
                <h3 className="mt-2">{g.name}</h3>
                <p className="mt-3 text-body font-semibold text-foreground">{g.line}</p>
                <p className="mt-3 text-small text-muted-foreground">{g.body}</p>
                <ul className="mt-5 space-y-2 border-t border-border pt-5">
                  {g.facts.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-small text-foreground">
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-sun" aria-hidden />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-3 pt-7">
                  <a href={g.play} target="_blank" rel="noopener noreferrer" className="btn-primary">Play free</a>
                  {g.links.map((l) => (
                    <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="link-quiet text-small">
                      {l.label}
                    </a>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
