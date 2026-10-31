"use client";
// app/gallery/GalleryView.tsx
// A curved row of photos and videos you stand inside: the centre card is furthest away, the edges come
// towards you. Drag or swipe to move along it; the centre video plays silently; tap any card to open it
// full screen (videos with sound). Below, everything in a grid with category filters.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Play, X, ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryItem } from "@/lib/store";

const fmtDur = (s: number | null) => (s ? `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}` : "");

export function GalleryView({ items }: { items: GalleryItem[] }) {
  const [pos, setPos] = useState(Math.floor(items.length / 2)); // fractional index at the centre; start in the middle
  const [open, setOpen] = useState<number | null>(null);
  const [cat, setCat] = useState("All");
  const [cardW, setCardW] = useState(150);
  const drag = useRef<{ x: number; p: number; moved: number } | null>(null);
  const vids = useRef<Map<number, HTMLVideoElement>>(new Map());
  const n = items.length;

  useEffect(() => {
    const r = () => setCardW(window.innerWidth < 640 ? 92 : window.innerWidth < 1024 ? 128 : 150);
    r(); window.addEventListener("resize", r); return () => window.removeEventListener("resize", r);
  }, []);

  // ease towards the nearest card after a drag
  const target = useRef(Math.floor(items.length / 2));
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (drag.current) return;
      setPos((p) => (Math.abs(target.current - p) < 0.001 ? target.current : p + (target.current - p) * 0.14));
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  const go = useCallback((i: number) => { target.current = Math.max(0, Math.min(n - 1, i)); }, [n]);

  // only the centre video plays (muted), the rest stay paused on their poster
  const centre = Math.round(pos);
  useEffect(() => {
    vids.current.forEach((v, i) => { if (i === centre && open === null) v.play().catch(() => {}); else v.pause(); });
  }, [centre, open]);

  const onDown = (e: React.PointerEvent) => { drag.current = { x: e.clientX, p: pos, moved: 0 }; (e.target as HTMLElement).setPointerCapture?.(e.pointerId); };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    drag.current.moved = Math.max(drag.current.moved, Math.abs(dx));
    setPos(Math.max(-0.4, Math.min(n - 0.6, drag.current.p - dx / (cardW * 1.6))));
  };
  const onUp = () => { if (!drag.current) return; target.current = Math.max(0, Math.min(n - 1, Math.round(pos))); drag.current = null; };

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (open !== null) { if (e.key === "Escape") setOpen(null); if (e.key === "ArrowRight") setOpen((o) => (o! + 1) % n); if (e.key === "ArrowLeft") setOpen((o) => (o! - 1 + n) % n); return; }
      if (e.key === "ArrowRight") go(Math.round(target.current) + 1);
      if (e.key === "ArrowLeft") go(Math.round(target.current) - 1);
    };
    window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k);
  }, [open, n, go]);

  const cats = useMemo(() => ["All", ...Array.from(new Set(items.map((i) => i.category).filter(Boolean) as string[]))], [items]);
  const grid = items.map((it, i) => ({ it, i })).filter(({ it }) => cat === "All" || it.category === cat);

  if (!n) return (
    <div className="container-padded mt-16">
      <div className="card-surface mx-auto max-w-xl p-10 text-center">
        <p className="font-display text-xl font-extrabold text-foreground">New photos and videos are on the way.</p>
        <p className="mt-2 text-sm text-muted-foreground">Check back soon.</p>
      </div>
    </div>
  );

  // True geometry, like the reference: identical flat cards standing on the inside of a cylinder, all facing
  // its centre, with you standing near the front of it. The far (middle) card looks small, the side cards come
  // towards you, so each side card's outer edge is taller than its inner edge and the row bends into a circle.
  const R = cardW * 3.3;                 // cylinder radius
  const C = R * 0.72;                    // how far the cylinder's centre sits in front of the page plane
  const P = R * 1.12;                    // camera distance (CSS perspective)
  const step = (cardW * 1.06) / R;       // angle per card: one card width plus a small even gap
  return (
    <>
      {/* the curve */}
      <section className="relative mt-12 select-none overflow-hidden" aria-label="Gallery, drag or swipe to browse">
        <div className="relative mx-auto h-[300px] touch-pan-y sm:h-[400px] lg:h-[470px]" style={{ perspective: P }}
          onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
          <div className="absolute left-1/2 top-1/2 [transform-style:preserve-3d]">
            {items.map((it, i) => {
              const d = i - pos, ad = Math.abs(d), th = d * step;
              if (Math.abs(th) > 1.42) return null;
              const w = cardW, h = cardW * 1.62;
              return (
                <button key={it.id} type="button"
                  onClick={() => { if (drag.current?.moved || ad > 0.5) { go(i); return; } setOpen(i); }}
                  className="absolute overflow-hidden rounded-[22px] bg-secondary shadow-[0_30px_60px_-30px_rgba(0,0,0,0.45)] outline-none focus-visible:ring-2 focus-visible:ring-foreground"
                  style={{ width: w, height: h, marginLeft: -w / 2, marginTop: -h / 2, transform: `translateZ(${C}px) rotateY(${-th}rad) translateZ(${-R}px)`, zIndex: 100 - Math.round(ad * 10), opacity: Math.abs(th) > 1.25 ? Math.max(0, (1.42 - Math.abs(th)) / 0.17) : 1, backfaceVisibility: "hidden" }}
                  aria-label={`${it.title}${it.kind === "video" ? ", video" : ""}`}>
                  {it.kind === "video" ? (
                    <video ref={(v) => { if (v) vids.current.set(i, v); else vids.current.delete(i); }} src={it.url} poster={it.poster ?? undefined} muted loop playsInline preload={ad < 1.5 ? "metadata" : "none"} className="h-full w-full object-cover" />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={it.url} alt={it.title} draggable={false} loading={ad < 3 ? "eager" : "lazy"} className="h-full w-full object-cover" />
                  )}
                  {it.kind === "video" && (
                    <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
                      <Play size={11} fill="currentColor" /> {fmtDur(it.duration)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        {/* caption of the centre card */}
        <div className="container-padded mt-4 flex items-center justify-center gap-4">
          <button onClick={() => go(centre - 1)} disabled={centre <= 0} aria-label="Previous" className="grid h-10 w-10 place-items-center rounded-full border border-border text-foreground hover:bg-secondary disabled:opacity-30"><ChevronLeft size={18} /></button>
          <div className="min-w-0 max-w-md text-center">
            <p className="truncate font-display text-lg font-bold text-foreground">{items[centre]?.title}</p>
            <p className="truncate text-sm text-muted-foreground">{items[centre]?.description || items[centre]?.category}</p>
          </div>
          <button onClick={() => go(centre + 1)} disabled={centre >= n - 1} aria-label="Next" className="grid h-10 w-10 place-items-center rounded-full border border-border text-foreground hover:bg-secondary disabled:opacity-30"><ChevronRight size={18} /></button>
        </div>
      </section>

      {/* everything */}
      {n > 4 && (
        <section className="container-padded mt-20">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-3">
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground">Everything</h2>
            <div className="flex flex-wrap gap-5">
              {cats.map((c) => (
                <button key={c} onClick={() => setCat(c)} className={`text-sm font-medium ${cat === c ? "text-foreground underline underline-offset-8" : "text-muted-foreground hover:text-foreground"}`}>{c}</button>
              ))}
            </div>
          </div>
          <div className="mt-8 columns-2 gap-4 md:columns-3 [&>*]:mb-4">
            {grid.map(({ it, i }) => (
              <button key={it.id} onClick={() => setOpen(i)} className="group relative block w-full overflow-hidden rounded-2xl bg-secondary text-left">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.kind === "video" ? it.poster || it.url : it.url} alt={it.title} loading="lazy" className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                {it.kind === "video" && <span className="absolute left-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-black/55 text-white backdrop-blur"><Play size={13} fill="currentColor" /></span>}
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 text-sm font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">{it.title}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* full screen viewer */}
      {open !== null && items[open] && (
        <div className="fixed inset-0 z-[70] flex flex-col bg-black/92 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={items[open].title} onClick={() => setOpen(null)}>
          <div className="flex items-center justify-between p-4 text-white">
            <p className="truncate pr-4 font-display text-lg font-bold">{items[open].title}</p>
            <button onClick={() => setOpen(null)} aria-label="Close" className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10"><X size={20} /></button>
          </div>
          <div className="flex min-h-0 flex-1 items-center justify-center px-4 pb-6" onClick={(e) => e.stopPropagation()}>
            {items[open].kind === "video" ? (
              <video key={items[open].id} src={items[open].url} poster={items[open].poster ?? undefined} controls autoPlay playsInline className="max-h-full max-w-full rounded-xl" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={items[open].url} alt={items[open].title} className="max-h-full max-w-full rounded-xl object-contain" />
            )}
          </div>
          {items[open].description && <p className="px-6 pb-6 text-center text-sm text-white/75" onClick={(e) => e.stopPropagation()}>{items[open].description}</p>}
        </div>
      )}
    </>
  );
}
