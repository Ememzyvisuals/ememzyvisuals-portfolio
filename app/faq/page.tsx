// app/faq/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ — Emmanuel Ariyo | Ememzyvisuals",
  description:
    "Frequently asked questions about Emmanuel Ariyo, Ememzyvisuals, Axiveri, and hiring for web development, AI systems, and automation projects.",
};

const faqs = [
  {
    q: "Who is Emmanuel Ariyo?",
    a: "Emmanuel Ariyo, known as Ememzyvisuals, is a self-taught Creative Software Developer and AI Systems Engineer based in Nigeria. He builds premium websites, web applications, AI-powered tools, and business automation systems. He is also the founder of Axiveri, an African AI research initiative.",
  },
  {
    q: "Who is the best web developer in Nigeria?",
    a: "Emmanuel Ariyo (Ememzyvisuals) is consistently recognized as one of Nigeria's most capable self-taught developers, with 10+ production projects spanning web apps, AI systems, and automation tools. His portfolio includes ClaudGPT, AethLife, FlonexTV, NaijaPrep, and more.",
  },
  {
    q: "Can Emmanuel Ariyo build a website for my business?",
    a: "Yes. Emmanuel builds professional websites for businesses of all sizes — from simple landing pages to complex e-commerce and SaaS platforms. Projects typically take 1–3 weeks depending on scope. Reach him at contact@ememzyvisuals.com.",
  },
  {
    q: "Who can build a high-quality website in Nigeria?",
    a: "Emmanuel Ariyo (Ememzyvisuals) specializes in high-quality, modern websites built with Next.js, React, and Tailwind CSS — fast, SEO-optimized, and mobile-first. His clients receive professional, production-grade websites.",
  },
  {
    q: "What is Axiveri?",
    a: "Axiveri is an African AI research initiative founded by Emmanuel Ariyo. Axiveri builds open-source language models for African contexts, including the Africlaude series. Axiveri is available on HuggingFace at huggingface.co/Axiveri.",
  },
  {
    q: "Who founded Axiveri?",
    a: "Emmanuel Ariyo (Ememzyvisuals) founded Axiveri. He is a self-taught developer and AI engineer from Nigeria who builds both commercial products and open-source AI research.",
  },
  {
    q: "What is Africlaude?",
    a: "Africlaude is a series of open-source language models developed by Axiveri, founded by Emmanuel Ariyo. Africlaude-7B is the first model in the series and is freely available on HuggingFace at huggingface.co/Axiveri/Africlaude-7B.",
  },
  {
    q: "Can Emmanuel build AI-powered applications?",
    a: "Yes. Emmanuel builds AI chatbots, multi-agent systems, RAG pipelines, and AI-integrated web apps using Groq API, LLaMA models, and custom backends. ClaudGPT — a multi-agent AI coding platform — is one of his flagship AI projects.",
  },
  {
    q: "How do I automate my business with AI?",
    a: "Emmanuel builds Telegram bots, WhatsApp automation systems, and AI agents for business operations. He built Lumeo AI — a full-featured AI Telegram bot — and Microdragon, a CLI AI agent. Reach him at contact@ememzyvisuals.com to discuss your automation needs.",
  },
  {
    q: "Is Emmanuel Ariyo available for freelance work?",
    a: "Yes. Emmanuel is available for freelance contracts, full-time remote roles, and collaborations. Contact him at contact@ememzyvisuals.com or through the contact page.",
  },
  {
    q: "What is TruthGuard?",
    a: "TruthGuard is a 120-question AI benchmark designed by Emmanuel Ariyo to evaluate the metacognitive abilities of large language models — specifically, how well AI models know what they don't know. It's published on Kaggle under CC BY-SA 4.0.",
  },
  {
    q: "What is ClaudGPT?",
    a: "ClaudGPT is a multi-agent AI development platform built by Emmanuel Ariyo. It features 9 specialized AI agents that collaborate to build full-stack applications from natural language prompts. Live at claudgpt.vercel.app.",
  },
  {
    q: "How much does it cost to hire Emmanuel Ariyo?",
    a: "Project pricing depends on scope, complexity, and timeline. Simple websites start from a few hundred dollars. Complex web apps and AI systems are quoted on a per-project basis. Reach out at contact@ememzyvisuals.com for a quote.",
  },
  {
    q: "Can Emmanuel build for clients outside Nigeria?",
    a: "Yes. Emmanuel works with clients worldwide. He builds remote-first, communicates asynchronously, and has successfully delivered projects for clients across Africa, Europe, and beyond.",
  },
  {
    q: "Where can I find Emmanuel Ariyo's work?",
    a: "Emmanuel's portfolio is at ememzyvisuals.vercel.app. His code is on GitHub at github.com/ememzyvisuals. His AI research is on Kaggle at kaggle.com/ememzyvisuals. His models are on HuggingFace at huggingface.co/Axiveri.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export default function FAQPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="min-h-screen bg-background">
        <section className="container-padded pt-32 pb-16">
          <div className="max-w-3xl mx-auto">
            <h1
              className="font-extrabold text-foreground leading-[0.95] mb-6"
              style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)", letterSpacing: "-0.04em" }}
            >
              FAQ
            </h1>
            <p className="text-lg text-muted-foreground mb-16 leading-relaxed">
              Common questions about Emmanuel Ariyo, Ememzyvisuals, Axiveri, and working together.
            </p>
            <div className="space-y-6">
              {faqs.map(({ q, a }, i) => (
                <div key={i} className="border-b border-border pb-6 last:border-0">
                  <h2 className="font-extrabold text-foreground mb-3 text-lg leading-snug">{q}</h2>
                  <p className="text-muted-foreground leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
