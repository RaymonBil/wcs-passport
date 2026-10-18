"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Backpack, Calculator, Globe2, Heart, PartyPopper, RotateCcw, Route, Stamp } from "lucide-react";
import { FestivalRow } from "@/components/festival/FestivalCard";
import { resolveBudget, useBudget } from "@/components/festival/BudgetCalculator";
import { Countdown } from "@/components/festival/Countdown";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { checklist, checklistCount } from "@/data/checklist";
import { type Festival, festivals, flagEmoji, getCity } from "@/lib/festivals";
import { formatEUR, formatNumber, formatRange } from "@/lib/format";
import { distanceKm, origins } from "@/lib/geo";
import { useLang } from "@/lib/i18n";
import { usePassport } from "@/lib/store";
import { useToday } from "@/lib/use-today";
import { cn } from "@/lib/utils";

type Tab = "favs" | "stamps" | "checklist" | "budget";

function BudgetRow({ festival }: { festival: Festival }) {
  const { lang } = useLang();
  const { total } = useBudget(festival);
  return (
    <li className="flex items-center justify-between gap-3 py-2.5 text-sm">
      <Link href={`/festival/${festival.slug}/`} className="min-w-0 truncate hover:text-neon-cyan">
        {flagEmoji(festival.countryCode)} {festival.name}
      </Link>
      <span className="shrink-0 font-semibold tabular-nums">{formatEUR(total, lang)}</span>
    </li>
  );
}

function BudgetTotal({ list }: { list: Festival[] }) {
  const { lang, L } = useLang();
  const origin = usePassport((s) => s.origin);
  const budgets = usePassport((s) => s.budgets);
  const sum = list.reduce((n, f) => n + resolveBudget(f, origins[origin].coords, budgets[f.slug]).total, 0);
  return (
    <div className="mt-4 flex items-end justify-between rounded-2xl bg-gradient-to-r from-neon-cyan/15 to-neon-magenta/15 p-4">
      <span className="text-sm text-slate-300">{L("Total de tu temporada", "Your season total")}</span>
      <span className="font-display text-3xl font-black tabular-nums">{formatEUR(sum, lang)}</span>
    </div>
  );
}

export function Passport() {
  const { lang, L } = useLang();
  const today = useToday();
  const [tab, setTab] = useState<Tab>("favs");
  const favorites = usePassport((s) => s.favorites);
  const attended = usePassport((s) => s.attended);
  const origin = usePassport((s) => s.origin);
  const checked = usePassport((s) => s.checklist);
  const toggleCheck = usePassport((s) => s.toggleCheck);
  const resetChecklist = usePassport((s) => s.resetChecklist);

  const favList = festivals.filter((f) => favorites.includes(f.slug));
  const upcomingFavs = favList.filter((f) => f.end >= today);
  const nextFav = upcomingFavs[0];
  const stamps = festivals.filter((f) => attended[f.slug]);
  const countriesVisited = new Set(stamps.map((f) => f.country)).size;
  const kmTravelled = stamps.reduce((n, f) => n + distanceKm(origins[origin].coords, f.coords) * 2, 0);
  const doneCount = Object.values(checked).filter(Boolean).length;
  const progress = Math.round((doneCount / checklistCount) * 100);

  const tabs: { id: Tab; icon: typeof Heart; label: string; count?: number }[] = [
    { id: "favs", icon: Heart, label: L("Favoritos", "Favourites"), count: favList.length },
    { id: "stamps", icon: Stamp, label: L("Sellos", "Stamps"), count: stamps.length },
    { id: "checklist", icon: Backpack, label: L("Maleta", "Packing") },
    { id: "budget", icon: Calculator, label: L("Presupuesto", "Budget") },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 pt-6">
      {/* Portada del pasaporte */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-fuchsia-900 to-slate-900 p-6">
        <div className="noise absolute inset-0 opacity-40" />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/70">{L("Pasaporte westie", "Westie passport")}</p>
          <h1 className="mt-1 font-display text-3xl font-black">{L("Mi temporada", "My season")} 26/27</h1>
          <dl className="mt-5 grid grid-cols-3 gap-2">
            {[
              { icon: Stamp, v: stamps.length, l: L("festivales", "festivals") },
              { icon: Globe2, v: countriesVisited, l: L("países", "countries") },
              { icon: Route, v: formatNumber(kmTravelled, lang), l: "km" },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl bg-black/25 p-3 text-center backdrop-blur">
                <s.icon className="mx-auto h-4 w-4 text-neon-cyan" />
                <dd className="mt-1 font-display text-2xl font-black tabular-nums">{s.v}</dd>
                <dt className="text-[10px] font-semibold uppercase tracking-widest text-white/60">{s.l}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {nextFav && (
        <Link href={`/festival/${nextFav.slug}/`} className="glass mt-4 block rounded-3xl p-5 hover:border-neon-magenta/40">
          <p className="text-xs font-bold uppercase tracking-widest text-neon-magenta">{L("Tu próximo festival", "Your next festival")}</p>
          <p className="mt-1 font-display text-xl font-bold">
            {flagEmoji(nextFav.countryCode)} {nextFav.name}
          </p>
          <p className="mb-3 text-sm text-slate-400">
            {formatRange(nextFav, lang)} · {getCity(nextFav).name}
          </p>
          <Countdown start={nextFav.start} />
        </Link>
      )}

      {/* Pestañas */}
      <div className="sticky top-14 z-20 -mx-4 mt-6 bg-slate-950/90 px-4 py-2 backdrop-blur" role="tablist">
        <div className="flex gap-1 rounded-full border border-white/10 p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "relative flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-xs font-semibold sm:text-sm",
                tab === t.id ? "text-white" : "text-slate-400"
              )}
            >
              {tab === t.id && <motion.span layoutId="pass-tab" className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-neon-cyan/80 to-neon-magenta/80" />}
              <t.icon className="h-4 w-4" />
              <span>{t.label}</span>
              {t.count ? <span className="text-[10px] opacity-80">{t.count}</span> : null}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        {tab === "favs" &&
          (favList.length ? (
            <ul className="space-y-2">
              {favList.map((f) => (
                <FestivalRow key={f.slug} festival={f} />
              ))}
            </ul>
          ) : (
            <Empty
              text={L("Toca el ❤️ en los festivales que te interesen y aparecerán aquí.", "Tap ❤️ on festivals you like and they'll show up here.")}
              cta={L("Explorar festivales", "Explore festivals")}
            />
          ))}

        {tab === "stamps" && (
          <>
            <p className="mb-4 text-sm text-slate-400">
              {L(
                "Marca «He ido» en la ficha de cada festival para sellar tu pasaporte.",
                "Tap 'I went' on a festival page to stamp your passport."
              )}
            </p>
            <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {festivals.map((f) => {
                const got = !!attended[f.slug];
                return (
                  <li key={f.slug}>
                    <Link
                      href={`/festival/${f.slug}/`}
                      className={cn(
                        "flex aspect-square flex-col items-center justify-center rounded-full border-2 border-dashed p-2 text-center transition-all",
                        got ? "rotate-[-8deg] border-neon-magenta bg-neon-magenta/10 shadow-neon-magenta" : "border-white/10 opacity-40 grayscale hover:opacity-70"
                      )}
                      title={f.name}
                    >
                      <span className="text-2xl">{flagEmoji(f.countryCode)}</span>
                      <span className="mt-1 line-clamp-2 text-[10px] font-bold uppercase leading-tight">{f.name}</span>
                      {got && <span className="mt-0.5 text-[9px] text-neon-magenta">{attended[f.slug]}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </>
        )}

        {tab === "checklist" && (
          <div className="glass overflow-hidden rounded-3xl">
            <div className="border-b border-white/10 p-5">
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-semibold">
                  {doneCount} / {checklistCount} {L("preparados", "packed")}
                </span>
                <span className="font-display font-bold text-neon-cyan">{progress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
                <motion.div className="h-full rounded-full bg-gradient-to-r from-neon-cyan to-neon-magenta" animate={{ width: `${progress}%` }} />
              </div>
            </div>
            {checklist.map((g) => (
              <fieldset key={g.id} className="border-b border-white/5 last:border-0">
                <legend className="px-5 pt-4 text-xs font-bold uppercase tracking-widest text-neon-magenta">{L(g.es, g.en)}</legend>
                <ul>
                  {g.items.map((it) => (
                    <li key={it.id}>
                      <label htmlFor={`ck-${it.id}`} className="flex min-h-[52px] cursor-pointer items-center gap-4 px-5 py-2 hover:bg-white/[0.03]">
                        <Checkbox id={`ck-${it.id}`} checked={!!checked[it.id]} onCheckedChange={() => toggleCheck(it.id)} />
                        <span className={cn("text-sm", checked[it.id] ? "text-slate-500 line-through decoration-neon-magenta/70" : "text-slate-100")}>{L(it.es, it.en)}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </fieldset>
            ))}
            <AnimatePresence>
              {doneCount === checklistCount && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 bg-gradient-to-r from-neon-cyan/15 to-neon-magenta/15 px-5 py-4 font-display font-bold">
                  <PartyPopper className="h-5 w-5 text-neon-magenta" /> {L("¡Listo para bailar hasta el amanecer!", "Ready to dance till dawn!")}
                </motion.p>
              )}
            </AnimatePresence>
            {doneCount > 0 && (
              <div className="flex justify-end px-5 py-3">
                <Button variant="ghost" size="sm" onClick={resetChecklist}>
                  <RotateCcw /> {L("Reiniciar para el próximo viaje", "Reset for next trip")}
                </Button>
              </div>
            )}
          </div>
        )}

        {tab === "budget" &&
          (upcomingFavs.length ? (
            <div className="glass rounded-3xl p-5">
              <p className="text-sm text-slate-400">
                {L(
                  "Suma de los presupuestos de tus próximos favoritos. Ajusta cada uno en su ficha.",
                  "Sum of your upcoming favourites' budgets. Adjust each one on its page."
                )}
              </p>
              <ul className="mt-3 divide-y divide-white/5">
                {upcomingFavs.map((f) => (
                  <BudgetRow key={f.slug} festival={f} />
                ))}
              </ul>
              <BudgetTotal list={upcomingFavs} />
            </div>
          ) : (
            <Empty text={L("Añade festivales a favoritos para planificar el presupuesto de tu temporada.", "Add favourites to plan your season budget.")} cta={L("Explorar festivales", "Explore festivals")} />
          ))}
      </div>
    </div>
  );
}

function Empty({ text, cta }: { text: string; cta: string }) {
  return (
    <div className="glass rounded-3xl p-8 text-center">
      <p className="text-slate-300">{text}</p>
      <Button asChild className="mt-4">
        <Link href="/explorar/">{cta}</Link>
      </Button>
    </div>
  );
}
