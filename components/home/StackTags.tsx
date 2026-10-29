"use client";
import dynamic from "next/dynamic";
import { useRef } from "react";
import { setStage } from "@/lib/stage";
import { useThreeOn } from "@/lib/theme";

const KeysView = dynamic(() => import("@/components/three/KeysView"), { ssr: false });

// Tech stack as keycaps. The HTML list sets the layout and stays readable for screen readers
// and crawlers; the 3D keys are drawn exactly on top of each item.
export default function StackTags({ groups }: { groups: { group: string; items: string[] }[] }) {
  const three = useThreeOn();
  const box = useRef<HTMLDivElement>(null);
  return (
    <div ref={box} className="relative">
      {three && <KeysView container={box} />}
      <div className="relative space-y-10">
        {groups.map((g) => (
          <div key={g.group}>
            <h3 className="kicker mb-4">{g.group}</h3>
            <ul className="flex flex-wrap gap-2.5 sm:gap-3">
              {g.items.map((it) => (
                <li
                  key={it}
                  data-key={it}
                  tabIndex={0}
                  onPointerEnter={() => setStage({ focus: "key:" + it })}
                  onPointerLeave={() => setStage({ focus: null })}
                  onFocus={() => setStage({ focus: "key:" + it })}
                  onBlur={() => setStage({ focus: null })}
                  className={`select-none rounded-xl px-4 py-3 font-display text-[15px] font-bold sm:text-base ${
                    three ? "text-transparent" : "glass shadow-[0_4px_0_hsl(var(--fg)/0.15)]"
                  }`}
                >
                  {it}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
