"use client";

import { Navigation } from "lucide-react";
import { type OriginId, origins } from "@/lib/geo";
import { useLang } from "@/lib/i18n";
import { usePassport } from "@/lib/store";
import { cn } from "@/lib/utils";

export function OriginSelect({ className }: { className?: string }) {
  const { L } = useLang();
  const origin = usePassport((s) => s.origin);
  const setOrigin = usePassport((s) => s.setOrigin);
  return (
    <label className={cn("flex items-center gap-2 text-sm text-slate-300", className)}>
      <Navigation className="h-4 w-4 text-neon-cyan" />
      <span className="whitespace-nowrap">{L("Salgo desde", "Leaving from")}</span>
      <select
        value={origin}
        onChange={(e) => setOrigin(e.target.value as OriginId)}
        className="rounded-full border border-white/15 bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white focus:border-neon-cyan focus:outline-none"
      >
        {Object.entries(origins).map(([id, o]) => (
          <option key={id} value={id}>
            {o.name}
          </option>
        ))}
      </select>
    </label>
  );
}
