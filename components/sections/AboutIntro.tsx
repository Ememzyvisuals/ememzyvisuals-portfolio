"use client";
// components/sections/AboutIntro.tsx
// "Meet the person behind the work", after the editorial reference: a short intro beside my real photo in a cropped
// frame, then a dark card with one big number and my skills as tilted pills, next to a quote from me with a round
// photo.
import Link from "next/link";
import { motion } from "framer-motion";

const SKILLS = [
  { t: "Speech AI", r: -6 }, { t: "Web apps", r: 4 }, { t: "Mobile apps", r: -3 }, { t: "LLMs", r: 6 },
  { t: "Product design", r: -4 }, { t: "APIs", r: 3 }, { t: "3D and motion", r: -7 }, { t: "Automation", r: 5 },
];

export function AboutIntro() {
  return (
    <section id="about-intro" className="py-section">
      <div className="container-padded mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
        {/* the intro */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center p-2 md:p-6 lg:items-start">
          <span className="mx-auto w-fit rounded-full border border-border px-4 py-1.5 text-[13px] font-bold text-muted-foreground lg:mx-0">About me</span>
          <h2 className="mt-5 font-display text-[clamp(2.2rem,4vw,3.6rem)] font-extrabold leading-[1.05] tracking-[-0.04em] text-foreground lg:text-left">
            Meet Ememzyvisuals: the engineer behind the voices.
          </h2>
          <p className="mt-5 text-[17px] leading-relaxed text-muted-foreground lg:text-left">
            I am Emmanuel Ariyo, a self-taught software developer and machine learning engineer from Nigeria. I build
            speech and language AI for African languages, and I ship the full products around it, from the data and the
            model to the app people actually touch.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3 lg:justify-start">
            <Link href="/about" className="btn-primary text-sm">More about me</Link>
            <a href="/emmanuel-ariyo-cv.pdf" download className="btn-outline text-sm">Download CV</a>
          </div>
        </motion.div>

        {/* my photo, cropped into a soft frame */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
          className="relative min-h-[320px] overflow-hidden rounded-[32px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/emmanuel.jpg" alt="Emmanuel Ariyo" loading="lazy" className="absolute inset-0 h-full w-full object-cover object-[50%_25%] grayscale" />
          <span className="absolute bottom-5 left-5 rounded-full bg-background/80 px-4 py-2 text-[13px] font-extrabold text-foreground backdrop-blur">Based in Nigeria · working with teams anywhere</span>
        </motion.div>

        {/* the dark card: one big number and the skills as tilted pills */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }}
          className="lines-bg relative overflow-hidden rounded-[32px] bg-[#0a0a0a] p-8 text-white md:p-10">
          <p className="font-display text-6xl font-extrabold tracking-[-0.05em] md:text-7xl">2,500+</p>
          <p className="mt-2 text-[15px] font-bold text-white/70">model and dataset downloads every month</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {SKILLS.map((s) => (
              <span key={s.t} className="rounded-full bg-white px-4 py-2 text-[14px] font-extrabold text-black shadow-[0_8px_20px_-8px_rgba(0,0,0,.6)]" style={{ transform: `rotate(${s.r}deg)` }}>{s.t}</span>
            ))}
          </div>
        </motion.div>

        {/* a quote from me, with a round photo */}
        <motion.figure initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
          className="card-surface flex flex-col items-center justify-center gap-6 p-8 md:flex-row md:p-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/emmanuel.jpg" alt="" loading="lazy" className="h-28 w-28 shrink-0 rounded-full object-cover object-[50%_22%] grayscale md:h-36 md:w-36" />
          <blockquote>
            <span aria-hidden className="block font-display text-6xl font-extrabold leading-none text-foreground/30">&ldquo;</span>
            <p className="-mt-3 font-display text-[22px] font-bold leading-snug tracking-[-0.02em] text-foreground md:text-[26px]">
              Africa should not have to wait for AI to learn its languages. So I am teaching it.
            </p>
            <figcaption className="mt-4 text-[14px] font-bold text-muted-foreground">Emmanuel Ariyo, Ememzyvisuals</figcaption>
          </blockquote>
        </motion.figure>
      </div>
    </section>
  );
}
