"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, CalendarDays, Compass, Globe2, Heart, Map, Search, Sparkles, Stamp, Wallet } from "lucide-react";
import { FestivalCard } from "@/components/festival/FestivalCard";
import { Countdown } from "@/components/festival/Countdown";
import { Poster, WsdcBadge } from "@/components/festival/bits";
import { useInstall } from "@/components/shell/InstallPrompt";
import { Button } from "@/components/ui/button";
import { festivals, flagEmoji, getCity, upcoming } from "@/lib/festivals";
import { formatRange } from "@/lib/format";
import { pick, useLang } from "@/lib/i18n";
import { usePassport } from "@/lib/store";
import { useToday } from "@/lib/use-today";

export function Home() {
  const { lang, L } = useLang();
  const today = useToday();
  const router = useRouter();
  const [q, setQ] = useState("");
  const favorites = usePassport((s) => s.favorites);
  const { canInstall, install } = useInstall();

  const next = upcoming(today);
  const nextConfirmed = next.find((f) => f.dateStatus === "confirmed" && f.start > today) ?? next[0];
  const nextFav = next.find((f) => favorites.includes(f.slug));
  const soon = next.slice(0, 8);
  const spain = festivals.filter((f) => f.region === "espana").length;
  const countries = new Set(festivals.map((f) => f.country)).size;

  const tiles = [
    { href: "/explorar/?filtro=espana", icon: Sparkles, es: "Nacionales", en: "Spain", d: L(`${spain} en España`, `${spain} in Spain`) },
    { href: "/explorar/?filtro=europa", icon: Globe2, es: "Gigantes europeos", en: "European giants", d: L(`${countries} países`, `${countries} countries`) },
    { href: "/explorar/?filtro=beginner", icon: Heart, es: "Para empezar", en: "Beginner-friendly", d: L("Tu primer J&J", "Your first J&J") },
    { href: "/explorar/?filtro=lowcost", icon: Wallet, es: "Económicos", en: "Budget", d: L("Mucho baile, poco gasto", "Big dance, small spend") },
  ];

  return (
    <div>
      {/* Portada */}
      <section className="relative isolate overflow-hidden px-4 pb-14 pt-12 sm:pt-20">
        <div
          aria-hidden
          className="absolute inset-0 -z-20"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 15% 20%, rgba(6,182,212,0.35) 0%, transparent 55%), radial-gradient(ellipse at 85% 70%, rgba(217,70,239,0.35) 0%, transparent 55%), linear-gradient(180deg, #020617 0%, #0b1026 100%)",
          }}
        />
        <div aria-hidden className="noise absolute inset-0 -z-10 opacity-60" />
        <motion.div
          aria-hidden
          className="absolute -left-20 top-10 -z-10 h-64 w-64 rounded-full bg-neon-cyan/25 blur-[100px]"
          animate={{ x: [0, 40, 0], y: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="absolute -right-20 bottom-0 -z-10 h-72 w-72 rounded-full bg-neon-magenta/25 blur-[110px]"
          animate={{ x: [0, -40, 0], y: [0, 20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="mx-auto max-w-4xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[2.4rem] font-black uppercase leading-[0.95] tracking-tight sm:text-6xl md:text-7xl"
          >
            <span className="text-neon-gradient animate-gradient-x bg-[length:200%_auto]">West Coast Swing Passport</span>
            <span className="mt-2 block text-2xl font-extrabold tracking-[0.25em] text-white/90 sm:text-4xl">2026–2027</span>
          </motion.h1>
          <p className="mx-auto mt-5 max-w-xl text-balance text-slate-300 sm:text-lg">
            {L("La Guía Definitiva del Circuito Europeo: De la Pista Local al Mundo.", "The Ultimate Guide to the European Circuit: From Your Local Floor to the World.")}
          </p>
          <p className="mx-auto mt-5 inline-flex flex-wrap justify-center gap-x-2 rounded-full border border-white/15 bg-white/5 px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-200 backdrop-blur sm:text-xs">
            <span>Edición Especial Levante West Coast Swing</span>
            <span className="text-neon-magenta">|</span>
            <span>LOBAILAO</span>
          </p>

          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              router.push(`/explorar/${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ""}`);
            }}
            className="mx-auto mt-8 flex max-w-lg gap-2"
          >
            <label className="relative flex-1">
              <span className="sr-only">{L("Buscar festivales", "Search festivals")}</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={L(`Busca entre ${festivals.length} festivales…`, `Search ${festivals.length} festivals…`)}
                className="h-12 w-full rounded-full border border-white/15 bg-slate-950/60 pl-11 pr-4 text-base text-white placeholder:text-slate-500 backdrop-blur focus:border-neon-cyan focus:outline-none"
              />
            </label>
            <Button type="submit" className="h-12 px-6">
              {L("Buscar", "Search")}
            </Button>
          </form>
          <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm">
            <Link href="/agenda/" className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-slate-300 hover:text-white">
              <CalendarDays className="h-4 w-4 text-neon-cyan" /> {L("Agenda", "Calendar")}
            </Link>
            <Link href="/explorar/" className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-slate-300 hover:text-white">
              <Map className="h-4 w-4 text-neon-magenta" /> {L("Mapa", "Map")}
            </Link>
            <Link href="/guia/" className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-slate-300 hover:text-white">
              <BookOpen className="h-4 w-4 text-neon-cyan" /> {L("Guía para empezar", "Beginner guide")}
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-12 px-4">
        {/* Próximo festival */}
        {nextConfirmed && (
          <section aria-labelledby="next-title">
            <Link href={`/festival/${nextConfirmed.slug}/`} className="group relative isolate block overflow-hidden rounded-3xl">
              <Poster festival={nextConfirmed} size="lg" className="absolute inset-0 -z-10 h-full rounded-3xl sm:h-full" />
              <div className="flex min-h-[18rem] flex-col justify-end gap-3 p-5 pt-24 sm:p-8 sm:pt-28">
                <p id="next-title" className="text-xs font-bold uppercase tracking-[0.25em] text-white/80">
                  {L("Próximo festival", "Next festival")}
                </p>
                <h2 className="font-display text-3xl font-black text-white drop-shadow sm:text-4xl">{nextConfirmed.name}</h2>
                <p className="font-semibold text-white/90">
                  {formatRange(nextConfirmed, lang)} · {getCity(nextConfirmed).name}
                </p>
                <Countdown start={nextConfirmed.start} />
              </div>
            </Link>
          </section>
        )}

        {nextFav && nextFav.slug !== nextConfirmed?.slug && (
          <Link href={`/festival/${nextFav.slug}/`} className="glass flex items-center gap-4 rounded-3xl p-4 hover:border-neon-magenta/40">
            <Heart className="h-6 w-6 shrink-0 fill-current text-neon-magenta" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold uppercase tracking-widest text-neon-magenta">{L("Tu próximo favorito", "Your next favourite")}</p>
              <p className="truncate font-display font-bold">
                {flagEmoji(nextFav.countryCode)} {nextFav.name} · {formatRange(nextFav, lang)}
              </p>
            </div>
            <ArrowRight className="h-5 w-5 text-slate-400" />
          </Link>
        )}

        {/* Categorías */}
        <section aria-label={L("Categorías", "Categories")} className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {tiles.map((t) => (
            <Link key={t.href} href={t.href} className="glass group rounded-3xl p-5 transition-colors hover:border-neon-cyan/40">
              <t.icon className="h-6 w-6 text-neon-cyan" />
              <p className="mt-3 font-display font-bold">{L(t.es, t.en)}</p>
              <p className="text-sm text-slate-400">{t.d}</p>
            </Link>
          ))}
        </section>

        {/* Próximos */}
        <section aria-labelledby="soon-title">
          <div className="mb-4 flex items-end justify-between">
            <h2 id="soon-title" className="font-display text-2xl font-black">
              {L("Próximamente", "Coming up")}
            </h2>
            <Link href="/agenda/" className="text-sm font-semibold text-neon-cyan">
              {L("Ver agenda", "See calendar")} →
            </Link>
          </div>
          <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {soon.map((f) => (
              <div key={f.slug} className="w-[78vw] max-w-[320px] shrink-0 snap-start">
                <FestivalCard festival={f} />
              </div>
            ))}
          </div>
        </section>

        {/* Destacados Levante */}
        <section aria-labelledby="picks-title" className="rounded-3xl border border-neon-magenta/30 bg-gradient-to-br from-neon-magenta/10 to-neon-cyan/5 p-5 sm:p-8">
          <h2 id="picks-title" className="font-display text-2xl font-black">
            {L("Recomendados para tu primer festival", "Recommended for your first festival")}
          </h2>
          <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {next
              .filter((f) => f.beginner >= 5 || (f.beginner >= 4 && f.costLevel === 1))
              .slice(0, 6)
              .map((f) => (
                <li key={f.slug}>
                  <Link href={`/festival/${f.slug}/`} className="flex items-center gap-3 rounded-2xl bg-slate-950/50 p-3 hover:bg-slate-950/80">
                    <span className="text-2xl">{flagEmoji(f.countryCode)}</span>
                    <span className="min-w-0 flex-1">
                      <strong className="block truncate">{f.name}</strong>
                      <span className="block truncate text-xs text-slate-400">{pick(lang, f.summary)}</span>
                    </span>
                    <WsdcBadge festival={f} className="hidden sm:inline-flex" />
                  </Link>
                </li>
              ))}
          </ul>
          <Button asChild variant="outline" className="mt-5">
            <Link href="/guia/">
              <BookOpen /> {L("Cómo preparar tu primer Jack & Jill", "How to prepare your first Jack & Jill")}
            </Link>
          </Button>
        </section>

        {/* Funciones */}
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { href: "/pasaporte/", icon: Stamp, t: L("Tu pasaporte", "Your passport"), d: L("Favoritos, sellos de los festivales a los que vas y presupuesto.", "Favourites, stamps for festivals you attend and budget.") },
            { href: "/agenda/", icon: CalendarDays, t: L("Calendario sincronizado", "Synced calendar"), d: L("Suscríbete y tendrás toda la temporada en tu móvil.", "Subscribe and get the whole season on your phone.") },
            { href: "/explorar/", icon: Compass, t: L("Mapa de Europa", "Map of Europe"), d: L("Mira qué festivales tienes más cerca de casa.", "See which festivals are closest to home.") },
          ].map((x) => (
            <Link key={x.href + x.t} href={x.href} className="glass rounded-3xl p-5 hover:border-neon-cyan/40">
              <x.icon className="h-6 w-6 text-neon-magenta" />
              <p className="mt-3 font-display font-bold">{x.t}</p>
              <p className="text-sm text-slate-400">{x.d}</p>
            </Link>
          ))}
        </section>

        {canInstall && (
          <section className="glass flex flex-col items-center gap-4 rounded-3xl p-6 text-center sm:flex-row sm:text-left">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-neon-cyan to-neon-magenta font-display text-sm font-black">WCS</span>
            <div className="flex-1">
              <p className="font-display text-lg font-bold">{L("Llévalo siempre contigo", "Take it everywhere")}</p>
              <p className="text-sm text-slate-400">{L("Instala el Passport en tu móvil: se abre como una app y funciona sin conexión.", "Install the Passport on your phone: it opens like an app and works offline.")}</p>
            </div>
            <Button onClick={install}>{L("Añadir a inicio", "Add to home screen")}</Button>
          </section>
        )}

        <footer className="border-t border-white/10 pb-6 pt-6 text-center text-xs text-slate-500">
          <p className="font-display text-sm font-black uppercase tracking-widest text-slate-300">
            <span className="text-neon-gradient">WCS Passport</span> 26/27
          </p>
          <p className="mt-2">Levante West Coast Swing · Asociación Cultural LOBAILAO</p>
          <p className="mt-1">
            <Link href="/comunidad/" className="underline hover:text-slate-300">
              {L("Comunidad y créditos", "Community & credits")}
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
