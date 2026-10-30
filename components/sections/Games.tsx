"use client";
// components/sections/Games.tsx
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Gamepad2 } from "lucide-react";
import { GAMES } from "@/data/extras";
import { GameStage } from "@/components/three/GameStage";

export function GamesSection() {
  return (
    <section id="games" className="py-section">
      <div className="container-padded space-y-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <h2 className="section-heading">Games.</h2>
          <p className="text-muted-foreground mt-3 text-lg max-w-md">Free browser games set in Nigeria. No download, no forced ads.</p>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-2">
          {GAMES.map((g, i) => (
            <motion.article
              key={g.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card-surface flex flex-col"
            >
              <div className="relative aspect-[16/10] overflow-hidden" style={{ background: g.slug === "last-bus" ? "radial-gradient(120% 90% at 50% 10%, #1b2440, #05060b 70%)" : "radial-gradient(120% 120% at 30% 20%, #ffd9a8, #f6eadb 60%)" }}>
                <GameStage
                  kind={g.slug === "last-bus" ? "bus" : "buka"}
                  hint={g.slug === "last-bus" ? "The LAST BUS danfo at night with its passengers. Tap it." : "Mama Titi from Bùkà Hustle. Tap her to say hello."}
                  fallback={
                    g.image ? (
                      <Image src={g.image} alt={`${g.name} key art`} fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 grid place-items-center text-center">
                        <p className="text-5xl md:text-6xl font-extrabold tracking-tight text-white" style={{ fontFamily: "var(--font-display)" }}>{g.name}</p>
                      </div>
                    )
                  }
                />
              </div>
              <div className="flex flex-1 flex-col p-6 md:p-8 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-secondary flex-shrink-0">
                    <Gamepad2 size={18} className="text-foreground" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-foreground">{g.name}</h3>
                    <p className="text-sm text-muted-foreground">{g.genre}</p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-foreground">{g.line}</p>
                <p className="text-sm text-foreground/80 leading-relaxed">{g.body}</p>
                <ul className="space-y-1.5">
                  {g.facts.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                                            {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex flex-wrap items-center gap-3 pt-2">
                  <a href={g.play} target="_blank" rel="noopener noreferrer" className="btn-primary">
                    Play free <ArrowUpRight size={15} />
                  </a>
                  {g.links.map((l) => (
                    <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="text-sm font-bold inline-flex items-center gap-1 hover:underline">
                      {l.label} <ArrowUpRight size={13} />
                    </a>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
