"use client";
// components/sections/Stack.tsx

import { motion } from "framer-motion";
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
            <p className="mx-auto mt-3 max-w-2xl text-lg text-muted-foreground">The tools I build with every day.</p>
          </div>
        </motion.div>

        <div className="mx-auto grid max-w-6xl gap-x-10 gap-y-12 pt-6 md:grid-cols-2">
          {STACK_SECTIONS.map((section, si) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: si * 0.06 }}
              className="space-y-5"
            >
              <h3 className="text-xl font-extrabold text-center tracking-tight text-foreground">
                {section.title}
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
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
