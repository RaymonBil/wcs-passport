"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CalendarCheck2, Check, Copy, Download, Heart } from "lucide-react";
import { StatusBadges, WsdcBadge } from "@/components/festival/bits";
import { Button } from "@/components/ui/button";
import { seasonFeedUrls, seasonIcsPath } from "@/lib/calendar";
import { festivals, flagEmoji, getCity } from "@/lib/festivals";
import { dayParts, formatMonth, monthKey } from "@/lib/format";
import { useLang } from "@/lib/i18n";
import { usePassport } from "@/lib/store";
import { useToday } from "@/lib/use-today";
import { cn } from "@/lib/utils";

function SubscribeCard() {
  const { L } = useLang();
  const [urls, setUrls] = useState<ReturnType<typeof seasonFeedUrls> | null>(null);
  const [copied, setCopied] = useState(false);
  useEffect(() => setUrls(seasonFeedUrls()), []);

  return (
    <section className="rounded-3xl border border-neon-cyan/30 bg-gradient-to-br from-neon-cyan/15 to-neon-magenta/10 p-5 sm:p-6">
      <h2 className="flex items-center gap-2 font-display text-xl font-bold">
        <CalendarCheck2 className="h-5 w-5 text-neon-cyan" /> {L("Toda la temporada en tu calendario", "The whole season in your calendar")}
      </h2>
      <p className="mt-2 text-sm text-slate-300">
        {L(
          "Suscríbete una vez y verás todos los festivales en tu calendario. Si cambia una fecha, se actualiza solo.",
          "Subscribe once and every festival shows up in your calendar. If a date changes, it updates automatically."
        )}
      </p>
      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <Button asChild disabled={!urls}>
          <a href={urls?.webcal ?? "#"}>{L("iPhone / Mac / Outlook", "iPhone / Mac / Outlook")}</a>
        </Button>
        <Button asChild variant="outline" disabled={!urls}>
          <a href={urls?.google ?? "#"} target="_blank" rel="noopener noreferrer">
            Google Calendar
          </a>
        </Button>
        <Button
          variant="outline"
          onClick={async () => {
            if (!urls) return;
            try {
              await navigator.clipboard.writeText(urls.https);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            } catch {}
          }}
        >
          {copied ? <Check /> : <Copy />} {copied ? L("Copiado", "Copied") : L("Copiar enlace", "Copy link")}
        </Button>
      </div>
      <a href={seasonIcsPath()} download className="mt-3 inline-flex items-center gap-1.5 text-xs text-slate-400 underline hover:text-white">
        <Download className="h-3.5 w-3.5" /> {L("O descarga el .ics (sin actualizaciones)", "Or download the .ics (no updates)")}
      </a>
    </section>
  );
}

export function Agenda() {
  const { lang, L } = useLang();
  const today = useToday();
  const favorites = usePassport((s) => s.favorites);
  const [onlyFav, setOnlyFav] = useState(false);
  const [showPast, setShowPast] = useState(false);

  const groups = useMemo(() => {
    const list = festivals.filter((f) => (showPast || f.end >= today) && (!onlyFav || favorites.includes(f.slug)));
    const map = new Map<string, typeof list>();
    for (const f of list) {
      const k = monthKey(f.start);
      map.set(k, [...(map.get(k) ?? []), f]);
    }
    return [...map.entries()];
  }, [today, onlyFav, showPast, favorites]);

  return (
    <div className="mx-auto max-w-3xl px-4 pt-6">
      <h1 className="font-display text-3xl font-black sm:text-4xl">
        {L("Agenda ", "Calendar ")}
        <span className="text-neon-gradient">2026–2027</span>
      </h1>
      <p className="mt-1 text-slate-400">{L("Mes a mes, de octubre a octubre.", "Month by month, October to October.")}</p>

      <div className="mt-6">
        <SubscribeCard />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => setOnlyFav((v) => !v)}
          aria-pressed={onlyFav}
          className={cn(
            "flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-semibold",
            onlyFav ? "border-neon-magenta bg-neon-magenta/15 text-neon-magenta" : "border-white/15 text-slate-300"
          )}
        >
          <Heart className={cn("h-4 w-4", onlyFav && "fill-current")} /> {L("Solo mis favoritos", "My favourites only")}
        </button>
        <button
          onClick={() => setShowPast((v) => !v)}
          aria-pressed={showPast}
          className={cn("rounded-full border px-3.5 py-1.5 text-sm font-semibold", showPast ? "border-neon-cyan bg-neon-cyan/15 text-neon-cyan" : "border-white/15 text-slate-300")}
        >
          {L("Incluir finalizados", "Include finished")}
        </button>
      </div>

      {groups.length === 0 && (
        <p className="glass mt-6 rounded-3xl p-8 text-center text-slate-400">
          {L("Aún no tienes favoritos. Toca el ❤️ en cualquier festival.", "No favourites yet. Tap ❤️ on any festival.")}
        </p>
      )}

      <div className="mt-6 space-y-8">
        {groups.map(([month, list]) => (
          <section key={month} aria-labelledby={`m-${month}`}>
            <h2 id={`m-${month}`} className="sticky top-14 z-20 -mx-4 bg-slate-950/90 px-4 py-2 font-display text-lg font-extrabold text-neon-cyan backdrop-blur">
              {formatMonth(month, lang)} <span className="text-sm font-semibold text-slate-500">· {list.length}</span>
            </h2>
            <ol className="relative mt-2 space-y-2 border-l border-white/10 pl-5">
              {list.map((f) => {
                const s = dayParts(f.start, lang);
                const e = dayParts(f.end, lang);
                const fav = favorites.includes(f.slug);
                return (
                  <li key={f.slug} className="relative">
                    <span className={cn("absolute -left-[1.6rem] top-5 h-2.5 w-2.5 rounded-full ring-4 ring-slate-950", fav ? "bg-neon-magenta" : "bg-neon-cyan")} />
                    <Link href={`/festival/${f.slug}/`} className="glass flex items-center gap-4 rounded-2xl p-3 hover:border-neon-cyan/40">
                      <div className="w-16 shrink-0 text-center">
                        {f.dateStatus === "tentative" ? (
                          <span className="font-display text-lg font-black text-amber-300">≈</span>
                        ) : (
                          <>
                            <div className="font-display text-xl font-black leading-none">
                              {s.day}
                              {e.day !== s.day && <span className="text-slate-500">–{e.day}</span>}
                            </div>
                            <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">{s.weekday}</div>
                          </>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-display font-bold">
                          {flagEmoji(f.countryCode)} {f.name}
                        </h3>
                        <p className="truncate text-sm text-slate-400">
                          {getCity(f).name}, {f.country}
                        </p>
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          <WsdcBadge festival={f} />
                          <StatusBadges festival={f} />
                        </div>
                      </div>
                      {fav && <Heart className="h-4 w-4 shrink-0 fill-current text-neon-magenta" aria-label={L("Favorito", "Favourite")} />}
                    </Link>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}
