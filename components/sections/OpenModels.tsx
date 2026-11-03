// components/sections/OpenModels.tsx
// The open models I publish under Axiveri, each with a flat illustration of what it does.
import Link from "next/link";
import { ModelGlyph } from "@/components/ui/ModelGlyph";
import { MODEL_SERIES } from "@/data/models";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function OpenModels() {
  return (
    <section id="models" className="py-section">
      <div className="container-padded">
        <SectionHeader
          title="Open models"
          intro="Speech, language and image models for Africa, published free under Axiveri."
          action={<Link href="/axiveri" className="btn-outline">Visit Axiveri</Link>}
        />

        <div className="mt-stack grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {MODEL_SERIES.map((m) => (
            <article key={m.slug} className="card-surface flex flex-col">
              <ModelGlyph kind={m.kind} label={m.visual} className="aspect-[5/3] w-full border-b border-border bg-brand-soft/60" />
              <div className="flex flex-1 flex-col p-6">
                <p className="text-caption font-semibold text-sun-ink">{m.type}</p>
                <h3 className="mt-2 text-h4">{m.name}</h3>
                <p className="mt-3 text-small text-foreground/80">{m.desc}</p>
                <p className="mt-4 text-caption font-semibold text-muted-foreground">{m.stat}</p>
                <div className="mt-auto flex flex-wrap gap-2 pt-6">
                  {m.links.map((l) => (
                    <a key={l.href} href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                      className="inline-flex h-10 items-center rounded-full border border-border px-4 text-caption font-semibold text-foreground transition-colors hover:border-foreground">
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
