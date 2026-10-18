"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";

/** Cuenta atrás hasta el inicio (00:00 local del primer día). Se renderiza solo en el cliente. */
export function Countdown({ start }: { start: string }) {
  const { L } = useLang();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  const target = new Date(`${start}T00:00:00`).getTime();
  const diff = now === null ? null : Math.max(0, target - now);
  const days = diff === null ? "–" : Math.floor(diff / 86_400_000);
  const hours = diff === null ? "–" : Math.floor((diff % 86_400_000) / 3_600_000);
  const mins = diff === null ? "–" : Math.floor((diff % 3_600_000) / 60_000);

  if (diff === 0) {
    return <p className="font-display text-lg font-bold text-neon-magenta">{L("¡Está pasando ahora! 💃🕺", "Happening now! 💃🕺")}</p>;
  }

  return (
    <div className="flex gap-2" role="timer" aria-live="off">
      {[
        { v: days, l: L("días", "days") },
        { v: hours, l: L("horas", "hours") },
        { v: mins, l: L("min", "min") },
      ].map((x) => (
        <div key={x.l} className="min-w-[4.25rem] rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-center">
          <div className="font-display text-2xl font-black tabular-nums text-white">{x.v}</div>
          <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">{x.l}</div>
        </div>
      ))}
    </div>
  );
}
