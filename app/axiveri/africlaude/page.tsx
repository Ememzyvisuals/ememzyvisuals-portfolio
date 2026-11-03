// app/axiveri/africlaude/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Africlaude, Open-Source African Language Model | Axiveri",
  description:
    "Africlaude is a series of open-source language models by Axiveri, founded by Emmanuel Ariyo. Africlaude-7B is live on HuggingFace. Africlaude-7B v2, with Yoruba, Igbo, Hausa support, is coming soon.",
  openGraph: {
    title: "Africlaude, African Language Model Series by Axiveri",
    description: "Africlaude-7B is live. Africlaude-7B v2 with Nigerian language support is coming soon.",
    url: "https://ememzyvisuals.vercel.app/axiveri/africlaude",
  },
};

const modelSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Africlaude-7B",
  applicationCategory: "ArtificialIntelligence",
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
  description: "Africlaude-7B is the first model in the Africlaude series, an open-source 7B parameter language model by Axiveri, founded by Emmanuel Ariyo.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const series = [
  {
    name: "Africlaude-7B",
    version: "v1",
    status: "live",
    desc: "The first model in the series. Available now on HuggingFace for download, fine-tuning, and research use.",
    tags: ["7B Parameters", "Open Source", "HuggingFace"],
    link: "https://huggingface.co/Axiveri/Africlaude-7B",
  },
  {
    name: "Africlaude-7B v2",
    version: "v2",
    status: "coming",
    desc: "An improved second version with support for Yoruba, Igbo, Hausa, and other Nigerian languages. Better dataset, stronger performance.",
    tags: ["Yoruba", "Igbo", "Hausa", "Improved Dataset"],
    link: null,
  },
  {
    name: "More models",
    version: null,
    status: "soon",
    desc: "Axiveri is actively researching and building. More models are coming, stay tuned.",
    tags: [],
    link: null,
  },
];

export default function AfriclaудePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(modelSchema) }} />
      <div className="min-h-screen bg-background">

        {/* Back */}
        <div className="container-padded pt-12 md:pt-16 pb-4">
          <Link href="/axiveri" className="inline-flex items-center gap-2 text-small text-muted-foreground hover:text-foreground transition-colors font-bold"> Back to Axiveri
          </Link>
        </div>

        {/* Hero */}
        <section className="container-padded pt-8 pb-20">
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <span className="text-caption font-extrabold px-3 py-1.5 rounded-lg bg-foreground text-background">
                Live, Africlaude-7B
              </span>
              <span className="text-caption text-muted-foreground font-bold">
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
              className="text-h1 text-foreground mb-6"
            >
              Africlaude
            </h1>
            <p className="text-lead text-muted-foreground max-w-2xl mb-10">
              An open-source language model series built for Africa, available for research,
              fine-tuning, and production use. Yoruba, Igbo and Hausa support coming in v2.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="https://huggingface.co/Axiveri/Africlaude-7B" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background font-bold text-small hover:opacity-90 transition-opacity">
                Download Africlaude-7B
              </a>
              <a href="https://huggingface.co/Axiveri" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border font-bold text-small hover:bg-muted transition-colors">
                Axiveri on HuggingFace
              </a>
            </div>
          </div>
        </section>

        {/* Model info */}
        <section className="container-padded py-20 border-t border-border">
          <div className="grid md:grid-cols-2 gap-16">
            <div className="space-y-5">
              <h2 className="font-extrabold text-foreground">
                About Africlaude-7B
              </h2>
              <p className="text-muted-foreground text-lead">
                Africlaude-7B is a 7-billion parameter open-source language model, the first
                in Axiveri&apos;s Africlaude series. Built for researchers, developers, and builders
                who need a capable open model they can run, fine-tune, and deploy.
              </p>
              <p className="text-muted-foreground text-lead">
                Africlaude-7B v2 is in development, the next version will understand Yoruba,
                Igbo, Hausa, and other Nigerian languages with a significantly improved dataset.
              </p>
            </div>
            <div className="space-y-3">
              {[
                { label: "Parameters",    value: "7 Billion (v1)" },
                { label: "Architecture",  value: "Transformer (Decoder)" },
                { label: "License",       value: "Open, community use" },
                { label: "Available at",  value: "HuggingFace / Axiveri" },
                { label: "Developed by",  value: "Emmanuel Ariyo (Ememzyvisuals)" },
                { label: "Organization",  value: "Axiveri" },
                { label: "v1 Status",     value: "Live" },
                { label: "v2 Status",     value: "In development, Yoruba, Igbo, Hausa" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <span className="text-small text-muted-foreground">{row.label}</span>
                  <span className="text-small font-bold text-foreground text-right max-w-[55%]">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Model Series, only what's real */}
        <section className="container-padded py-20 border-t border-border">
          <h2 className="font-extrabold text-foreground mb-10">
            The Africlaude Series
          </h2>
          <div className="space-y-4">
            {series.map((model) => (
              <div key={model.name} className="flex items-center justify-between p-6 rounded-2xl liquid-glass gap-4 flex-wrap">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`text-caption font-extrabold px-2.5 py-1 rounded-lg  ${
                      model.status === "live"   ? "bg-foreground text-background" :
                      model.status === "coming" ? "border border-border text-muted-foreground" :
                                                  "border border-dashed border-border text-muted-foreground opacity-50"
                    }`}>
                      {model.status === "live" ? "Live" : model.status === "coming" ? "Coming Soon" : "More soon"}
                    </span>
                    <span className="font-extrabold text-foreground">{model.name}</span>
                  </div>
                  <p className="text-small text-muted-foreground">{model.desc}</p>
                  {model.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {model.tags.map(t => (
                        <span key={t} className="text-caption font-bold px-2.5 py-1 rounded-lg border border-border text-muted-foreground">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
                {model.link ? (
                  <a href={model.link} target="_blank" rel="noopener noreferrer"
                    className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-small font-bold hover:bg-muted transition-colors">
                    Download
                  </a>
                ) : model.status === "coming" ? (
                  <span className="flex-shrink-0 text-caption font-bold text-muted-foreground border border-dashed border-border px-3 py-1.5 rounded-xl">In development</span>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        {/* Use cases */}
        <section className="container-padded py-20 border-t border-border">
          <h2 className="font-extrabold text-foreground mb-10">
            What You Can Build
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { title: "Chatbots & Assistants",   desc: "Deploy conversational AI for African business contexts." },
              { title: "Fine-tuning Projects",    desc: "Adapt Africlaude-7B to your specific domain or language." },
              { title: "Research & Benchmarking", desc: "Use in academic research on African language NLP." },
              { title: "Content Generation",      desc: "Text generation, summarization, and classification tasks." },
              { title: "Education Tools",         desc: "Intelligent tutoring for African students in local languages." },
              { title: "Business Automation",     desc: "AI-powered workflows for African markets." },
            ].map((item) => (
              <div key={item.title} className="p-5 rounded-2xl liquid-glass space-y-2">
                <p className="font-extrabold text-foreground text-small">{item.title}</p>
                <p className="text-caption text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Citation */}
        <section className="container-padded py-20 border-t border-border">
          <h2 className="font-extrabold text-foreground mb-6">
            Citation
          </h2>
          <div className="bg-muted rounded-2xl p-6 font-mono text-small text-muted-foreground overflow-x-auto">
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
            <h2 className="font-extrabold text-foreground mb-4">
              Get involved
            </h2>
            <p className="text-muted-foreground mb-8 text-lead">
              Africlaude is open-source and community-driven. Download the model, contribute
              datasets, or reach out to collaborate on v2.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="https://huggingface.co/Axiveri/Africlaude-7B" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background font-bold text-small hover:opacity-90 transition-opacity">
                Download Model
              </a>
              <a href="mailto:ememzyvisuals@gmail.com?subject=Africlaude v2 Collaboration"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border font-bold text-small hover:bg-muted transition-colors">
                Contact Emmanuel </a>
              <Link href="/axiveri"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border font-bold text-small hover:bg-muted transition-colors"> Back to Axiveri
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
