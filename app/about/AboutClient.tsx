"use client";
// app/about/AboutClient.tsx

import Link from "next/link";
import { IdCard } from "@/components/three/idcard/IdCard";


export function AboutClient() {
  return (
    <div className="pt-12 md:pt-16 pb-section space-y-section-sm">

      {/* ── Hero section, photo + name ─────────────────────────── */}
      <div className="container-padded">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">

          {/* ID card on a lanyard: drag it, flick it, tap to flip */}
          <IdCard />

          {/* Intro text */}
          <div
            className="space-y-5"
          >

            <h1
              className="text-h1 text-foreground"
            >
              Emmanuel Ariyo.
            </h1>

            <p className="text-lead text-foreground/80">
              I build speech AI for African languages. Not voices that just read text aloud, but speech that
              carries emotion and expression and can hold a real conversation.
            </p>

            <p className="text-body text-muted-foreground">
              By day I am a Machine Learning Engineer on the speech AI team at PlotWeaver. I am also the founder
              of Axiveri, where we publish open models so that AI can finally hear, understand and speak the
              languages Africa actually speaks. I am self-taught, and I still ship the full products around these
              models too, from the web app to the API.
            </p>

            <p className="text-small text-muted-foreground">Based in Nigeria. Working with teams anywhere.</p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/contact" className="btn-primary group text-small">
                Work with me </Link>
              <Link href="/work" className="btn-outline text-small">
                See my work
              </Link>
              <a href="/emmanuel-ariyo-cv.pdf" download className="btn-outline text-small">
                Download CV
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container-padded"><div className="section-divider" /></div>

      {/* ── My Story ────────────────────────────────────────────── */}
      <div className="container-padded">
        <div className="max-w-2xl space-y-8">
          <div>
            <h2 className="section-heading">My story</h2>
          </div>

          <div
            className="space-y-5 text-muted-foreground text-body"
          >
            <p>
              I did not study computer science and I never went to a bootcamp. I taught myself, one free tutorial,
              one late night and one broken build at a time, starting with HTML, CSS and JavaScript.
            </p>
            <p>
              What really taught me was shipping. Building something real, watching people use it, and fixing what
              they ran into. That loop took me from websites to full products, and then into AI.
            </p>
            <p>
              In AI I found the problem I want to spend my career on. Most speech technology barely works for African
              languages, and when it does, it sounds flat. People here code-switch, joke, tell stories and argue in
              tones and rhythms that today&apos;s models were never trained to hear.
            </p>
            <p>
              So that is what I work on. At PlotWeaver I train and ship speech models for African languages:
              recognition, text to speech, and now expressive speech with emotion and conversational flow. Through
              Axiveri, the research ecosystem I founded, I publish open models others can build on, including the
              NaijaVox speech recognition series, the WazobiaVoice text to speech model, the Africlaude language
              models and AfriVision for image generation.
            </p>
            <p>
              Being self-taught is not a gap in my story, it is how I work. I read the docs, I sit with problems until
              they make sense, and I build the whole thing: the data pipeline, the model, the API and the product
              people actually touch.
            </p>
          </div>
        </div>
      </div>

      <div className="container-padded"><div className="section-divider" /></div>

      {/* ── What I do ───────────────────────────────────────────── */}
      <div className="container-padded space-y-10">
        <h2
          className="section-heading"
        >
          What I do
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              title: "Products Around the Models",
              desc: "Premium websites, SaaS platforms, e-commerce stores, and full-stack applications. From landing pages to complex multi-user systems, built clean, fast, and ready for production.",
            },
            {
              title: "Speech AI for African Languages",
              desc: "Speech recognition, text to speech and expressive, conversational voices for African languages, from data pipeline and training to a production API. Open models published under Axiveri.",
            },
            {
              title: "Automate Business Processes",
              desc: "Telegram bots, WhatsApp automation, AI agents, and workflow systems. Lumeo AI handles thousands of Telegram interactions. Microdragon executes complex real-world tasks from natural language.",
            },
          ].map(({ title, desc }, i) => (
            <div
              key={title}
              className="card-surface p-6 space-y-4"
            >
              <h3 className="font-extrabold text-foreground">{title}</h3>
              <p className="text-small text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="container-padded"><div className="section-divider" /></div>

      {/* ── AI Research: open models published under Axiveri, with numbers from Hugging Face ── */}
      <div className="container-padded space-y-10">
        <div>
          <h2 className="section-heading">AI Research</h2>
          <p className="text-muted-foreground mt-3 text-lead max-w-2xl">
            Open models and datasets for African speech and language, published under{" "}
            <a href="https://huggingface.co/Axiveri" target="_blank" rel="noopener noreferrer" className="text-foreground font-semibold underline underline-offset-4">Axiveri</a>{" "}
            so anyone can build on them.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-8 border-y border-border py-8 md:grid-cols-4">
          {[
            { n: "8", l: "open models" },
            { n: "4", l: "open datasets" },
            { n: "2,500+", l: "model and dataset downloads in the last 30 days" },
            { n: "1", l: "live speech demo" },
          ].map((x) => (
            <div key={x.l}>
              <p className="font-display text-h3 font-extrabold text-foreground">{x.n}</p>
              <p className="mt-1 text-small text-muted-foreground">{x.l}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {[
            { kind: "Speech recognition", title: "NaijaVox 2.0", desc: "Whisper fine-tuned with LoRA to transcribe Yoruba, Hausa, Igbo, Nigerian Pidgin and Nigerian accented English, including speech that switches between them.", stat: "691 downloads this month", link: "https://huggingface.co/Axiveri/NaijaVox-2.0" },
            { kind: "Text to speech", title: "WazobiaVoice", desc: "A multilingual text to speech and zero-shot voice cloning model that speaks several Nigerian languages from one model.", stat: "7 likes on Hugging Face", link: "https://huggingface.co/Axiveri/WazobiaVoice" },
            { kind: "Text to speech", title: "Renpiper Pidgin", desc: "A small, fast Nigerian Pidgin voice, with an ONNX build that runs on modest hardware.", stat: "Pidgin dataset: 1,438 downloads this month", link: "https://huggingface.co/Axiveri/Renpiper-pcm-V1" },
            { kind: "Language model", title: "Africlaude-7B", desc: "An open language model tuned for African context, with AfriclaudeBench to measure how well models understand it.", stat: "24 downloads this month", link: "https://huggingface.co/Axiveri/Africlaude-7B" },
            { kind: "Image generation", title: "AfriVision", desc: "A FLUX LoRA trained on the AfriVision-30K dataset to generate African people, places and culture as they really look.", stat: "AfriVision-30K: 81 downloads this month", link: "https://huggingface.co/Axiveri/AfriVision-Base" },
            { kind: "Benchmark", title: "TruthGuard", desc: "120 questions that test whether a language model knows when it does not know. Open on Kaggle.", stat: "CC BY-SA 4.0", link: "https://www.kaggle.com/code/ememzyvisuals/truthguard-benchmark-metacognition-evaluation" },
          ].map((m, i) => (
            <a key={m.title} href={m.link} target="_blank" rel="noopener noreferrer"
              className="card-surface group flex flex-col p-6 transition-transform duration-300 hover:-translate-y-1">
              <p className="text-caption font-medium text-muted-foreground">{m.kind}</p>
              <h3 className="mt-2 font-display text-lead font-extrabold text-foreground">{m.title}</h3>
              <p className="mt-2 flex-1 text-small text-foreground/70">{m.desc}</p>
              <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-caption">
                <span className="text-muted-foreground">{m.stat}</span>
                <span className="inline-flex items-center gap-1 font-semibold text-foreground">View </span>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className="container-padded"><div className="section-divider" /></div>

      {/* ── Values ──────────────────────────────────────────────── */}
      <div className="container-padded space-y-10">
        <h2
          className="section-heading"
        >
          How I Work.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl">
          {[
            { title: "Ship, then sharpen", desc: "Real users teach more in a week than a month of planning. I get a working version out, listen, and improve it." },
            { title: "Build for real conditions", desc: "Slow networks, cheap phones, noisy rooms, people switching languages mid-sentence. If it works there, it works anywhere." },
            { title: "Own the whole pipeline", desc: "Data collection, training, evaluation, the API and the app. Knowing every layer is how I fix problems fast." },
            { title: "Measure, do not guess", desc: "Every model gets a proper evaluation, word error rates for speech recognition and listening tests for voices, before anyone else hears it." },
          ].map(({ title, desc }, i) => (
            <div
              key={title}
              className="card-surface p-6 space-y-2 border-l-2 border-foreground/20"
            >
              <h3 className="font-extrabold text-foreground">{title}</h3>
              <p className="text-small text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="container-padded"><div className="section-divider" /></div>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <div className="container-padded">
        <div
          className="rounded-2xl bg-foreground text-background p-10 md:p-14 text-center space-y-5 max-w-2xl mx-auto"
        >
          <h2
            className="font-extrabold"
          >
            Let&apos;s build something.
          </h2>
          <p className="text-background/70">
            Open to freelance contracts, full-time roles, and interesting
            collaborations. If you have a project in mind, I&apos;d love to hear about it.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-background text-foreground font-bold text-small hover:opacity-90 transition-opacity"
            >
              Get In Touch </Link>
            <Link
              href="/work"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border-2 border-background/30 text-background font-bold text-small hover:border-background/60 transition-colors"
            >
              View My Work
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
