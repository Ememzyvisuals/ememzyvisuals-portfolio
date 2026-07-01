"use client";
// components/sections/Stack.tsx

import { motion } from "framer-motion";

const STACK_SECTIONS = [
  {
    title: "Frontend",
    items: [
      { name: "HTML5",      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
      { name: "CSS3",       logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
      { name: "JavaScript", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
      { name: "TypeScript", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
      { name: "React",      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
      { name: "Next.js",    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
      { name: "Tailwind",   logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
      { name: "Bootstrap",  logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg" },
    ],
  },
  {
    title: "Backend",
    items: [
      { name: "Node.js",    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
      { name: "Express",    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" },
      { name: "PostgreSQL", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
      { name: "Firebase",   logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg" },
      { name: "Supabase",   logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg" },
      { name: "Prisma",     logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg" },
      { name: "Docker",     logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
      { name: "REST API",   logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg" },
    ],
  },
  {
    title: "AI & Automation",
    items: [
      { name: "Python",     logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
      { name: "Pandas",     logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg" },
      { name: "NumPy",      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg" },
      { name: "Rust",       logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-original.svg" },
      { name: "Kaggle",     logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kaggle/kaggle-original.svg" },
      { name: "Playwright", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/playwright/playwright-original.svg" },
      { name: "Groq API",   logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/openai/openai-original.svg" },
      { name: "Ollama",     logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg" },
    ],
  },
  {
    title: "AI & ML Engineering",
    items: [
      { name: "Jupyter",      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg" },
      { name: "PyTorch",      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg" },
      { name: "HuggingFace",  logo: "https://huggingface.co/front/assets/huggingface_logo-noborder.svg" },
      { name: "Transformers", logo: "https://huggingface.co/front/assets/huggingface_logo-noborder.svg" },
      { name: "HF Datasets",  logo: "https://huggingface.co/front/assets/huggingface_logo-noborder.svg" },
      { name: "Gradio",       logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
      { name: "GPU / CUDA",   logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
      { name: "Pipelines",    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
    ],
  },
  {
    title: "Tools & Others",
    items: [
      { name: "Git",     logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
      { name: "GitHub",  logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
      { name: "VS Code", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" },
      { name: "Figma",   logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
      { name: "npm",     logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/npm/npm-original-wordmark.svg" },
      { name: "Postman", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg" },
      { name: "Vercel",  logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg" },
      { name: "Netlify", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/netlify/netlify-original.svg" },
    ],
  },
];

function TechBox({ name, logo }: { name: string; logo: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-5 md:p-4 bg-white rounded-2xl aspect-square shadow-[0px_4px_24px_rgba(0,0,0,0.15)] hover:shadow-[0px_8px_32px_rgba(0,0,0,0.22)] transition-shadow duration-200">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logo} alt={name} width={52} height={52} className="w-12 h-12 md:w-9 md:h-9 object-contain" loading="lazy" />
      <span className="text-[12px] md:text-[10px] font-semibold text-center leading-tight text-gray-500">{name}</span>
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
          <h2 className="section-heading">Tech Stack.</h2>
        </motion.div>

        <div className="space-y-6">
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
