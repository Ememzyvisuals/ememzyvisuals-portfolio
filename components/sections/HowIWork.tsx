"use client";
// components/sections/HowIWork.tsx
// "How I work": four cards pinned with a dot and hung at angles, joined by a dashed line, ending on a hand-written note.
import { motion } from "framer-motion";

const STEPS = [
  { n: "01", t: "Plan", d: "We agree what success looks like, who it is for and what to build first.", r: 5, x: "md:col-start-2" },
  { n: "02", t: "Design", d: "Screens, flows and voice, shaped around the people who will use it.", r: -6, x: "md:col-start-1" },
  { n: "03", t: "Build", d: "The product, the model and the API, built to hold up in the real world.", r: -4, x: "md:col-start-2" },
  { n: "04", t: "Launch", d: "Shipped, measured and improved, with you in the loop the whole way.", r: 6, x: "md:col-start-1" },
];

export function HowIWork() {
  return (
    <section id="how" className="py-section">
      <div className="container-padded mx-auto max-w-6xl">
        <div className="text-center">
          <span className="mx-auto w-fit rounded-full border border-border px-4 py-1.5 text-[13px] font-bold text-muted-foreground">How I work</span>
          <h2 className="mt-5 font-display text-[clamp(2.2rem,4vw,3.6rem)] font-extrabold leading-[1.05] tracking-[-0.04em] text-foreground">
            From an idea to something people use.
          </h2>
        </div>
        <div className="relative mt-16 grid gap-10 md:grid-cols-2 md:gap-x-16 md:gap-y-10">
          {/* the dashed line that joins them */}
          <svg aria-hidden className="pointer-events-none absolute inset-0 hidden h-full w-full md:block" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M72 8 C 40 18, 30 22, 28 34 S 70 48, 72 60 S 30 74, 28 86" fill="none" stroke="hsl(var(--foreground) / 0.25)" strokeWidth="0.25" strokeDasharray="1.2 1.2" vectorEffect="non-scaling-stroke" />
          </svg>
          {STEPS.map((s, i) => (
            <motion.article key={s.n} initial={{ opacity: 0, y: 40, rotate: 0 }} whileInView={{ opacity: 1, y: 0, rotate: s.r }} viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: i * 0.1, type: "spring", bounce: 0.35 }}
              className={`relative mx-auto w-full max-w-[400px] ${s.x}`}>
              {/* the pin */}
              <span aria-hidden className="absolute left-1/2 top-4 z-10 h-4 w-4 -translate-x-1/2 rounded-full bg-foreground shadow-[0_2px_0_hsl(var(--border)),inset_0_-2px_3px_rgba(0,0,0,.4)]" />
              <div className="rounded-[28px] bg-[#f4f4f2] p-8 pt-12 text-[#111] shadow-[0_30px_50px_-20px_rgba(0,0,0,.6)]">
                <p className="font-display text-xl font-extrabold text-black/40">{s.n}</p>
                <h3 className="mt-1 font-display text-3xl font-extrabold tracking-[-0.03em]">{s.t}</h3>
                <p className="mt-3 text-[15px] font-semibold leading-relaxed text-black/65">{s.d}</p>
              </div>
            </motion.article>
          ))}
        </div>
        <p className="mt-10 text-center font-serif text-2xl italic text-muted-foreground md:mt-4 md:text-right">Ready to be shipped!</p>
      </div>
    </section>
  );
}
