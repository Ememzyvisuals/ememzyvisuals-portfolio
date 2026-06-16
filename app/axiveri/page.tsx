// app/axiveri/page.tsx  — Server Component
import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, ArrowRight } from "lucide-react";
import { WalletCopy } from "./WalletCopy";

export const metadata: Metadata = {
  title: "Axiveri — African AI Research | Emmanuel Ariyo",
  description:
    "Axiveri is an African AI research initiative founded by Emmanuel Ariyo (Ememzyvisuals). Building open-source language models for Africa, including the Africlaude series.",
  openGraph: {
    title: "Axiveri — African AI Research by Emmanuel Ariyo",
    description: "Building open-source AI models for Africa. Explore the Africlaude series and support African AI development.",
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
    "Axiveri is an African AI research initiative building open-source language models including the Africlaude series.",
};

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
              An African AI research initiative building open-source language models
              for the continent and the world. Founded by{" "}
              <Link href="/about" className="text-foreground font-bold hover:underline underline-offset-4">
                Emmanuel Ariyo
              </Link>{" "}
              (Ememzyvisuals).
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://huggingface.co/Axiveri"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background font-bold text-sm hover:opacity-90 transition-opacity"
              >
                View on HuggingFace <ExternalLink size={14} />
              </a>
              <Link
                href="/axiveri/africlaude"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border font-bold text-sm hover:bg-muted transition-colors"
              >
                Africlaude Series <ArrowRight size={14} />
              </Link>
            </div>
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
                Africa has over 2,000 languages and 1.4 billion people. The majority of frontier
                AI models are built on Western data, in Western languages, for Western contexts.
              </p>
              <p className="text-muted-foreground leading-relaxed text-lg mb-4">
                Axiveri exists to change that — building AI that understands African languages,
                African contexts, and African problems from the ground up.
              </p>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Our first model series, Africlaude, is open-source and freely available.
                Research, fine-tuning, and commercial use are welcome.
              </p>
            </div>
            <div className="space-y-4">
              {[
                { title: "Open Source First", desc: "Every model Axiveri publishes is freely available on HuggingFace under open licenses." },
                { title: "Africa-Centric", desc: "Trained and evaluated on African language data, cultural contexts, and use cases." },
                { title: "Research-Grade", desc: "Benchmarked rigorously. We built TruthGuard to evaluate AI honesty — we apply the same standard to our own models." },
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

        {/* Models */}
        <section className="container-padded py-20 border-t border-border">
          <h2
            className="font-extrabold text-foreground mb-10"
            style={{ fontSize: "clamp(2rem, 5vw, 3rem)", letterSpacing: "-0.03em" }}
          >
            Model Series
          </h2>
          <Link
            href="/axiveri/africlaude"
            className="group block p-8 rounded-3xl border border-border bg-card hover:border-foreground transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-foreground text-background uppercase tracking-widest">
                    Live
                  </span>
                  <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
                    Series 1
                  </span>
                </div>
                <h3
                  className="font-extrabold text-foreground"
                  style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", letterSpacing: "-0.03em" }}
                >
                  Africlaude
                </h3>
                <p className="text-muted-foreground leading-relaxed max-w-xl">
                  A series of open-source language models developed for African contexts.
                  Africlaude-7B is the first in the series — available now on HuggingFace.
                  More models in the series are in development.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {["7B Parameters", "Open Source", "HuggingFace", "African AI"].map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-bold px-3 py-1 rounded-lg border border-border text-muted-foreground uppercase tracking-wider"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex-shrink-0 w-12 h-12 rounded-xl border border-border flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-colors">
                <ArrowRight size={18} />
              </div>
            </div>
          </Link>
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
              African AI research needs support. Every contribution goes directly toward
              model training, compute costs, and open-source development.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {/* Support — crypto wallets (client component) */}
            <div className="p-6 rounded-3xl border border-border bg-card space-y-4">
              <p className="font-extrabold text-foreground text-lg">Support</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Send crypto directly to fund model training and compute. Click any address to copy.
              </p>
              <WalletCopy />
            </div>

            {/* Partner */}
            <div className="p-6 rounded-3xl border border-border bg-card space-y-4">
              <p className="font-extrabold text-foreground text-lg">Partner</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Looking to integrate Africlaude into your product, dataset, or research?
                Let&apos;s build together.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>· Fine-tuning partnerships</li>
                <li>· Dataset contributions</li>
                <li>· API access &amp; integration</li>
                <li>· Co-authoring research</li>
              </ul>
              <a
                href="mailto:contact@ememzyvisuals.com?subject=Axiveri Partnership"
                className="inline-flex items-center gap-2 text-sm font-bold text-foreground hover:opacity-70 transition-opacity"
              >
                Reach out <ArrowRight size={14} />
              </a>
            </div>

            {/* Fund */}
            <div className="p-6 rounded-3xl border-2 border-foreground bg-foreground text-background space-y-4">
              <p className="font-extrabold text-lg">Fund / Invest</p>
              <p className="text-sm opacity-70 leading-relaxed">
                Serious investment or grant inquiries for Axiveri&apos;s continued research
                and model development.
              </p>
              <ul className="space-y-2 text-sm opacity-70">
                <li>· Compute grants</li>
                <li>· Research grants</li>
                <li>· Strategic investment</li>
                <li>· Institutional partnerships</li>
              </ul>
              <a
                href="mailto:contact@ememzyvisuals.com?subject=Axiveri Investment Inquiry"
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
              View Axiveri on HuggingFace <ExternalLink size={13} />
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
