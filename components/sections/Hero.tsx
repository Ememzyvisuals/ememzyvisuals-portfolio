"use client";
// components/sections/Hero.tsx

import { motion } from "framer-motion";
import Link from "next/link";
import { VisitorCounter } from "@/components/ui/VisitorCounter";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center text-center px-5 pt-24 pb-10 md:pt-32 md:pb-16 min-h-[85vh]">
      <div className="relative z-10 max-w-2xl mx-auto space-y-6">

        <motion.div
          variants={fadeUp} initial="initial" animate="animate"
          transition={{ duration: 0.5, delay: 0.05 }}
          className="space-y-0"
        >
          <h1
            className="font-extrabold text-foreground block"
            style={{ fontSize: "clamp(3.4rem, 11vw, 7.5rem)", lineHeight: 1.02, letterSpacing: "-0.045em" }}
          >
            Hi. I&apos;m Emmanuel.
          </h1>
          <h1
            className="font-extrabold text-foreground block"
            style={{ fontSize: "clamp(2.6rem, 8vw, 5.8rem)", lineHeight: 1.05, letterSpacing: "-0.04em" }}
          >
            Creative Dev &amp;
          </h1>
          <h1
            className="font-extrabold text-foreground block"
            style={{ fontSize: "clamp(2.6rem, 8vw, 5.8rem)", lineHeight: 1.05, letterSpacing: "-0.04em" }}
          >
            AI Engineer.
          </h1>
        </motion.div>

        {/* Founder tag — clickable link to /axiveri */}
        <motion.div
          variants={fadeUp} initial="initial" animate="animate"
          transition={{ duration: 0.5, delay: 0.14 }}
        >
          <Link
            href="/axiveri"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border text-xs font-bold uppercase tracking-widest text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Founder of Axiveri
          </Link>
        </motion.div>

        <motion.p
          variants={fadeUp} initial="initial" animate="animate"
          transition={{ duration: 0.5, delay: 0.22 }}
          className="text-base md:text-lg text-muted-foreground leading-relaxed mx-auto max-w-md"
        >
          Building scalable web applications, AI systems, and open-source
          African language models that solve real problems.
        </motion.p>

        <motion.div
          variants={fadeUp} initial="initial" animate="animate"
          transition={{ duration: 0.5, delay: 0.32 }}
          className="flex flex-col items-center gap-4 pt-2"
        >
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-10 py-4 rounded-2xl bg-foreground text-background font-bold text-base hover:opacity-85 transition-opacity"
          >
            Get In Touch
          </Link>
          <VisitorCounter />
        </motion.div>

      </div>
    </section>
  );
}
