// app/axiveri/africlaude/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, ArrowLeft, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Africlaude — Open-Source African Language Model | Axiveri",
  description:
    "Africlaude is a series of open-source language models developed by Axiveri, founded by Emmanuel Ariyo. Africlaude-7B is the first model in the series, available on HuggingFace.",
  openGraph: {
    title: "Africlaude-7B — African Language Model by Axiveri",
    description: "Africlaude is Axiveri's flagship open-source language model series. Africlaude-7B is live on HuggingFace.",
    url: "https://ememzyvisuals.vercel.app/axiveri/africlaude",
  },
};

const modelSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Africlaude-7B",
  applicationCategory: "ArtificialIntelligence",
  operatingSystem: "Any",
  url: "https://huggingface.co/Axiveri/Africlaude-7B",
  author: {
    "@type": "Organization",
    name: "Axiveri",
    founder: {
      "@type": "Person",
      name: "Emmanuel Ariyo",
      alternateName: "Ememzyvisuals",
      url: "https://ememzyvisuals.vercel.app",
    },
  },
  description: "Africlaude-7B is the first model in the Africlaude series — an open-source 7B parameter language model developed by Axiveri for African AI research.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const series = [
  { name: "Africlaude-7B", status: "live", params: "7B", desc: "The first model in the series. Available now on HuggingFace for download, fine-tuning, and research.", link: "https://huggingface.co/Axiveri/Africlaude-7B" },
  { name: "Africlaude-13B", status: "coming", params: "13B", desc: "Larger model with expanded capacity. In development.", link: null },
  { name: "Africlaude-70B", status: "planned", params: "70B", desc: "Frontier-scale model for advanced research applications. Planned.", link: null },
];

export default function AfriclaудePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(modelSchema) }}
      />

      <div className="min-h-screen bg-background">
        {/* Back */}
        <div className="container-padded pt-28 pb-4">
          <Link href="/axiveri" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-bold">
            <ArrowLeft size={14} /> Back to Axiveri
          </Link>
        </div>

        {/* Hero */}
        <section className="container-padded pt-8 pb-20">
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <span className="text-xs font-extrabold px-3 py-1.5 rounded-full bg-foreground text-background uppercase tracking-widest">
                Live — Africlaude-7B
              </span>
              <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
                by{" "}
                <a href="https://huggingface.co/Axiveri" target="_blank" rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors underline underline-offset-2">
                  Axiveri
                </a>
                {" "}· Founded by{" "}
                <Link href="/about" className="hover:text-foreground transition-colors underline underline-offset-2">
                  Emmanuel Ariyo
                </Link>
              </span>
            </div>
            <h1
              className="font-extrabold text-foreground leading-[0.95] mb-6"
              style={{ fontSize: "clamp(3rem, 9vw, 6.5rem)", letterSpacing: "-0.04em" }}
            >
              Africlaude
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl mb-10">
              An open-source language model series built for Africa — available for research,
              fine-tuning, and production use worldwide.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://huggingface.co/Axiveri/Africlaude-7B"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background font-bold text-sm hover:opacity-90 transition-opacity"
              >
                Download Africlaude-7B <ExternalLink size={14} />
              </a>
              <a
                href="https://huggingface.co/Axiveri"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border font-bold text-sm hover:bg-muted transition-colors"
              >
                Axiveri on HuggingFace <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </section>

        {/* About the model */}
        <section className="container-padded py-20 border-t border-border">
          <div className="grid md:grid-cols-2 gap-16">
            <div className="space-y-6">
              <h2
                className="font-extrabold text-foreground"
                style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", letterSpacing: "-0.03em" }}
              >
                About Africlaude-7B
              </h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Africlaude-7B is a 7-billion parameter open-source language model — the first
                in Axiveri&apos;s Africlaude series. It is designed for researchers, developers,
                and builders who want a capable, open model they can run, fine-tune, and deploy.
              </p>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Africlaude is built for accessibility: small enough to run efficiently, large
                enough to perform meaningful tasks, and fully open for the community to build on.
              </p>
            </div>
            <div className="space-y-3">
              {[
                { label: "Parameters",    value: "7 Billion" },
                { label: "Architecture",  value: "Transformer (Decoder)" },
                { label: "License",       value: "Open — community use" },
                { label: "Available at",  value: "HuggingFace / Axiveri" },
                { label: "Developed by",  value: "Emmanuel Ariyo (Ememzyvisuals)" },
                { label: "Organization",  value: "Axiveri" },
                { label: "Status",        value: "Live" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <span className="text-sm text-muted-foreground">{row.label}</span>
                  <span className="text-sm font-bold text-foreground">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use cases */}
        <section className="container-padded py-20 border-t border-border">
          <h2
            className="font-extrabold text-foreground mb-10"
            style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", letterSpacing: "-0.03em" }}
          >
            What You Can Build
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { title: "Chatbots & Assistants",   desc: "Deploy conversational AI for African business contexts." },
              { title: "Fine-tuning Projects",    desc: "Adapt Africlaude-7B to your specific domain or language." },
              { title: "Research & Benchmarking", desc: "Use in academic research on African language NLP." },
              { title: "Content Generation",      desc: "Text generation, summarization, and classification tasks." },
              { title: "Education Tools",         desc: "Intelligent tutoring systems for African students." },
              { title: "Business Automation",     desc: "AI-powered workflows for African markets." },
            ].map((item) => (
              <div key={item.title} className="p-5 rounded-2xl border border-border bg-card space-y-2">
                <p className="font-extrabold text-foreground text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Model Series */}
        <section className="container-padded py-20 border-t border-border">
          <h2
            className="font-extrabold text-foreground mb-10"
            style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", letterSpacing: "-0.03em" }}
          >
            The Africlaude Series
          </h2>
          <div className="space-y-4">
            {series.map((model) => (
              <div key={model.name}
                className="flex items-center justify-between p-6 rounded-2xl border border-border bg-card gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-widest ${
                      model.status === "live"    ? "bg-foreground text-background" :
                      model.status === "coming"  ? "border border-border text-muted-foreground" :
                                                   "border border-border text-muted-foreground opacity-50"
                    }`}>
                      {model.status === "live" ? "Live" : model.status === "coming" ? "Coming" : "Planned"}
                    </span>
                    <span className="font-extrabold text-foreground">{model.name}</span>
                    <span className="text-xs text-muted-foreground">{model.params} params</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{model.desc}</p>
                </div>
                {model.link ? (
                  <a href={model.link} target="_blank" rel="noopener noreferrer"
                    className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border text-sm font-bold hover:bg-muted transition-colors">
                    Download <ExternalLink size={12} />
                  </a>
                ) : (
                  <span className="flex-shrink-0 text-xs text-muted-foreground opacity-50">Not yet</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Citation */}
        <section className="container-padded py-20 border-t border-border">
          <h2
            className="font-extrabold text-foreground mb-6"
            style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", letterSpacing: "-0.03em" }}
          >
            Citation
          </h2>
          <div className="bg-muted rounded-2xl p-6 font-mono text-sm text-muted-foreground leading-relaxed">
            @misc{"{"}<br />
            &nbsp;&nbsp;africlaude2025,<br />
            &nbsp;&nbsp;author = {"{"} Ariyo, Emmanuel {"}"}<br />
            &nbsp;&nbsp;title = {"{"} Africlaude: Open-Source African Language Models {"}"}<br />
            &nbsp;&nbsp;year = {"{"} 2025 {"}"}<br />
            &nbsp;&nbsp;publisher = {"{"} Axiveri {"}"}<br />
            &nbsp;&nbsp;url = {"{"} https://huggingface.co/Axiveri/Africlaude-7B {"}"}<br />
            {"}"}
          </div>
        </section>

        {/* CTA */}
        <section className="container-padded py-20 border-t border-border">
          <div className="max-w-2xl">
            <h2
              className="font-extrabold text-foreground mb-4"
              style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", letterSpacing: "-0.03em" }}
            >
              Get involved
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed text-lg">
              Africlaude is open-source and community-driven. Download the model, contribute
              datasets, report issues, or reach out to collaborate.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="https://huggingface.co/Axiveri/Africlaude-7B" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background font-bold text-sm hover:opacity-90 transition-opacity">
                Download Model <ExternalLink size={14} />
              </a>
              <a href="mailto:contact@ememzyvisuals.com?subject=Africlaude Collaboration"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border font-bold text-sm hover:bg-muted transition-colors">
                Contact Emmanuel <ArrowRight size={14} />
              </a>
              <Link href="/axiveri"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border font-bold text-sm hover:bg-muted transition-colors">
                <ArrowLeft size={14} /> Back to Axiveri
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
