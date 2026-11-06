// components/sections/CtaBanner.tsx
// The dark banner before the footer: a field of fine curved lines behind, the line, and one clear way in.
import Link from "next/link";

export function CtaBanner() {
  return (
    <section className="container-padded py-section">
      <div className="lines-bg relative mx-auto max-w-6xl overflow-hidden rounded-[36px] bg-[#0a0a0a] px-6 py-16 text-center text-white md:py-24">
        <h2 className="relative font-display text-[clamp(2.2rem,5vw,4.4rem)] font-extrabold leading-[1.02] tracking-[-0.045em]">Let&apos;s build your project.</h2>
        <p className="relative mx-auto mt-4 max-w-xl text-[17px] font-semibold text-white/65">A product, a voice for your app, or AI that understands your customers. Tell me about it.</p>
        <Link href="/contact" className="relative mt-8 inline-flex items-center gap-3 rounded-full bg-white py-2 pl-6 pr-2 text-[15px] font-extrabold text-black transition-transform hover:-translate-y-0.5">
          Send a message
          <span aria-hidden className="grid h-9 w-9 place-items-center rounded-full bg-black">
            <span className="flex flex-col gap-[3px]">{[0, 1, 2].map((k) => <span key={k} className="block h-[2px] w-3.5 rounded bg-white" />)}</span>
          </span>
        </Link>
      </div>
    </section>
  );
}
