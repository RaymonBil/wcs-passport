"use client";

import dynamic from "next/dynamic";
import type { Festival } from "@/lib/festivals";
import { useLang } from "@/lib/i18n";

const FestivalMap = dynamic(() => import("./FestivalMap"), {
  ssr: false,
  loading: () => <div className="h-[520px] animate-pulse rounded-3xl border border-white/10 bg-white/5" />,
});

export function MapView({ festivals, height }: { festivals: Festival[]; height?: number }) {
  const { L } = useLang();
  return (
    <div className="space-y-3">
      <FestivalMap festivals={festivals} height={height} />
      <ul className="flex flex-wrap gap-4 text-xs text-slate-400">
        <li className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-amber-500" /> {L("España", "Spain")}
        </li>
        <li className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-neon-cyan" /> {L("Europa", "Europe")}
        </li>
        <li className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-neon-magenta" /> {L("Tus favoritos", "Your favourites")}
        </li>
        <li className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-green-500" /> {L("Tu salida", "Your origin")}
        </li>
      </ul>
    </div>
  );
}
