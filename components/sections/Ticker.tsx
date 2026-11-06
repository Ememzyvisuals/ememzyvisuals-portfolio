// components/sections/Ticker.tsx
// Under the hero: a line of real numbers moving sideways in the big condensed type, then a line of the places I
// have built with, each mark drawn here in its own colours.
const FACTS = ["8 open models", "4 open datasets", "2,500+ downloads a month", "5 African languages", "10+ products shipped", "Speech AI in production"];

const LOGOS: { name: string; mark: React.ReactNode }[] = [
  { name: "PlotWeaver", mark: <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#c4f000]">{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/brand/plotweaver-icon.svg" alt="" className="h-5 w-auto" /></span> },
  { name: "Axiveri", mark: <span className="grid h-9 w-9 place-items-center overflow-hidden rounded-xl bg-[#fc6401]">{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/brand/axiveri.png" alt="" className="h-full w-full object-cover" /></span> },
  { name: "Renncora", mark: <span className="grid h-9 w-9 place-items-center overflow-hidden rounded-xl bg-white">{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/brand/renncora.png" alt="" className="h-6 w-auto" /></span> },
  { name: "Hugging Face", mark: <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#ffd21e]">{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/logos/huggingface.svg" alt="" className="h-6 w-6" /></span> },
  { name: "Kaggle", mark: <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#20beff]">{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/logos/kaggle.svg" alt="" className="h-5 w-5 brightness-0 invert" /></span> },
  { name: "Freelance", mark: <span className="grid h-9 w-9 place-items-center rounded-xl border border-border font-display text-sm font-extrabold">F</span> },
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
          <span key={i} className="mx-6 flex shrink-0 items-center gap-3 text-[17px] font-extrabold tracking-[-0.02em] text-foreground/80">
            {l.mark}
            {l.name}
          </span>
        ))}
      </div>
    </section>
  );
}
