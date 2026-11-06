// components/sections/Ticker.tsx
// Under the hero: a line of real numbers moving sideways in the big condensed type, then a line of the places I
// have built with, each mark drawn here in its own colours.
const FACTS = ["8 open models", "4 open datasets", "2,500+ downloads a month", "5 African languages", "10+ products shipped", "Speech AI in production"];

// the logos as plain white marks, no tiles, like a "trusted by" strip: each mark with its name in its own heavy type
const LOGOS: { name: string; src?: string }[] = [
  { name: "PlotWeaver", src: "/brand/plotweaver-icon.svg" },
  { name: "Axiveri", src: "/brand/axiveri-mono.png" },
  { name: "Renncora", src: "/brand/renncora-mono.png" },
  { name: "Hugging Face", src: "/logos/huggingface.svg" },
  { name: "Kaggle", src: "/logos/kaggle.svg" },
  { name: "Freelance" },
];

export function Ticker() {
  const facts = [...FACTS, ...FACTS];
  const logos = [...LOGOS, ...LOGOS, ...LOGOS];
  return (
    <section aria-label="In numbers" className="overflow-hidden border-y border-border py-6">
      <div className="ticker">
        {facts.map((f, i) => (
          <span key={i} className="flex shrink-0 items-center font-anton text-[clamp(2rem,4.4vw,4rem)] uppercase leading-none text-foreground/90">
            <span className="px-8">{f}</span>
            <span className="text-brand">&#10022;</span>
          </span>
        ))}
      </div>
      <div className="ticker ticker-slow mt-6" style={{ animationDirection: "reverse" }}>
        {logos.map((l, i) => (
          <span key={i} className="flex shrink-0 items-center">
            <span className="mx-10 flex items-center gap-3 font-display text-[clamp(1.3rem,2vw,1.9rem)] font-extrabold tracking-[-0.04em] text-foreground/75">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {l.src && <img src={l.src} alt="" className="logo-mono h-8 w-auto max-w-[44px] object-contain" />}
              {l.name}
            </span>
            <span className="text-foreground/40">+</span>
          </span>
        ))}
      </div>
    </section>
  );
}
