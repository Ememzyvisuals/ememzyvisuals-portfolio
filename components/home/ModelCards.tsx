"use client";
import dynamic from "next/dynamic";
import type { Model } from "@/content/site";
import { setStage } from "@/lib/stage";
import { useThreeOn } from "@/lib/theme";
import { Ext, Tags } from "@/components/ui";

const ModelNameView = dynamic(() => import("@/components/three/ModelNameView"), { ssr: false });

export function ModelCard({ m, big = false }: { m: Model; big?: boolean }) {
  const three = useThreeOn();
  return (
    <article
      className="glass group flex flex-col overflow-hidden rounded-xl3"
      onPointerEnter={() => setStage({ focus: "model:" + m.slug })}
      onPointerLeave={() => setStage({ focus: null })}
    >
      <div className={`relative ${big ? "h-56 sm:h-72" : "h-44 sm:h-52"}`} style={{ background: `radial-gradient(90% 120% at 50% 0%, ${m.tone}33, transparent 70%)` }}>
        {three ? (
          <ModelNameView model={m} />
        ) : (
          <div className="absolute inset-0 grid place-items-center px-6">
            <span className="font-display text-[clamp(2.2rem,6vw,3.4rem)] font-extrabold tracking-tight" style={{ textShadow: `0 6px 0 ${m.tone}` }}>{m.name}</span>
          </div>
        )}
        
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="kicker">{m.kind}</p>
        <h3 className="sr-only">{m.name}</h3>
        <p className="mt-2 text-fg/85">{m.line}</p>
        {big && (
          <ul className="mt-4 space-y-2 text-sm text-fg/70">
            {m.details.map((d) => (
              <li key={d} className="flex gap-3"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-fg/50" />{d}</li>
            ))}
          </ul>
        )}
        <Tags items={m.specs} className="mt-5" />
        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <Ext href={m.link}>{m.linkLabel}</Ext>
          {m.extraLinks?.map((l) => <Ext key={l.href} href={l.href}>{l.label}</Ext>)}
        </div>
      </div>
    </article>
  );
}

export default function ModelCards({ models, big = false }: { models: Model[]; big?: boolean }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {models.map((m) => <ModelCard key={m.slug} m={m} big={big} />)}
    </div>
  );
}
