"use client";
// components/three/certs/CertificateWall.tsx
// Lazy wrapper for the certificate wall. Phones see a still render until they tap it.
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { X } from "lucide-react";
import { CERTIFICATES } from "@/data/extras";
import { isLite } from "@/lib/lite";
import type { WallApi } from "./wallStage";

export function CertificateWall() {
  const box = useRef<HTMLDivElement>(null);
  const api = useRef<WallApi | null>(null);
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === "dark";
  const [state, setState] = useState<"idle" | "ready" | "failed">("idle");
  const [armed, setArmed] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  useEffect(() => setArmed(!isLite()), []);

  useEffect(() => {
    const el = box.current;
    if (!el || !armed) return;
    let token = 0;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !api.current) {
        const my = ++token;
        import("./wallStage").then(({ mountWall }) => {
          if (my !== token) return;
          api.current = mountWall(el, CERTIFICATES.map((c) => ({ slug: c.slug, image: c.image })), {
            dark: document.documentElement.classList.contains("dark"),
            onOpen: setOpen, onReady: () => setState("ready"), onFail: () => setState("failed"),
          });
        });
      } else if (!e.isIntersecting && api.current) {
        token++; api.current.dispose(); api.current = null; setState("idle"); setOpen(null);
      }
    }, { rootMargin: "30% 0px" });
    io.observe(el);
    return () => { token++; io.disconnect(); api.current?.dispose(); api.current = null; };
  }, [armed]);

  useEffect(() => api.current?.setMode(dark), [dark, state]);
  const c = CERTIFICATES.find((x) => x.slug === open);

  return (
    <div>
    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl sm:aspect-[16/9]">
      {state !== "ready" && (
        // eslint-disable-next-line @next/next/no-img-element
        // phones: the still is a link to the certificates page, where each one is shown on its own
        <a href="/certificates" aria-label="See every certificate" className="absolute inset-0">
          <img src={`/stills/certs-${dark ? "dark" : "light"}.webp`} alt="Emmanuel's certificates framed on a wall, joined by red thread in the order he took them"
            className="h-full w-full object-cover" loading="lazy" decoding="async" />
        </a>
      )}
      <div ref={box} data-wall className={`absolute inset-0 transition-opacity duration-1000 ${state === "ready" ? "opacity-100" : "pointer-events-none opacity-0"}`} role="img" aria-label="Certificates framed on a wall" />

    </div>
      {c && (
        <div className="card-surface relative mt-4 p-5 sm:p-7">
          <button onClick={() => api.current?.close()} aria-label="Close" className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground">
            <X size={16} />
          </button>
          <p className="text-xs font-medium text-muted-foreground">{c.issuer}</p>
          <h3 className="mt-1 pr-8 font-display text-xl font-extrabold leading-snug tracking-tight text-foreground">{c.course}</h3>
          <p className="mt-2 max-w-4xl text-sm leading-relaxed text-foreground/75 sm:text-base">{c.taught}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {c.skills.map((s) => <span key={s} className="rounded-full border border-border px-2.5 py-0.5 text-[11px] text-foreground/75">{s}</span>)}
          </div>
          <a href={c.verify} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-foreground hover:underline">
            Verify </a>
        </div>
      )}
    </div>
  );
}
