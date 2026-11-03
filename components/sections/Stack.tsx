// components/sections/Stack.tsx
// The tools I use, in four groups. Each group title sits in the left columns, its tools in a grid on the right.
import { TOOL_GROUPS } from "@/data/tools";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function Stack() {
  return (
    <section id="stack" className="py-section">
      <div className="container-padded">
        <SectionHeader title="Tech stack" intro="The 32 tools I reach for, and what I use each one for." />

        <div className="mt-stack border-t border-border">
          {TOOL_GROUPS.map((g) => (
            <div key={g.title} className="grid gap-6 border-b border-border py-10 lg:grid-cols-12 lg:gap-8">
              <h3 className="text-h4 lg:col-span-3">{g.title}</h3>
              <ul className="grid grid-cols-2 gap-3 xl:grid-cols-4 lg:col-span-9">
                {g.items.map((t) => (
                  <li key={t.name} className="flex flex-col items-start gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:gap-4">
                    <span className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl bg-white ring-1 ring-black/5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={t.logo} alt="" width={26} height={26} className="h-[26px] w-[26px] object-contain" loading="lazy" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-small font-semibold text-foreground">{t.name}</p>
                      <p className="mt-0.5 text-caption text-muted-foreground">{t.use}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
