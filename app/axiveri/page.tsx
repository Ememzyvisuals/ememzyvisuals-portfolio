// app/axiveri/page.tsx, Server Component
import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, } from "lucide-react";
import Image from "next/image";
import { WalletCopy } from "./WalletCopy";
import { MODEL_SERIES } from "@/data/models";
import { ModelVisual } from "@/components/three/models/ModelVisual";

export const metadata: Metadata = {
  title: "Axiveri, African AI Research | Emmanuel Ariyo",
  description:
    "Axiveri is an African AI research initiative founded by Emmanuel Ariyo (Ememzyvisuals). Building open-source language and speech models for Africa, Africlaude and NaijaVox series.",
  openGraph: {
    title: "Axiveri, African AI Research by Emmanuel Ariyo",
    description: "Building open-source AI for Africa. Africlaude language models and NaijaVox Nigerian speech recognition.",
    url: "https://ememzyvisuals.vercel.app/axiveri",
  },
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Axiveri",
  url: "https://huggingface.co/Axiveri",
  sameAs: ["https://huggingface.co/Axiveri"],
  founder: {
    "@type": "Person",
    name: "Emmanuel Ariyo",
    alternateName: "Ememzyvisuals",
    url: "https://ememzyvisuals.vercel.app",
  },
  description:
    "Axiveri is an African AI research initiative building open-source language and speech models, including the Africlaude language model series and NaijaVox Nigerian speech recognition.",
};



const DATASETS = [
  { id: "Axiveri/naija-tts-pcm-processed", name: "naija-tts-pcm-processed", desc: "Cleaned Nigerian Pidgin speech and text pairs, ready for text to speech training.", downloads: "1,438" },
  { id: "Axiveri/wazobia-tts-cc", name: "wazobia-tts-cc", desc: "Wazobia TTS CC: openly licensed (Creative Commons) multilingual speech for Nigerian language voices.", downloads: "149" },
  { id: "Axiveri/AfriVision-30K", name: "AfriVision-30K", desc: "Captioned images of African people, places and culture.", downloads: "81" },
  { id: "Axiveri/naijatts-yo-processed", name: "naijatts-yo-processed", desc: "Processed Yoruba speech with tone marks kept intact.", downloads: "8" },
];

export default function AxiveriPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />

      <div className="min-h-screen bg-background">
        {/* Hero: Axiveri orange, the real AX mark, the mission line, and the voice wave */}
        <section className="relative overflow-hidden bg-[linear-gradient(140deg,#e85500,#fc6401_55%,#ff8a3d)] text-white">
          <div className="container-padded grid items-center gap-10 pb-16 pt-32 md:grid-cols-[1.05fr_1fr] md:pb-24 md:pt-40">
            <div>
              <div className="flex items-center gap-3">
                <Image src="/brand/axiveri.png" alt="Axiveri" width={56} height={56} className="h-14 w-14 rounded-2xl shadow-[0_0_0_3px_rgba(255,255,255,0.9)]" priority />
                <div>
                  <p className="font-display text-2xl font-extrabold tracking-tight">Axiveri</p>
                  <p className="text-xs font-medium tracking-[0.28em] text-white/80">AI RESEARCH</p>
                </div>
              </div>
              <h1 className="mt-10 font-display font-extrabold leading-[0.98] tracking-tight" style={{ fontSize: "clamp(2.6rem, 6.4vw, 5rem)" }}>
                AI that learns our ways in Africa.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/90">
                An open ecosystem of speech, language and vision models for African languages. Speech that carries
                emotion and expression, recognition that understands how people really talk, all free to build on.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="https://huggingface.co/Axiveri" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#c44d00] hover:opacity-90">
                  Open on Hugging Face <ExternalLink size={14} />
                </a>
                <a href="#partner" className="inline-flex items-center gap-2 rounded-full border border-white/60 px-6 py-3 text-sm font-semibold hover:bg-white/10">
                  Partner with us
                </a>
              </div>
              <p className="mt-8 text-sm text-white/80">Founded by Emmanuel Ariyo</p>
            </div>
            <ModelVisual kind="tts" onBrand label="African language letters turning into a white voice wave" className="aspect-[5/4] w-full" />
          </div>
        </section>

        {/* Live numbers */}
        <section className="container-padded">
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 border-b border-border py-10 md:grid-cols-4">
            {[
              { n: "8", l: "open models" },
              { n: "4", l: "open datasets" },
              { n: "2,500+", l: "model and dataset downloads in the last 30 days" },
              { n: "17", l: "followers on Hugging Face" },
            ].map((x) => (
              <div key={x.l}>
                <p className="font-display text-4xl font-extrabold tracking-tight text-[#fc6401] md:text-5xl">{x.n}</p>
                <p className="mt-1 text-sm text-muted-foreground">{x.l}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Model series, each with its own 3D piece */}
        <section className="container-padded py-20 md:py-28">
          <h2 className="section-heading">The models</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">Four families, each published openly with weights, cards and examples.</p>
          <div className="mt-14 space-y-20 md:space-y-28">
            {MODEL_SERIES.map((m, i) => (
              <article key={m.slug} className="grid items-center gap-8 md:grid-cols-2 md:gap-14">
                <ModelVisual kind={m.kind} label={m.visual} className={`aspect-[5/4] w-full rounded-3xl bg-[#fff6ee] dark:bg-[#1d130c] ${i % 2 ? "md:order-2" : ""}`} />
                <div>
                  <p className="text-sm font-medium text-[#fc6401]">{m.type}</p>
                  <h3 className="mt-2 font-display font-extrabold tracking-tight text-foreground" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>{m.name}</h3>
                  <p className="mt-4 leading-relaxed text-foreground/75">{m.desc}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {m.tags.map((t) => <span key={t} className="rounded-full border border-border px-3 py-1 text-xs text-foreground/75">{t}</span>)}
                  </div>
                  <p className="mt-5 text-sm text-muted-foreground">{m.stat}</p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    {m.links.map((l, k) => (
                      <a key={l.href} href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                        className={k === 0 ? "inline-flex items-center gap-2 rounded-full bg-[#fc6401] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90" : "inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary"}>
                        {l.label} {l.href.startsWith("http") ? <ExternalLink size={13} /> : null}
                      </a>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Open datasets */}
        <section className="container-padded border-t border-border py-20">
          <h2 className="section-heading">Open datasets</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">The data behind the models, cleaned and shared so others do not start from zero.</p>
          <ul className="mt-10 divide-y divide-border border-y border-border">
            {DATASETS.map((d) => (
              <li key={d.id}>
                <a href={`https://huggingface.co/datasets/${d.id}`} target="_blank" rel="noopener noreferrer" className="group grid gap-1 py-5 md:grid-cols-[1.2fr_2fr_auto] md:items-center md:gap-8">
                  <span className="font-display text-lg font-bold text-foreground">{d.name}</span>
                  <span className="text-sm text-muted-foreground">{d.desc}</span>
                  <span className="text-sm font-semibold text-[#fc6401]">{d.downloads} downloads this month</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* What we stand for */}
        <section className="container-padded border-t border-border py-20">
          <h2 className="section-heading">How we build</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {[
              { title: "Open by default", desc: "Weights, data and model cards are public on Hugging Face under open licences." },
              { title: "Made for how Africa speaks", desc: "Tone marks, accents, code-switching and real recording conditions are part of the training, not an afterthought." },
              { title: "Measured honestly", desc: "Every release is evaluated, word error rates for recognition and listening tests for voices, and the numbers are published." },
              { title: "Built in public", desc: "Contributors, partners and supporters are welcome to build alongside us." },
            ].map((v) => (
              <div key={v.title} className="card-surface border-l-2 border-l-[#fc6401] p-6">
                <h3 className="font-display text-lg font-bold text-foreground">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/70">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Support / Partner / Fund */}
        <section id="partner" className="container-padded py-20 border-t border-border">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2
              className="font-extrabold text-foreground mb-4"
              style={{ fontSize: "clamp(2rem, 5vw, 3rem)", letterSpacing: "-0.03em" }}
            >
              Support Axiveri
            </h2>
            <p className="text-lg text-muted-foreground">
              African AI research needs support. Every contribution goes directly toward model
              training, compute, and open-source development.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="p-6 rounded-3xl border border-border bg-card space-y-4">
              <p className="font-extrabold text-foreground text-lg">Support</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Send crypto directly to fund model training and compute. Click any address to copy.
              </p>
              <WalletCopy />
            </div>

            <div className="p-6 rounded-3xl border border-border bg-card space-y-4">
              <p className="font-extrabold text-foreground text-lg">Partner</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Integrate Africlaude or NaijaVox into your product, dataset, or research.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>· Fine-tuning partnerships</li>
                <li>· Dataset contributions</li>
                <li>· API access &amp; integration</li>
                <li>· Co-authoring research</li>
              </ul>
              <a
                href="/contact?category=partnership"
                className="inline-flex items-center gap-2 text-sm font-bold text-foreground hover:opacity-70 transition-opacity"
              >
                Reach out </a>
            </div>

            <div className="p-6 rounded-3xl border-2 border-[#fc6401] bg-[#fc6401] text-white space-y-4">
              <p className="font-extrabold text-lg">Fund / Invest</p>
              <p className="text-sm opacity-70 leading-relaxed">
                Serious investment or grant inquiries for Axiveri&apos;s research and model development.
              </p>
              <ul className="space-y-2 text-sm opacity-70">
                <li>· Compute grants</li>
                <li>· Research grants</li>
                <li>· Strategic investment</li>
                <li>· Institutional partnerships</li>
              </ul>
              <a
                href="/contact?category=investment"
                className="inline-flex items-center gap-2 text-sm font-bold hover:opacity-80 transition-opacity"
              >
                Send inquiry </a>
            </div>
          </div>

          <div className="text-center">
            <a
              href="https://huggingface.co/Axiveri"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-bold"
            >
              View all Axiveri models on HuggingFace <ExternalLink size={13} />
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
