// components/sections/Hero.tsx
// The opening screen, laid out like the character-slider reference: the nickname huge along the bottom, running to
// the edges in ash grey; my cut-out 3D character standing in front of it so his body covers the middle letters; the
// title and one line top left, the buttons and Axiveri on the right. On phones the word splits into two lines.
import Link from "next/link";
import { VisitorCounter } from "@/components/ui/VisitorCounter";
import { HeroMe } from "./HeroMe";

export function Hero() {
  return (
    <section aria-label="Introduction" className="hero-stage relative overflow-hidden bg-black text-white">
      <div className="relative mx-auto h-[min(100svh,1000px)] min-h-[640px] max-w-[2400px]">
        {/* the word, behind, along the bottom */}
        <h1 className="hero-word pointer-events-none absolute inset-x-0 bottom-[4%] select-none whitespace-nowrap text-center font-anton uppercase leading-[0.8]">
          <span className="sr-only">Hi, I&apos;m </span>
          <span className="hidden md:inline">Ememzyvisuals</span>
          <span className="md:hidden">Ememzy<br />visuals</span>
        </h1>

        {/* me, in front */}
        <div className="hero-me pointer-events-none absolute inset-x-0 bottom-0 top-[14%] flex justify-center">
          <HeroMe />
        </div>

        {/* the side text */}
        <div className="container-padded relative z-10 flex h-full flex-col gap-6 pt-24 md:flex-row md:items-start md:justify-between md:pt-[30vh]">
          <div className="hero-rise max-w-[19rem]" style={{ animationDelay: "250ms" }}>
            <p className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-white">Machine learning<br />engineer</p>
            <p className="mt-4 text-[14px] font-semibold leading-relaxed text-white/70">
              I build speech and language AI for African languages, and the web products that put it in people&apos;s hands.
            </p>
          </div>
          <div className="hero-rise hidden max-w-[19rem] flex-col gap-4 md:flex md:items-end md:text-right" style={{ animationDelay: "380ms" }}>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Link href="/contact" className="btn-primary">Get in touch</Link>
              <Link href="/work" className="btn-outline !border-white/30 !text-white hover:!bg-white/10">See my work</Link>
            </div>
            <Link href="/axiveri" className="text-[13px] font-semibold leading-relaxed text-white/70 hover:text-white">
              Also building <span className="font-extrabold text-white underline decoration-white/30 underline-offset-4">Axiveri</span>, open AI research for Africa
            </Link>
            <VisitorCounter />
          </div>
        </div>
      </div>

      {/* phones: the buttons below the picture */}
      <div className="container-padded flex flex-col gap-4 pb-10 pt-6 md:hidden">
        <div className="flex flex-wrap gap-3">
          <Link href="/contact" className="btn-primary">Get in touch</Link>
          <Link href="/work" className="btn-outline !border-white/30 !text-white hover:!bg-white/10">See my work</Link>
        </div>
        <Link href="/axiveri" className="text-[13px] font-semibold text-white/70">
          Also building <span className="font-extrabold text-white underline decoration-white/30 underline-offset-4">Axiveri</span>, open AI research for Africa
        </Link>
      </div>
    </section>
  );
}
