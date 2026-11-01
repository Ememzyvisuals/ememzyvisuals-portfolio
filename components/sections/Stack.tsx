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

function TechBox({ name, logo }: { name: string; logo: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-5 md:p-4 bg-white rounded-2xl aspect-square shadow-[0px_4px_24px_rgba(0,0,0,0.15)] hover:shadow-[0px_8px_32px_rgba(0,0,0,0.22)] transition-shadow duration-200">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logo} alt={name} width={52} height={52} className="w-12 h-12 md:w-9 md:h-9 object-contain" loading="lazy" />
      <span className="text-[12px] md:text-[10px] font-semibold text-center leading-tight text-gray-800">{name}</span>
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
          <h2 className="section-heading">Tech Stack</h2>
          <p className="max-w-2xl text-muted-foreground mt-3">Every piece on this board is a tool I use.</p>
        </motion.div>

        <ChessBoard />

        <div className="flex justify-center">
          <button onClick={() => setAll((v) => !v)} className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary">
            {all ? "Hide the full list" : "See the full list"}
          </button>
        </div>

        <div className={all ? "space-y-6" : "hidden"}>
          {STACK_SECTIONS.map((section, si) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: si * 0.06 }}
              className="bg-[#0a0a0a] dark:bg-zinc-900 rounded-3xl px-5 pt-6 pb-8 space-y-6"
            >
              <h3 className="text-white text-xl font-extrabold text-center tracking-tight">
                {section.title}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
