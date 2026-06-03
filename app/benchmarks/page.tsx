// app/benchmarks/page.tsx
import type { Metadata } from "next";
import { buildMeta } from "@/lib/metadata";
import { BenchmarkSection } from "@/components/sections/Benchmarks";

export const metadata: Metadata = buildMeta({
  title: "AI Research & LLM Benchmarks | Emmanuel Ariyo — Ememzyvisuals",
  description: "TruthGuard: Emmanuel Ariyo's LLM confidence calibration benchmark evaluating metacognition in AI models. Published on Kaggle.",
  path: "/benchmarks",
  ogTitle: "TruthGuard — LLM Benchmark",
  ogSubtitle: "120-question metacognition evaluation for large language models",
  ogTag: "AI Research",
});

// No extra header — BenchmarkSection already has the "Benchmarks." heading
export default function BenchmarksPage() {
  return (
    <div className="py-16 md:py-24">
      <BenchmarkSection />
    </div>
  );
}
