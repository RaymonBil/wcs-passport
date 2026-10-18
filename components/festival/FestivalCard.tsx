"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDays, ChevronRight, MapPin, Navigation } from "lucide-react";
import { type Festival, getCity } from "@/lib/festivals";
import { formatNumber, formatRange } from "@/lib/format";
import { distanceKm, origins } from "@/lib/geo";
import { pick, useLang } from "@/lib/i18n";
import { usePassport } from "@/lib/store";
import { FavoriteButton, Poster, StatusBadges, WsdcBadge } from "./bits";

function useDistance(f: Festival) {
  const origin = usePassport((s) => s.origin);
  return { km: distanceKm(origins[origin].coords, f.coords), from: origins[origin].name };
}

export function FestivalCard({ festival }: { festival: Festival }) {
  const { lang } = useLang();
  const { km, from } = useDistance(festival);
  const city = getCity(festival);
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="group relative h-full"
    >
      <div
        aria-hidden
        className="absolute -inset-px rounded-3xl bg-gradient-to-br from-neon-cyan via-transparent to-neon-magenta opacity-25 transition-opacity group-hover:opacity-90"
      />
      <Link
        href={`/festival/${festival.slug}/`}
        className="glass relative flex h-full flex-col overflow-hidden rounded-3xl bg-slate-950/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan"
      >
        <Poster festival={festival} />
        <FavoriteButton slug={festival.slug} className="absolute left-3 top-3" />
        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="flex flex-wrap gap-1.5">
            <WsdcBadge festival={festival} />
            <StatusBadges festival={festival} />
          </div>
          <h3 className="font-display text-xl font-extrabold leading-tight">{festival.name}</h3>
          <dl className="grid gap-1.5 text-sm">
            <div className="flex items-center gap-2 text-slate-200">
              <dt className="sr-only">Fechas</dt>
              <CalendarDays className="h-4 w-4 shrink-0 text-neon-cyan" />
              <dd className="font-semibold">{formatRange(festival, lang)}</dd>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <dt className="sr-only">Ciudad</dt>
              <MapPin className="h-4 w-4 shrink-0 text-neon-magenta" />
              <dd>
                {city.name}, {festival.country}
              </dd>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <dt className="sr-only">Distancia</dt>
              <Navigation className="h-4 w-4 shrink-0" />
              <dd>
                ≈ {formatNumber(km, lang)} km {lang === "es" ? "desde" : "from"} {from}
              </dd>
            </div>
          </dl>
          <p className="line-clamp-3 text-sm leading-relaxed text-slate-400">{pick(lang, festival.summary)}</p>
          <span className="mt-auto inline-flex items-center gap-1 pt-1 text-sm font-semibold text-neon-cyan">
            {lang === "es" ? "Ver ficha completa" : "Full details"} <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}

export function FestivalRow({ festival }: { festival: Festival }) {
  const { lang } = useLang();
  const { km } = useDistance(festival);
  const city = getCity(festival);
  return (
    <motion.li layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative">
      <Link
        href={`/festival/${festival.slug}/`}
        className="glass flex items-center gap-4 rounded-2xl p-3 pr-14 transition-colors hover:border-neon-cyan/40"
      >
        <Poster festival={festival} size="sm" className="shrink-0" />
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-display font-bold">{festival.name}</h3>
          <p className="truncate text-sm text-slate-300">
            {formatRange(festival, lang)} · {city.name}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <WsdcBadge festival={festival} />
            <StatusBadges festival={festival} />
            <span className="text-xs text-slate-500">≈ {formatNumber(km, lang)} km</span>
          </div>
        </div>
      </Link>
      <FavoriteButton slug={festival.slug} className="absolute right-3 top-1/2 -translate-y-1/2" />
    </motion.li>
  );
}
