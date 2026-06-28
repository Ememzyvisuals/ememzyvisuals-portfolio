// app/axiveri/page.tsx — Server Component
import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, ArrowRight } from "lucide-react";
import { WalletCopy } from "./WalletCopy";

export const metadata: Metadata = {
  title: "Axiveri — African AI Research | Emmanuel Ariyo",
  description:
    "Axiveri is an African AI research initiative founded by Emmanuel Ariyo (Ememzyvisuals). Building open-source language and speech models for Africa — Africlaude and NaijaVox series.",
  openGraph: {
    title: "Axiveri — African AI Research by Emmanuel Ariyo",
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
    "Axiveri is an African AI research initiative building open-source language and speech models — including the Africlaude language model series and NaijaVox Nigerian speech recognition.",
};

const MODEL_SERIES = [
  {
    slug: "africlaude",
    name: "Africlaude",
    type: "Language Model Series",
    status: "live",
    statusLabel: "Live — v1",
    desc: "Open-source language models built for African contexts. Africlaude-7B is live. v2 with Yoruba, Igbo & Hausa support is in development.",
    tags: ["7B Parameters", "Open Source", "Yoruba · Igbo · Hausa (v2)"],
    hfLink: "https://huggingface.co/Axiveri/Africlaude-7B",
    internalLink: "/axiveri/africlaude",
  },
  {
    slug: "naijavox",
    name: "NaijaVox",
    type: "Speech Recognition Series",
    status: "live",
    statusLabel: "Live — V1",
    desc: "Nigerian speech recognition models. NaijaVox-V1 supports Yoruba, Hausa, Igbo, Nigerian Pidgin, and Nigerian Accented English.",
    tags: ["ASR", "Yoruba", "Hausa", "Igbo", "Pidgin", "Nigerian English"],
    hfLink: "https://huggingface.co/Axiveri/Naijavox-V1",
    internalLink: null,
  },
];

export default function AxiveriPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />

      <div className="min-h-screen bg-background">
        {/* Hero */}
        <section className="container-padded pt-32 pb-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-xs font-bold uppercase tracking-widest text-muted-foreground mb-8">
              African AI Research
            </div>
            <h1
              className="font-extrabold text-foreground leading-[0.95] mb-6"
              style={{ fontSize: "clamp(3.5rem, 10vw, 7rem)", letterSpacing: "-0.04em" }}
            >
              Axiveri
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl mb-10">
              An African AI research initiative building open-source language and speech models
              for the continent and the world. Founded by{" "}
              <Link href="/about" className="text-foreground font-bold hover:underline underline-offset-4">
                Emmanuel Ariyo
              </Link>{" "}
              (Ememzyvisuals).
            </p>
            <a
              href="https://huggingface.co/Axiveri"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background font-bold text-sm hover:opacity-90 transition-opacity"
            >
              View Axiveri on HuggingFace <ExternalLink size={14} />
            </a>
          </div>
        </section>

        {/* Mission */}
        <section className="container-padded py-20 border-t border-border">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <h2
                className="font-extrabold text-foreground mb-6"
                style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.03em" }}
              >
                The Mission
              </h2>
              <p className="text-muted-foreground leading-relaxed text-lg mb-4">
                Africa has over 2,000 languages and 1.4 billion people. Most frontier AI is built
                on Western data, in Western languages, for Western contexts.
              </p>
              <p className="text-muted-foreground leading-relaxed text-lg mb-4">
                Axiveri builds AI that understands African languages, African accents, and African
                problems — from language models to speech recognition.
              </p>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Every model is open-source. Research, fine-tuning, and commercial use are welcome.
              </p>
            </div>
            <div className="space-y-4">
              {[
                { title: "Open Source First", desc: "Every model is freely available on HuggingFace under open licenses." },
                { title: "Africa-Centric", desc: "Trained on African language data, accents, and cultural contexts." },
                { title: "Research-Grade", desc: "Rigorously benchmarked. We built TruthGuard to evaluate AI — we apply the same standards to our own models." },
                { title: "Community-Driven", desc: "Partners, contributors, and supporters are welcome. Axiveri is built in public." },
              ].map((item) => (
                <div key={item.title} className="p-5 rounded-2xl border border-border bg-card space-y-1.5">
                  <p className="font-extrabold text-foreground text-sm">{item.title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Model Series */}
        <section className="container-padded py-20 border-t border-border">
          <h2
            className="font-extrabold text-foreground mb-10"
            style={{ fontSize: "clamp(2rem, 5vw, 3rem)", letterSpacing: "-0.03em" }}
          >
            Model Series
          </h2>
          <div className="space-y-5">
            {MODEL_SERIES.map((series) => (
              <div
                key={series.slug}
                className="group p-8 rounded-3xl border border-border bg-card hover:border-foreground transition-colors"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-foreground text-background uppercase tracking-widest">
                        {series.statusLabel}
                      </span>
                      <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
                        {series.type}
                      </span>
                    </div>
                    <h3
                      className="font-extrabold text-foreground"
                      style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", letterSpacing: "-0.03em" }}
                    >
                      {series.name}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed max-w-xl">{series.desc}</p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {series.tags.map((tag) => (
                        <span key={tag} className="text-[10px] font-bold px-3 py-1 rounded-lg border border-border text-muted-foreground uppercase tracking-wider">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <a
                      href={series.hfLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-bold hover:bg-muted transition-colors"
                    >
                      HuggingFace <ExternalLink size={12} />
                    </a>
                    {series.internalLink && (
                      <Link
                        href={series.internalLink}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-foreground text-background text-sm font-bold hover:opacity-90 transition-opacity"
                      >
                        Learn more <ArrowRight size={12} />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Support / Partner / Fund */}
        <section className="container-padded py-20 border-t border-border">
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
                Reach out <ArrowRight size={14} />
              </a>
            </div>

            <div className="p-6 rounded-3xl border-2 border-foreground bg-foreground text-background space-y-4">
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
                Send inquiry <ArrowRight size={14} />
              </a>
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
