// components/sections/Hero.tsx
// The opening screen, after the character-slider reference. The screen stays put while the page scrolls through four
// slides: my nickname with my moving 3D character, then BUILD (at the laptop), VOICE (with the mic) and DESIGN (with
// the tablet). Each slide changes the big word behind me, the character in front, the background tint and the short
// text on either side, with a smooth cross-fade (see HeroScroll for the slide and globals.css for the motion).
import Link from "next/link";
import { VisitorCounter } from "@/components/ui/VisitorCounter";
import { HeroMe } from "./HeroMe";
import { HeroScroll } from "./HeroScroll";

const SLIDES = [
  {
    word: "Build", img: "/images/me/laptop.webp", alt: "My 3D character typing on a laptop",
    title: ["Full-stack products,", "web and mobile."], line: "Next.js, React, Flutter, APIs and the cloud.",
    text: "From the first sketch to a live app: ClaudGPT, AethLife, FlonexTV, NaijaPrep and more, each built and shipped end to end.",
    cta: { href: "/work", label: "See the products" },
  },
  {
    word: "Voice", img: "/images/me/voice.webp", alt: "My 3D character with headphones, speaking into a microphone",
    title: ["Speech AI for", "African languages."], line: "Text to speech and speech recognition at PlotWeaver.",
    text: "Voices that carry emotion and hold a real conversation in Yoruba, Hausa, Igbo, Pidgin and Nigerian English.",
    cta: { href: "/#open-models", label: "See the models" },
  },
  {
    word: "Design", img: "/images/me/design.webp", alt: "My 3D character drawing on a tablet",
    title: ["I design", "what I build."], line: "Interfaces, motion and 3D, made with care.",
    text: "Every product here was designed by me too, from the first wireframe to the last animation, including this site.",
    cta: { href: "/contact", label: "Work with me" },
  },
];

export function Hero() {
  return (
    <section id="hero" aria-label="Introduction" data-slide="0" className="hero-stage relative bg-black text-white" style={{ height: `${(SLIDES.length + 1) * 100}svh` }}>
      <HeroScroll count={SLIDES.length + 1} />
      <div className="hero-pin sticky top-0 h-[100svh] min-h-[640px] overflow-hidden">
        <div className="relative mx-auto h-full max-w-[2400px]">
          {/* slide 0: my nickname and my moving character */}
          <div className="hero-slide" data-i="0">
            <p className="hero-hi pointer-events-none absolute inset-x-0 select-none text-center font-display font-bold tracking-[-0.02em] text-white/80">Hi, I am</p>
            <h1 className="hero-word pointer-events-none absolute inset-x-0 bottom-[4%] select-none whitespace-nowrap text-center font-anton font-normal uppercase leading-[0.82]">
              <span className="sr-only">Hi, I&apos;m </span>
              <span className="hidden md:inline">Ememzyvisuals</span>
              <span className="block md:hidden">Ememzy</span><span className="block md:hidden">visuals</span>
            </h1>
            <div className="hero-me pointer-events-none absolute inset-x-0 bottom-0 top-[14%] flex justify-center">
              <HeroMe />
            </div>
            <div className="hero-side container-padded relative z-10 flex h-full flex-col gap-6 pt-24 md:flex-row md:items-start md:justify-between md:pt-[34vh]">
              <div className="mx-auto max-w-[24rem] text-center md:mx-0 md:max-w-[28rem] md:text-left">
                <p className="hero-in font-display text-[clamp(1.6rem,2.5vw,2.6rem)] font-bold leading-[1.15] tracking-[-0.03em] text-white" style={{ animationDelay: "350ms" }}>
                  Software developer,
                  <br />
                  AI and ML engineer.
                </p>
                <p className="hero-in mt-3 text-[14px] font-semibold leading-relaxed text-white/65 md:text-[15.5px]" style={{ animationDelay: "480ms" }}>
                  NLP research for African and low-resource languages.
                </p>
                <div className="hero-in mt-4 flex justify-center gap-4 text-[13px] font-bold text-white md:justify-start" style={{ animationDelay: "560ms" }}>
                  <a href="https://github.com/Ememzyvisuals" target="_blank" rel="noreferrer" className="underline decoration-white/30 underline-offset-4 hover:decoration-white">GitHub</a>
                  <a href="https://huggingface.co/Axiveri" target="_blank" rel="noreferrer" className="underline decoration-white/30 underline-offset-4 hover:decoration-white">Hugging Face</a>
                </div>
                <div className="hero-in mt-5 flex justify-center gap-2.5 md:hidden" style={{ animationDelay: "640ms" }}>
                  <Link href="/contact" className="hero-chip hero-chip-on">Get in touch</Link>
                  <Link href="/work" className="hero-chip">See my work</Link>
                </div>
              </div>
              <div className="hidden max-w-[22rem] md:block">
                <p className="hero-in text-[15.5px] font-semibold leading-relaxed text-white/65" style={{ animationDelay: "560ms" }}>
                  I research and build speech and language AI for African languages, and the software that puts it in people&apos;s hands. Also building{" "}
                  <Link href="/axiveri" className="font-bold text-white underline decoration-white/30 underline-offset-4">Axiveri</Link>, open AI research for Africa.
                </p>
                <div className="hero-in mt-5 flex gap-2.5" style={{ animationDelay: "660ms" }}>
                  <Link href="/contact" className="hero-chip hero-chip-on">Get in touch</Link>
                  <Link href="/work" className="hero-chip">See my work</Link>
                </div>
                <div className="hero-in mt-4" style={{ animationDelay: "720ms" }}><VisitorCounter /></div>
              </div>
            </div>
          </div>

          {/* slides 1 to 3: what I do */}
          {SLIDES.map((s, k) => (
            <div key={s.word} className="hero-slide" data-i={k + 1} aria-hidden>
              <p className="hero-word hero-word-alt pointer-events-none absolute inset-x-0 bottom-[4%] select-none whitespace-nowrap text-center font-anton font-normal uppercase leading-[0.82]">{s.word}</p>
              <div className="hero-char pointer-events-none absolute inset-x-0 bottom-0 top-[16%] flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.img} alt={s.alt} loading="lazy" className="h-full w-auto max-w-none object-contain object-bottom" />
              </div>
              <div className="hero-side-alt container-padded relative z-10 flex h-full flex-col gap-6 pt-24 md:flex-row md:items-start md:justify-between md:pt-[13vh]">
                <div className="mx-auto max-w-[24rem] text-center md:mx-0 md:max-w-[28rem] md:text-left">
                  <p className="font-display text-[clamp(1.9rem,3.4vw,3.6rem)] font-extrabold leading-[1.08] tracking-[-0.035em] text-white">
                    {s.title[0]}
                    <br />
                    {s.title[1]}
                  </p>
                  <p className="mt-3 text-[15px] font-semibold leading-relaxed text-white/75 md:text-[18px]">{s.line}</p>
                </div>
                <div className="hidden max-w-[24rem] md:block">
                  <p className="text-[17px] font-semibold leading-relaxed text-white/75">{s.text}</p>
                  <div className="mt-5 flex gap-2.5">
                    <Link href={s.cta.href} tabIndex={-1} className="hero-chip hero-chip-on">{s.cta.label}</Link>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* where I am in the slides */}
          <div className="hero-dots pointer-events-none absolute right-5 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-2.5 md:flex">
            {Array.from({ length: SLIDES.length + 1 }, (_, i) => <span key={i} data-i={i} className="hero-dot" />)}
          </div>
        </div>
      </div>

    </section>
  );
}
