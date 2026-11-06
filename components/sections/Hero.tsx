// components/sections/Hero.tsx
// The opening screen, laid out like the character-slider reference: the nickname huge along the bottom, running to
// the edges in ash grey; my cut-out 3D character standing in front of it so his body covers the middle letters; the
// title and one line top left, the buttons and Axiveri on the right. On phones the word splits into two lines.
import Link from "next/link";
import { VisitorCounter } from "@/components/ui/VisitorCounter";
import { HeroMe } from "./HeroMe";
import { HeroScroll } from "./HeroScroll";

export function Hero() {
  return (
    <section id="hero" aria-label="Introduction" className="hero-stage relative overflow-hidden bg-black text-white">
      <HeroScroll />
      <div className="relative mx-auto h-[min(100svh,1000px)] min-h-[640px] max-w-[2400px]">
        {/* the word, behind, along the bottom */}
        <h1 className="hero-word pointer-events-none absolute inset-x-0 bottom-[4%] select-none whitespace-nowrap text-center font-anton font-normal uppercase leading-[0.82]">
          <span className="sr-only">Hi, I&apos;m </span>
          <span className="hidden md:inline">Ememzyvisuals</span>
          <span className="block md:hidden">Ememzy</span><span className="block md:hidden">visuals</span>
        </h1>

        {/* me, in front */}
        <div className="hero-me pointer-events-none absolute inset-x-0 bottom-0 top-[14%] flex justify-center">
          <HeroMe />
        </div>

        {/* the side text, as in the reference: a title in light caps and a few small facts on the left, a short
            line and the buttons on the right */}
        <div className="hero-side container-padded relative z-10 flex h-full flex-col gap-6 pt-24 md:flex-row md:items-start md:justify-between md:pt-[34vh]">
          <div className="max-w-[24rem]">
            <p className="hero-in font-display text-[clamp(1.5rem,2vw,2rem)] font-bold leading-[1.15] tracking-[-0.03em] text-white" style={{ animationDelay: "350ms" }}>
              Software developer,
              <br />
              AI and ML engineer.
            </p>
            <p className="hero-in mt-3 text-[14px] font-semibold leading-relaxed text-white/65" style={{ animationDelay: "480ms" }}>
              NLP research for African and low-resource languages.
            </p>
            <div className="hero-in mt-4 flex gap-4 text-[13px] font-bold text-white" style={{ animationDelay: "560ms" }}>
              <a href="https://github.com/Ememzyvisuals" target="_blank" rel="noreferrer" className="underline decoration-white/30 underline-offset-4 hover:decoration-white">GitHub</a>
              <a href="https://huggingface.co/Axiveri" target="_blank" rel="noreferrer" className="underline decoration-white/30 underline-offset-4 hover:decoration-white">Hugging Face</a>
            </div>
          </div>
          <div className="hidden max-w-[19rem] md:block">
            <p className="hero-in text-[14px] font-semibold leading-relaxed text-white/65" style={{ animationDelay: "560ms" }}>
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

      {/* phones: the buttons below the picture */}
      <div className="container-padded flex flex-col gap-4 pb-10 pt-6 md:hidden">
        <div className="flex flex-wrap gap-2.5">
          <Link href="/contact" className="hero-chip hero-chip-on">Get in touch</Link>
          <Link href="/work" className="hero-chip">See my work</Link>
        </div>
        <Link href="/axiveri" className="text-[13px] font-semibold text-white/70">
          Also building <span className="font-extrabold text-white underline decoration-white/30 underline-offset-4">Axiveri</span>, open AI research for Africa
        </Link>
      </div>
    </section>
  );
}
