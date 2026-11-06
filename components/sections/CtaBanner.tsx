// components/sections/CtaBanner.tsx
// The dark banner before the footer: a field of fine curved lines behind, the line, and one clear way in.
import Link from "next/link";

export function CtaBanner() {
  return (
    <section className="container-padded py-section">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[36px] border border-border bg-card px-6 py-16 text-center text-foreground md:py-24">
        <h2 className="relative font-display text-[clamp(2.2rem,5vw,4.4rem)] font-extrabold leading-[1.02] tracking-[-0.045em]">Let&apos;s build your project.</h2>
        <p className="relative mx-auto mt-4 max-w-xl text-[17px] font-semibold text-muted-foreground">A product, a voice for your app, or AI that understands your customers. Tell me about it.</p>
        <Link href="/contact" className="relative mt-8 inline-flex items-center rounded-full bg-foreground px-8 py-3.5 text-[15px] font-extrabold text-background transition-transform hover:-translate-y-0.5">
          Send a message
        </Link>
      </div>
    </section>
  );
}
