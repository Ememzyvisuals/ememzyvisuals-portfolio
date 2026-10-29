import type { Metadata } from "next";
import Image from "next/image";
import { games } from "@/content/site";
import { Arrow, Ext, SectionHead } from "@/components/ui";
import GamesHero from "@/components/work/GamesHero";

export const metadata: Metadata = {
  title: "Games",
  description: "Free browser games set in Nigeria: Bùkà Hustle, a restaurant business sim, and LAST BUS, a first-person horror on the last danfo to Ikorodu.",
};

export default function Games() {
  return (
    <div className="pb-10 pt-28 sm:pt-36">
      <div className="page grid items-center gap-6 lg:grid-cols-[1fr_1fr]">
        <SectionHead
          kicker="Games"
          title={<>Games set<br />in Nigeria.</>}
          sub="I design them, model and animate the characters in Blender, and build them for the browser in three.js. Free, no download, no forced ads."
        />
        <GamesHero />
      </div>
      <div className="page mt-10 space-y-6">
        {games.map((g) => (
          <article key={g.slug} id={g.slug} className="glass grid overflow-hidden rounded-xl3 lg:grid-cols-[1.1fr_1fr]">
            <div className="relative min-h-[260px]" style={{ background: `radial-gradient(120% 120% at 30% 20%, ${g.tone}66, transparent 60%), #0b0b0c` }}>
              {g.image ? (
                <Image src={g.image} alt={`${g.name} key art`} fill sizes="(min-width:1024px) 55vw, 100vw" className="object-cover" />
              ) : (
                <div className="absolute inset-0 grid place-items-center p-8 text-center">
                  <div>
                    <p className="font-display text-[clamp(2.6rem,6vw,4.8rem)] font-extrabold leading-none tracking-tight text-white">{g.name}</p>
                    <p className="mt-4 font-mono text-sm tracking-widest text-white/60">11:42 PM · YABA TO IKORODU</p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col p-6 sm:p-10">
              <p className="kicker">{g.genre}</p>
              <h2 className="mt-2 text-4xl font-bold">{g.name}</h2>
              <p className="mt-3 text-lg">{g.line}</p>
              <p className="mt-3 text-fg/75">{g.body}</p>
              <ul className="mt-5 space-y-2 text-sm text-fg/80">
                {g.facts.map((f) => <li key={f} className="flex gap-3"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-fg/60" />{f}</li>)}
              </ul>
              <div className="mt-auto flex flex-wrap items-center gap-4 pt-8">
                <a href={g.play} target="_blank" rel="noopener noreferrer" className="btn-solid">Play free <Arrow /></a>
                {g.links.map((l) => <Ext key={l.href} href={l.href} className="text-sm">{l.label}</Ext>)}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
