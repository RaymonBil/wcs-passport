"use client";

import { useEffect, useMemo, useState } from "react";
import Fuse from "fuse.js";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutGrid, List, Map as MapIcon, Search, SlidersHorizontal, X } from "lucide-react";
import { FestivalCard, FestivalRow } from "@/components/festival/FestivalCard";
import { MapView } from "@/components/festival/MapView";
import { OriginSelect } from "@/components/OriginSelect";
import { Button } from "@/components/ui/button";
import { type Festival, countries, festivals, getCity } from "@/lib/festivals";
import { formatMonth, monthKey } from "@/lib/format";
import { distanceKm, origins } from "@/lib/geo";
import { useLang } from "@/lib/i18n";
import { type ViewMode, usePassport } from "@/lib/store";
import { useToday } from "@/lib/use-today";
import { cn } from "@/lib/utils";

type Quick = "all" | "espana" | "europa" | "beginner" | "nopoints" | "lowcost" | "favorites";
type Sort = "date" | "distance" | "price" | "name";

const searchable = festivals.map((f) => {
  const c = getCity(f);
  return { ...f, cityName: c.name, cityRegion: c.region, teacherText: (f.teachers ?? []).join(" "), tagText: f.tags.join(" ") };
});

const fuse = new Fuse(searchable, {
  keys: [
    { name: "name", weight: 3 },
    { name: "cityName", weight: 2 },
    { name: "country", weight: 2 },
    { name: "cityRegion", weight: 1 },
    { name: "venue", weight: 1 },
    { name: "tagText", weight: 1 },
    { name: "teacherText", weight: 1 },
    { name: "summary.es", weight: 0.5 },
  ],
  threshold: 0.35,
  ignoreLocation: true,
});

const months = Array.from(new Set(festivals.map((f) => monthKey(f.start)))).sort();

export function Explorer() {
  const { lang, L } = useLang();
  const today = useToday();
  const view = usePassport((s) => s.view);
  const setView = usePassport((s) => s.setView);
  const favorites = usePassport((s) => s.favorites);
  const origin = usePassport((s) => s.origin);

  const [q, setQ] = useState("");
  const [quick, setQuick] = useState<Quick>("all");
  const [country, setCountry] = useState("");
  const [month, setMonth] = useState("");
  const [wsdc, setWsdc] = useState("");
  const [onlyConfirmed, setOnlyConfirmed] = useState(false);
  const [showPast, setShowPast] = useState(false);
  const [sort, setSort] = useState<Sort>("date");
  const [panel, setPanel] = useState(false);

  // Permite enlazar búsquedas desde Inicio: /explorar/?q=paris o ?filtro=beginner
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get("q")) setQ(p.get("q")!);
    const f = p.get("filtro") as Quick | null;
    if (f) setQuick(f);
  }, []);

  const results = useMemo(() => {
    let list: Festival[] = q.trim() ? fuse.search(q.trim()).map((r) => r.item) : [...festivals];
    if (!showPast) list = list.filter((f) => f.end >= today);
    if (quick === "espana") list = list.filter((f) => f.region === "espana");
    if (quick === "europa") list = list.filter((f) => f.region === "europa");
    if (quick === "beginner") list = list.filter((f) => f.beginner >= 4);
    if (quick === "nopoints") list = list.filter((f) => f.wsdc === "none" || f.size === "boutique");
    if (quick === "lowcost") list = list.filter((f) => f.costLevel === 1 || (f.priceRefEUR ?? 999) <= 150);
    if (quick === "favorites") list = list.filter((f) => favorites.includes(f.slug));
    if (country) list = list.filter((f) => f.country === country);
    if (month) list = list.filter((f) => monthKey(f.start) === month);
    if (wsdc) list = list.filter((f) => f.wsdc === wsdc);
    if (onlyConfirmed) list = list.filter((f) => f.dateStatus === "confirmed");

    const from = origins[origin].coords;
    if (sort === "distance") list.sort((a, b) => distanceKm(from, a.coords) - distanceKm(from, b.coords));
    else if (sort === "price") list.sort((a, b) => (a.priceRefEUR ?? 9999) - (b.priceRefEUR ?? 9999));
    else if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    else if (!q.trim()) list.sort((a, b) => a.start.localeCompare(b.start));
    return list;
  }, [q, quick, country, month, wsdc, onlyConfirmed, showPast, sort, today, favorites, origin]);

  const quicks: { id: Quick; label: string }[] = [
    { id: "all", label: L("Todos", "All") },
    { id: "espana", label: L("🇪🇸 España", "🇪🇸 Spain") },
    { id: "europa", label: L("🌍 Europa", "🌍 Europe") },
    { id: "beginner", label: L("✨ Para empezar", "✨ Beginner-friendly") },
    { id: "lowcost", label: L("💸 Económicos", "💸 Budget") },
    { id: "nopoints", label: L("🤍 Íntimos / sin puntos", "🤍 Intimate / no points") },
    { id: "favorites", label: L("❤️ Favoritos", "❤️ Favourites") },
  ];

  const activeFilters = [country, month, wsdc, onlyConfirmed ? "1" : "", showPast ? "1" : ""].filter(Boolean).length;
  const reset = () => {
    setQ("");
    setQuick("all");
    setCountry("");
    setMonth("");
    setWsdc("");
    setOnlyConfirmed(false);
    setShowPast(false);
    setSort("date");
  };

  const views: { id: ViewMode; icon: typeof List; label: string }[] = [
    { id: "grid", icon: LayoutGrid, label: L("Cuadrícula", "Grid") },
    { id: "list", icon: List, label: L("Lista", "List") },
    { id: "map", icon: MapIcon, label: L("Mapa", "Map") },
  ];

  const select = "w-full rounded-xl border border-white/15 bg-slate-900 px-3 py-2.5 text-sm text-white focus:border-neon-cyan focus:outline-none";

  return (
    <div className="mx-auto max-w-6xl px-4 pt-6">
      <h1 className="font-display text-3xl font-black sm:text-4xl">
        {L("Explora el ", "Explore the ")}
        <span className="text-neon-gradient">{L("circuito", "circuit")}</span>
      </h1>
      <p className="mt-1 text-slate-400">
        {L(`${festivals.length} festivales en España y Europa, temporada 2026–2027.`, `${festivals.length} festivals in Spain and Europe, 2026–2027 season.`)}
      </p>

      {/* Buscador */}
      <div className="sticky top-14 z-30 -mx-4 mt-5 border-b border-white/5 bg-slate-950/85 px-4 pb-3 pt-3 backdrop-blur-xl">
        <div className="flex gap-2">
          <label className="relative flex-1">
            <span className="sr-only">{L("Buscar festivales", "Search festivals")}</span>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={L("Festival, ciudad, país, profesor…", "Festival, city, country, teacher…")}
              className="h-11 w-full rounded-full border border-white/15 bg-white/5 pl-10 pr-10 text-base text-white placeholder:text-slate-500 focus:border-neon-cyan focus:outline-none"
            />
            {q && (
              <button onClick={() => setQ("")} aria-label={L("Borrar búsqueda", "Clear search")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            )}
          </label>
          <Button variant="outline" onClick={() => setPanel((p) => !p)} aria-expanded={panel} className="relative h-11 px-4">
            <SlidersHorizontal />
            <span className="hidden sm:inline">{L("Filtros", "Filters")}</span>
            {activeFilters > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-neon-magenta text-[10px] font-bold text-white">
                {activeFilters}
              </span>
            )}
          </Button>
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="group" aria-label={L("Filtros rápidos", "Quick filters")}>
          {quicks.map((x) => (
            <button
              key={x.id}
              onClick={() => setQuick(x.id)}
              aria-pressed={quick === x.id}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors",
                quick === x.id ? "border-transparent bg-gradient-to-r from-neon-cyan to-neon-magenta text-white" : "border-white/15 text-slate-300 hover:text-white"
              )}
            >
              {x.label}
            </button>
          ))}
        </div>
      </div>

      {/* Panel de filtros */}
      <AnimatePresence>
        {panel && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="glass mt-4 grid gap-3 rounded-3xl p-5 sm:grid-cols-2 lg:grid-cols-4">
              <label className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{L("País", "Country")}</span>
                <select value={country} onChange={(e) => setCountry(e.target.value)} className={select}>
                  <option value="">{L("Todos", "All")}</option>
                  {countries.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{L("Mes", "Month")}</span>
                <select value={month} onChange={(e) => setMonth(e.target.value)} className={select}>
                  <option value="">{L("Cualquiera", "Any")}</option>
                  {months.map((m) => (
                    <option key={m} value={m}>
                      {formatMonth(m, lang)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{L("Tipo", "Type")}</span>
                <select value={wsdc} onChange={(e) => setWsdc(e.target.value)} className={select}>
                  <option value="">{L("Todos", "All")}</option>
                  <option value="registry">WSDC Registry</option>
                  <option value="trial">WSDC Trial</option>
                  <option value="none">{L("Sin puntos WSDC", "No WSDC points")}</option>
                </select>
              </label>
              <label className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{L("Ordenar por", "Sort by")}</span>
                <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className={select}>
                  <option value="date">{L("Fecha", "Date")}</option>
                  <option value="distance">{L("Distancia", "Distance")}</option>
                  <option value="price">{L("Precio del pase", "Pass price")}</option>
                  <option value="name">{L("Nombre", "Name")}</option>
                </select>
              </label>
              <OriginSelect className="sm:col-span-2" />
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input type="checkbox" checked={onlyConfirmed} onChange={(e) => setOnlyConfirmed(e.target.checked)} className="h-4 w-4 accent-fuchsia-500" />
                {L("Solo fechas confirmadas", "Confirmed dates only")}
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input type="checkbox" checked={showPast} onChange={(e) => setShowPast(e.target.checked)} className="h-4 w-4 accent-fuchsia-500" />
                {L("Mostrar finalizados", "Show finished")}
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resultados */}
      <div className="mb-4 mt-5 flex items-center justify-between gap-3">
        <p className="text-sm text-slate-400" aria-live="polite">
          <strong className="text-white">{results.length}</strong> {L(results.length === 1 ? "festival" : "festivales", results.length === 1 ? "festival" : "festivals")}
        </p>
        <div className="flex rounded-full border border-white/15 p-1" role="group" aria-label={L("Vista", "View")}>
          {views.map((v) => (
            <button
              key={v.id}
              onClick={() => setView(v.id)}
              aria-pressed={view === v.id}
              aria-label={v.label}
              title={v.label}
              className={cn("flex h-8 w-9 items-center justify-center rounded-full transition-colors", view === v.id ? "bg-white/15 text-neon-cyan" : "text-slate-400 hover:text-white")}
            >
              <v.icon className="h-4 w-4" />
            </button>
          ))}
        </div>
      </div>

      {results.length === 0 ? (
        <div className="glass rounded-3xl p-10 text-center">
          <p className="font-display text-lg font-bold">{L("Ningún festival coincide", "No festivals match")}</p>
          <p className="mt-1 text-sm text-slate-400">{L("Prueba otra búsqueda o quita algún filtro.", "Try another search or remove a filter.")}</p>
          <Button variant="outline" className="mt-4" onClick={reset}>
            {L("Quitar filtros", "Clear filters")}
          </Button>
        </div>
      ) : view === "map" ? (
        <MapView festivals={results} />
      ) : view === "list" ? (
        <ul className="grid grid-cols-1 gap-2 lg:grid-cols-2">
          {results.map((f) => (
            <FestivalRow key={f.slug} festival={f} />
          ))}
        </ul>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((f) => (
            <FestivalCard key={f.slug} festival={f} />
          ))}
        </div>
      )}
    </div>
  );
}
