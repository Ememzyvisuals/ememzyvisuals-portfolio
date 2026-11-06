"use client";
// components/sections/OpenModels.tsx
// The open models I publish under Axiveri, each with its own 3D icon floating over the card.
const ICON: Record<string, string> = { asr: "mic", tts: "bubbles", llm: "brain", image: "lens" };
import Link from "next/link";
import { MODEL_SERIES } from "@/data/models";

export function OpenModels() {
  return (
    <section id="models" className="py-section">
      <div className="container-padded">
        <div className="grid justify-items-center gap-4 text-center md:grid-cols-[1fr_auto] md:items-end md:justify-items-stretch md:text-left">
          <div>
            <h2 className="section-heading">Open models</h2>
            <p className="font-museum mx-auto mt-3 max-w-xl text-xl md:mx-0 text-foreground/75 md:text-2xl">
              Speech, language and image models for Africa, published free under Axiveri.
            </p>
          </div>
          <Link href="/axiveri" className="btn-outline w-fit text-sm">Visit Axiveri</Link>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {MODEL_SERIES.map((m) => (
            <article key={m.slug} className="card-surface group overflow-hidden text-center transition-transform duration-300 hover:-translate-y-1">
              <div className="grid aspect-[5/3] w-full place-items-center bg-secondary/60">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/images/me/icon-${ICON[m.kind] ?? "brain"}.webp`} alt="" loading="lazy" className="about-float h-[72%] w-auto drop-shadow-[0_18px_24px_rgba(0,0,0,0.45)]" />
              </div>
              <div className="p-6 md:p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{m.type}</p>
                <h3 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-foreground">{m.name}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-foreground/80">{m.desc}</p>
                <p className="mt-4 text-sm text-muted-foreground">{m.stat}</p>
                <div className="mt-5 flex flex-wrap justify-center gap-3">
                  {m.links.map((l) => (
                    <a key={l.href} href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                      className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary">
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
