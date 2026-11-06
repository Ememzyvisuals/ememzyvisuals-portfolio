"use client";
// components/sections/WhatIDo.tsx
// "What I do", after the reference's black section: a dark band with a grid of cards, each with an outline icon.
import Link from "next/link";
import { motion } from "framer-motion";
import { AudioLines, Bot, Code2, Globe, Palette, Smartphone } from "lucide-react";

const ITEMS = [
  { i: AudioLines, t: "Speech AI", d: "Text to speech, speech recognition and voice cloning for African languages." },
  { i: Bot, t: "AI agents and automation", d: "Assistants and workflows that do real work, on the web, WhatsApp or Telegram." },
  { i: Globe, t: "Web apps", d: "Fast, polished products with Next.js and React, from landing page to platform." },
  { i: Smartphone, t: "Mobile apps", d: "Flutter and React Native apps that work offline and feel native." },
  { i: Code2, t: "APIs and backends", d: "Streaming APIs, databases and deployments built to scale." },
  { i: Palette, t: "Product design", d: "Interfaces, motion and 3D, designed as carefully as they are built." },
];

export function WhatIDo() {
  return (
    <section id="what-i-do" className="lines-bg relative overflow-hidden bg-[#0a0a0a] py-section text-white">
      <div className="container-padded mx-auto max-w-7xl">
        <div className="grid items-end gap-6 text-center lg:grid-cols-2 lg:text-left">
          <div>
            <span className="mx-auto w-fit rounded-full border border-white/20 px-4 py-1.5 text-[13px] font-bold text-white/70 lg:mx-0">What I do</span>
            <h2 className="mt-5 font-display text-[clamp(2.2rem,4vw,3.6rem)] font-extrabold leading-[1.05] tracking-[-0.04em] lg:text-left">Built to be used, not just admired.</h2>
          </div>
          <p className="mx-auto max-w-md text-[17px] font-semibold text-white/60 lg:mx-0 lg:text-left">Six things I do every week, for founders, teams and my own products.</p>
        </div>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((x, k) => (
            <motion.div key={x.t} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: k * 0.06 }}
              className="group rounded-[26px] border border-white/10 bg-white/[0.03] p-7 text-center transition-colors hover:bg-white/[0.07]">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-white/15"><x.i size={22} strokeWidth={1.8} /></span>
              <h3 className="mt-5 font-display text-[22px] font-extrabold tracking-[-0.02em]">{x.t}</h3>
              <p className="mt-2 text-[15px] font-medium leading-relaxed text-white/60">{x.d}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-10 text-center"><Link href="/services" className="inline-flex rounded-full border border-white/25 px-6 py-3 text-sm font-extrabold hover:bg-white/10">See all services</Link></div>
      </div>
    </section>
  );
}
