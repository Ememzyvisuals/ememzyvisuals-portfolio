"use client";
// components/sections/Stack.tsx

import { useState } from "react";
import { motion } from "framer-motion";
import { ChessBoard } from "@/components/three/chess/ChessBoard";
import { WHITE, BLACK } from "@/components/three/chess/pieces";

// Same 32 tools and logos as the chess board, in the same groups.
const FILES = [
  ["nextjs", "flutter", "huggingface", "pytorch", "python", "kaggle", "rust", "typescript"],
  ["supabase", "turso", "tailwind", "threejs", "react", "nodejs", "docker", "git"],
  ["postgresql", "playwright", "gradio", "cuda", "transformers", "jupyter", "pandas", "express"],
  ["html5", "css3", "javascript", "numpy", "prisma", "firebase", "vercel", "groq"],
];
const GROUPS = [
  { title: "Core", techs: WHITE.back },
  { title: "Web and product", techs: WHITE.pawns },
  { title: "AI and data", techs: BLACK.back },
  { title: "Also in my toolbox", techs: BLACK.pawns },
];
const STACK_SECTIONS = GROUPS.map((g, gi) => ({
  title: g.title,
  items: g.techs.map((t, i) => ({ name: t.name, logo: `/logos/${FILES[gi][i]}.svg` })),
}));

// one tool: its logo on a small white tile, its name beside it
function TechBox({ name, logo }: { name: string; logo: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-secondary/60 p-2.5 pr-4 transition-colors hover:bg-secondary">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} alt="" width={26} height={26} className="h-[26px] w-[26px] object-contain" loading="lazy" />
      </span>
      <span className="min-w-0 truncate text-[14px] font-bold text-foreground">{name}</span>
    </div>
  );
}

export function Stack() {
  const [all, setAll] = useState(false);
  return (
    <section className="py-section bg-background">
      <div className="container-padded space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <h2 className="section-heading">Tech Stack</h2>
            <p className="mx-auto mt-3 max-w-2xl text-lg text-muted-foreground">Every piece on this board is a tool I use.</p>
          </div>
        </motion.div>

        <ChessBoard />

        <div className="flex justify-center">
          <button onClick={() => setAll((v) => !v)} className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary">
            {all ? "Hide the full list" : "See the full list"}
          </button>
        </div>

        <div className={all ? "mx-auto grid max-w-6xl gap-8 md:grid-cols-2" : "hidden"}>
          {STACK_SECTIONS.map((section, si) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: si * 0.06 }}
              className="space-y-4"
            >
              <h3 className="text-center text-lg font-extrabold tracking-tight text-foreground md:text-left">
                {section.title}
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                {section.items.map((item) => (
                  <TechBox key={item.name} name={item.name} logo={item.logo} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
