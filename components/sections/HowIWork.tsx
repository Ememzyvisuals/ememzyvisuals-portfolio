"use client";
// components/sections/HowIWork.tsx
// "How I work", after the editorial reference: four pinned cards hung at angles in a zig-zag, joined by a dashed
// line. As the page scrolls, a solid line draws itself along the dashed one with a glowing tracer at its tip, and
// each card's big outlined number fills in when the tracer reaches it.
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion";

const STEPS = [
  { n: "01", t: "Plan", d: "We agree what success looks like, who it is for and what to build first.", r: 4 },
  { n: "02", t: "Design", d: "Screens, flows and voice, shaped around the people who will use it.", r: -5 },
  { n: "03", t: "Build", d: "The product, the model and the API, built to hold up in the real world.", r: -3 },
  { n: "04", t: "Launch", d: "Shipped, measured and improved, with you in the loop the whole way.", r: 5 },
];

export function HowIWork() {
  const wrap = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const [d, setD] = useState("");
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [len, setLen] = useState(0);
  const [tip, setTip] = useState({ x: 0, y: 0 });
  const [reached, setReached] = useState(0);
  const stops = useRef<number[]>([]);
  const remeasure = useRef<() => void>(() => {});

  // the line goes through the pin of every card, curving between them
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const measure = () => {
      const box = el.getBoundingClientRect();
      const pts = cards.current.filter(Boolean).map((c) => {
        const r = c!.getBoundingClientRect();
        return { x: r.left - box.left + r.width / 2, y: r.top - box.top + 22 };
      });
      if (pts.length < 2) return;
      let p = `M ${pts[0].x} ${pts[0].y - 40}`;
      p += ` L ${pts[0].x} ${pts[0].y}`;
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1], b = pts[i], my = (a.y + b.y) / 2;
        p += ` C ${a.x} ${my + 60}, ${b.x} ${my - 60}, ${b.x} ${b.y}`;
      }
      const last = pts[pts.length - 1];
      p += ` C ${last.x} ${last.y + 160}, ${box.width * 0.5} ${box.height - 60}, ${box.width * 0.5} ${box.height}`;
      setSize({ w: box.width, h: box.height });
      setD(p);
    };
    remeasure.current = measure;
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // where each pin sits along the line, so a number fills when the tracer gets there
  useEffect(() => {
    const path = pathRef.current;
    if (!path || !d) return;
    const L = path.getTotalLength();
    setLen(L);
    const box = wrap.current!.getBoundingClientRect();
    stops.current = cards.current.filter(Boolean).map((c) => {
      const r = c!.getBoundingClientRect();
      const ty = r.top - box.top + 22;
      let lo = 0, hi = L;
      for (let k = 0; k < 30; k++) { const m = (lo + hi) / 2; if (path.getPointAtLength(m).y < ty) lo = m; else hi = m; }
      return lo / L;
    });
    const p = path.getPointAtLength(0);
    setTip({ x: p.x, y: p.y });
  }, [d]);

  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start 75%", "end 55%"] });
  const prog = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const [p, setP] = useState(0);
  useMotionValueEvent(prog, "change", (v) => {
    const t = Math.max(0, Math.min(1, v));
    setP(t);
    const path = pathRef.current;
    if (path && len) { const pt = path.getPointAtLength(t * len); setTip({ x: pt.x, y: pt.y }); }
    setReached(stops.current.filter((s) => t >= s - 0.005).length);
  });

  return (
    <section id="how" className="py-section">
      <div className="container-padded mx-auto max-w-6xl">
        <div className="text-center">
          <span className="mx-auto w-fit rounded-full border border-border px-4 py-1.5 text-[13px] font-bold text-muted-foreground">How I work</span>
          <h2 className="mt-5 font-display text-[clamp(2.2rem,4vw,3.6rem)] font-extrabold leading-[1.05] tracking-[-0.04em] text-foreground">
            From an idea to something people use.
          </h2>
        </div>

        <div ref={wrap} className="relative mt-20 grid gap-24 pb-28 md:grid-cols-2 md:gap-x-20 md:gap-y-0">
          {/* the dashed route, the drawn line on top and the tracer at its tip */}
          {d && (
            <svg aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-visible" width={size.w} height={size.h} viewBox={`0 0 ${size.w} ${size.h}`}>
              <path d={d} fill="none" stroke="hsl(var(--foreground) / 0.22)" strokeWidth="2" strokeDasharray="6 8" strokeLinecap="round" />
              <path ref={pathRef} d={d} fill="none" stroke="hsl(var(--foreground))" strokeWidth="2.5" strokeLinecap="round"
                strokeDasharray={len || 1} strokeDashoffset={(len || 1) * (1 - p)} />
              {p > 0.002 && (
                <g transform={`translate(${tip.x} ${tip.y})`}>
                  <circle r="14" fill="hsl(var(--brand) / 0.25)" />
                  <circle r="6" fill="hsl(var(--brand))" stroke="hsl(var(--background))" strokeWidth="2" />
                </g>
              )}
            </svg>
          )}

          {STEPS.map((s, i) => {
            const on = reached > i;
            return (
              <motion.article key={s.n} initial={{ opacity: 0, y: 40, rotate: 0 }} whileInView={{ opacity: 1, y: 0, rotate: s.r }} viewport={{ once: true, margin: "-60px" }} onAnimationComplete={() => remeasure.current()}
                transition={{ duration: 0.8, delay: 0.05, type: "spring", bounce: 0.35 }}
                style={{ gridRow: undefined }} data-row={i + 1}
                className={`how-card relative z-10 mx-auto w-full max-w-[420px] ${i % 2 ? "md:col-start-1" : "md:col-start-2"}`}>
                <div ref={(el) => { cards.current[i] = el; }} className="relative">
                  {/* the pin */}
                  <span aria-hidden className={`absolute left-1/2 top-4 z-10 h-4 w-4 -translate-x-1/2 rounded-full transition-colors duration-300 ${on ? "bg-[hsl(var(--brand))]" : "bg-[#111]"} shadow-[0_2px_0_rgba(0,0,0,.2),inset_0_-2px_3px_rgba(0,0,0,.4)]`} />
                  <div className="rounded-[28px] bg-[#f4f4f2] p-8 pt-12 text-center text-[#111] shadow-[0_30px_50px_-20px_rgba(0,0,0,.6)]">
                    <p className="font-anton text-[88px] leading-none tracking-[0.01em] transition-colors duration-500"
                      style={{ color: on ? "#111" : "transparent", WebkitTextStroke: "2px #111" }}>{s.n}</p>
                    <h3 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.03em]">{s.t}</h3>
                    <p className="mt-3 text-[15px] font-semibold leading-relaxed text-black/65">{s.d}</p>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
        <p className="relative z-10 mt-4 text-center font-serif text-3xl italic text-foreground">Ready to be shipped!</p>
      </div>
    </section>
  );
}
