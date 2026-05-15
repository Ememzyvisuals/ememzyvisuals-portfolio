import type { Metadata } from "next";
import { buildMeta } from "@/lib/metadata";
import { BenchmarkSection } from "@/components/sections/Benchmarks";

export const metadata: Metadata = buildMeta({
  title: "AI Research & LLM Benchmarks | Emmanuel Ariyo — Ememzyvisuals",
  description:
    "TruthGuard: Emmanuel Ariyo's LLM confidence calibration benchmark evaluating metacognition in AI models. Published on Kaggle. Open dataset for AI researchers.",
  path: "/benchmarks",
  ogTitle: "TruthGuard — LLM Benchmark",
  ogSubtitle:
    "120-question metacognition evaluation for large language models",
  ogTag: "AI Research",
  tags: [
    "TruthGuard benchmark",
    "LLM metacognition",
    "AI benchmark Nigeria",
    "LLM confidence calibration",
    "AI safety research",
    "Kaggle AI benchmark",
  ],
});

export default function BenchmarksPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container-padded mb-12">
        <h1 className="section-heading">Benchmarks.</h1>
        <p className="text-lg text-muted-foreground mt-4 max-w-xl">
          AI evaluation research — benchmarking LLM metacognition,
          confidence calibration, and reasoning.
        </p>
      </div>
      <BenchmarkSection />
    </div>
  );
}
