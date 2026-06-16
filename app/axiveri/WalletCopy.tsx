"use client";
// app/axiveri/WalletCopy.tsx — client component for clipboard copy

import { useState } from "react";
import { Check, Copy } from "lucide-react";

const wallets = [
  { label: "BTC",  network: "Bitcoin", address: "bc1qafse5cv3cc7wj2k4jqh57cymag4jnlu6ehhmu2" },
  { label: "ETH",  network: "ERC20",   address: "0xD60fECDD17d4eb78f75e8287743457e943E63468" },
  { label: "BNB",  network: "BEP20",   address: "0xD60fECDD17d4eb78f75e8287743457e943E63468" },
  { label: "USDT", network: "BEP20",   address: "0xD60fECDD17d4eb78f75e8287743457e943E63468" },
  { label: "USDT", network: "TRC20",   address: "TN5rdDY3nijQDcCgdhyPQApRTKjF3uKi3X" },
  { label: "TRX",  network: "Tron",    address: "TN5rdDY3nijQDcCgdhyPQApRTKjF3uKi3X" },
];

export function WalletCopy() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (address: string, key: string) => {
    navigator.clipboard?.writeText(address);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-3">
      {wallets.map((w, i) => {
        const key = `${w.label}-${w.network}-${i}`;
        const isCopied = copied === key;
        return (
          <div key={key} className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold text-foreground">{w.label}</span>
              <span className="text-[10px] text-muted-foreground">{w.network}</span>
            </div>
            <button
              onClick={() => copy(w.address, key)}
              title="Click to copy"
              className="w-full flex items-center justify-between gap-2 text-[10px] font-mono text-muted-foreground bg-muted px-3 py-2 rounded-xl hover:text-foreground hover:bg-secondary transition-colors cursor-copy group"
            >
              <span className="truncate">{w.address}</span>
              {isCopied
                ? <Check size={11} className="flex-shrink-0 text-green-500" />
                : <Copy size={11} className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              }
            </button>
          </div>
        );
      })}
    </div>
  );
}
