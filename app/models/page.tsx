import type { Metadata } from "next";
import Link from "next/link";
import { models, research } from "@/content/site";
import { Arrow, Ext, SectionHead } from "@/components/ui";
import ModelCards from "@/components/home/ModelCards";

export const metadata: Metadata = {
  title: "Models",
  description: "Open speech, language and image models for Nigerian languages, trained and published by Emmanuel Ariyo under Axiveri.",
};

export default function Models() {
  return (
    <div className="pb-10 pt-28 sm:pt-36">
      <div className="page">
        <SectionHead
          kicker="Axiveri"
          title={<>Open models for<br />African languages.</>}
          sub="Axiveri is an open ecosystem: models, datasets and benchmarks that other developers can use and build on. Everything below is public on Hugging Face or Kaggle."
        />
        <ModelCards models={models} big />
        <article className="glass mt-4 rounded-xl3 p-6 sm:p-10">
          <p className="kicker">Benchmark</p>
          <h2 className="mt-3 text-4xl font-bold">{research.name}</h2>
          <p className="mt-4 max-w-3xl text-lg">{research.line}</p>
          <p className="mt-3 max-w-3xl text-fg/75">{research.body}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-line p-4"><p className="text-sm text-muted">Questions</p><p className="font-display text-4xl font-extrabold">120</p></div>
            <div className="rounded-2xl border border-line p-4"><p className="text-sm text-muted">Tiers</p><p className="mt-1 font-semibold">{research.tiers.join(", ")}</p></div>
            <div className="rounded-2xl border border-line p-4"><p className="text-sm text-muted">Licence</p><p className="mt-1 font-semibold">{research.license}</p></div>
          </div>
          <div className="mt-6 flex flex-wrap gap-5">
            {research.links.map((l) => <Ext key={l.href} href={l.href}>{l.label}</Ext>)}
            <Link href={research.blog} className="inline-flex items-center gap-1.5 font-semibold hover:underline">How I built it <Arrow /></Link>
          </div>
        </article>
        <div className="mt-10 flex flex-wrap gap-3">
          <a href="https://huggingface.co/Axiveri" target="_blank" rel="noopener noreferrer" className="btn-solid">Axiveri on Hugging Face <Arrow /></a>
          <a href="https://huggingface.co/ememzyvisuals" target="_blank" rel="noopener noreferrer" className="btn-ghost">My Hugging Face <Arrow /></a>
        </div>
      </div>
    </div>
  );
}
