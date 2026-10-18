"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CloudSun,
  Euro,
  Lightbulb,
  MapPin,
  Plane,
  Sparkles,
  Star,
  Train,
  UserRound,
  Users,
  UtensilsCrossed,
  Landmark,
  Navigation,
  Link as LinkIcon,
} from "lucide-react";
import { AttendedButton, FavoriteButton, Poster, StatusBadges, WsdcBadge } from "@/components/festival/bits";
import { BudgetCalculator } from "@/components/festival/BudgetCalculator";
import { CalendarMenu, FlightsButton, QrButton, ShareButton, WebButton } from "@/components/festival/Actions";
import { Countdown } from "@/components/festival/Countdown";
import { OriginSelect } from "@/components/OriginSelect";
import { costSymbol, festivals, getCity, getFestival, sizeLabel } from "@/lib/festivals";
import { formatNumber, formatRange } from "@/lib/format";
import { distanceKm, origins } from "@/lib/geo";
import { pick, useLang } from "@/lib/i18n";
import { usePassport } from "@/lib/store";
import { useToday } from "@/lib/use-today";

function Section({ icon: Icon, title, children }: { icon: typeof Star; title: string; children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      className="glass rounded-3xl p-5 sm:p-6"
    >
      <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-bold">
        <Icon className="h-5 w-5 text-neon-cyan" /> {title}
      </h2>
      {children}
    </motion.section>
  );
}

function Fact({ icon: Icon, label, value }: { icon: typeof Star; label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <dt className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        <Icon className="h-3.5 w-3.5" /> {label}
      </dt>
      <dd className="mt-1 text-sm font-semibold text-slate-100">{value}</dd>
    </div>
  );
}

export function FestivalDetail({ slug }: { slug: string }) {
  const f = getFestival(slug)!;
  const city = getCity(f);
  const { lang, L } = useLang();
  const today = useToday();
  const origin = usePassport((s) => s.origin);
  const km = distanceKm(origins[origin].coords, f.coords);
  const idx = festivals.findIndex((x) => x.slug === slug);
  const prev = festivals[idx - 1];
  const next = festivals[idx + 1];
  const past = f.end < today;

  return (
    <article className="mx-auto max-w-4xl px-4 pt-4">
      <Link href="/explorar/" className="mb-4 inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> {L("Todos los festivales", "All festivals")}
      </Link>

      {/* Cabecera */}
      <header className="relative isolate overflow-hidden rounded-3xl">
        <Poster festival={f} size="lg" className="absolute inset-0 -z-10 h-full sm:h-full" />
        <div className="flex min-h-[15rem] flex-col justify-end p-5 pt-20 sm:min-h-[18rem] sm:p-8">
          <div className="mb-2 flex flex-wrap gap-1.5">
            <WsdcBadge festival={f} />
            <StatusBadges festival={f} />
          </div>
          <h1 className="font-display text-3xl font-black leading-tight text-white drop-shadow-lg sm:text-5xl">
            {f.name} <span className="text-white/70">{f.edition}</span>
          </h1>
          <p className="mt-1 font-semibold text-white/90">
            {formatRange(f, lang)} · {city.name}, {f.country}
          </p>
        </div>
      </header>

      <p className="mt-6 text-lg leading-relaxed text-slate-200">{pick(lang, f.summary)}</p>
      {lang === "en" && (
        <p className="mt-2 text-xs text-slate-500">The detailed guide below is written in Spanish.</p>
      )}

      {f.dateStatus === "tentative" && (
        <div role="note" className="mt-4 flex gap-3 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-100">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-300" />
          <p>
            <strong>{L("Fechas por confirmar. ", "Dates to be confirmed. ")}</strong>
            {f.dateNote}
          </p>
        </div>
      )}
      {f.dateStatus === "confirmed" && f.dateNote && <p className="mt-3 text-sm text-slate-400">ℹ️ {f.dateNote}</p>}

      {/* Acciones */}
      <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <FavoriteButton slug={f.slug} withLabel />
        <AttendedButton slug={f.slug} />
        <CalendarMenu festival={f} />
        <ShareButton title={`${f.name} ${f.edition}`} text={f.summary.es} />
        <div className="col-span-2">
          <WebButton festival={f} />
        </div>
        <FlightsButton festival={f} />
        <QrButton name={f.name} />
      </div>

      {!past && f.dateStatus === "confirmed" && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-gradient-to-r from-neon-cyan/10 to-neon-magenta/10 p-5">
          <p className="font-display font-bold">{L("Empieza en", "Starts in")}</p>
          <Countdown start={f.start} />
        </div>
      )}

      {/* Ficha técnica */}
      <dl className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
        <Fact icon={CalendarDays} label={L("Fechas", "Dates")} value={formatRange(f, lang)} />
        <Fact icon={MapPin} label={L("Sede", "Venue")} value={f.venue} />
        <Fact icon={Star} label={L("Tipo", "Type")} value={<WsdcBadge festival={f} />} />
        <Fact icon={Users} label={L("Tamaño", "Size")} value={sizeLabel[f.size][lang]} />
        <Fact
          icon={Sparkles}
          label={L("Para empezar", "For beginners")}
          value={<span aria-label={`${f.beginner}/5`}>{"★".repeat(f.beginner)}<span className="text-slate-600">{"★".repeat(5 - f.beginner)}</span></span>}
        />
        <Fact icon={Euro} label={L("Coste", "Cost")} value={costSymbol(f.costLevel)} />
        <Fact
          icon={Navigation}
          label={L("Distancia", "Distance")}
          value={`≈ ${formatNumber(km, lang)} km ${L("desde", "from")} ${origins[origin].name}`}
        />
        <Fact icon={Plane} label={L("Aeropuerto", "Airport")} value={city.airports.map((a) => a.code).join(" · ")} />
        <Fact icon={LinkIcon} label="Web" value={f.website ? <a className="break-all text-neon-cyan underline" href={f.website} target="_blank" rel="noopener noreferrer">{new URL(f.website).hostname}</a> : L("Desconocido", "Unknown")} />
      </dl>

      <div className="mt-6 space-y-4">
        <Section icon={Star} title={L("El festival", "The festival")}>
          <p className="leading-relaxed text-slate-300">{f.description}</p>
          <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {f.highlights.map((h) => (
              <li key={h} className="flex gap-2 text-sm text-slate-200">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neon-magenta" /> {h}
              </li>
            ))}
          </ul>
          {f.teachers && (
            <div className="mt-4">
              <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-400">
                <UserRound className="h-4 w-4" /> {L("Profesores / organización", "Teachers / organisers")}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {f.teachers.map((t) => (
                  <li key={t} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Section>

        <Section icon={Euro} title={L(`Precios (${f.priceYear})`, `Prices (${f.priceYear})`)}>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-white/5">
              {f.prices.map((p) => (
                <tr key={p.label}>
                  <th scope="row" className="py-2.5 pr-4 text-left align-top font-semibold text-slate-200">
                    {p.label}
                  </th>
                  <td className="py-2.5 text-slate-300">{p.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {f.priceNote && <p className="mt-3 text-sm text-slate-400">💡 {f.priceNote}</p>}
          <p className="mt-3 text-xs text-slate-500">
            {L(
              "Los precios cambian por tramos (early bird → late). Confírmalos siempre en la web oficial antes de pagar.",
              "Prices change by tiers (early bird → late). Always confirm on the official site before paying."
            )}
          </p>
        </Section>

        <section className="rounded-3xl border border-neon-magenta/30 bg-gradient-to-br from-neon-magenta/15 to-neon-cyan/10 p-5 sm:p-6">
          <h2 className="mb-2 flex items-center gap-2 font-display text-xl font-bold">
            <Lightbulb className="h-5 w-5 text-neon-magenta" /> {L("Consejo Levante", "Levante tip")}
          </h2>
          <p className="leading-relaxed text-slate-100">{f.levanteTip}</p>
        </section>

        <Section icon={Plane} title={L("Cómo llegar", "Getting there")}>
          <OriginSelect className="mb-4" />
          <p className="text-sm text-slate-300">
            <strong className="text-white">{L("Acceso a la sede: ", "Venue access: ")}</strong>
            {f.access}
          </p>
          <h3 className="mb-2 mt-5 text-sm font-semibold uppercase tracking-wider text-slate-400">{L("Aeropuertos", "Airports")}</h3>
          <ul className="space-y-2">
            {city.airports.map((a) => (
              <li key={a.code} className="flex items-start gap-3 text-sm">
                <span className="rounded-md bg-white/10 px-2 py-0.5 font-mono text-xs font-bold text-neon-cyan">{a.code}</span>
                <span className="text-slate-300">
                  <span className="text-white">{a.name}</span> — {a.distance}
                </span>
              </li>
            ))}
          </ul>
          <h3 className="mb-2 mt-5 flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-slate-400">
            <Train className="h-4 w-4" /> {L("Tren", "Train")}
          </h3>
          <p className="text-sm text-slate-300">{city.train}</p>
          <h3 className="mb-2 mt-5 text-sm font-semibold uppercase tracking-wider text-slate-400">{L("Desde España", "From Spain")}</h3>
          <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {(
              [
                ["alicante", "Alicante · Murcia · Torrevieja"],
                ["valencia", "Valencia"],
                ["madrid", "Madrid"],
                ["barcelona", "Barcelona"],
              ] as const
            ).map(([k, label]) => (
              <div key={k} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                <dt className="text-xs font-bold uppercase tracking-wider text-neon-magenta">{label}</dt>
                <dd className="mt-1 text-sm text-slate-300">{city.fromSpain[k]}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-xs text-slate-500">
            {L(
              "Las rutas aéreas cambian por temporada: compruébalas en el buscador antes de reservar.",
              "Flight routes change by season: check a flight search before booking."
            )}
          </p>
        </Section>

        <Section icon={Landmark} title={`${city.name} · ${city.region}`}>
          <p className="leading-relaxed text-slate-300">{city.intro}</p>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-slate-400">
                <Landmark className="h-4 w-4" /> {L("Cultura y escapadas", "Culture & day trips")}
              </h3>
              <ul className="space-y-1.5 text-sm text-slate-300">
                {city.culture.map((c) => (
                  <li key={c}>• {c}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-slate-400">
                <UtensilsCrossed className="h-4 w-4" /> {L("Gastronomía", "Food & drink")}
              </h3>
              <ul className="space-y-1.5 text-sm text-slate-300">
                {city.food.map((c) => (
                  <li key={c}>• {c}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-5 flex gap-2 rounded-2xl bg-white/[0.04] p-3 text-sm text-slate-300">
            <CloudSun className="h-5 w-5 shrink-0 text-amber-300" /> {city.climate}
          </p>
        </Section>

        <BudgetCalculator festival={f} />

        <footer className="rounded-3xl border border-white/10 p-5 text-xs text-slate-500">
          <p>
            {L("Datos verificados el", "Data verified on")} {f.verified}.{" "}
            {L("Fuentes:", "Sources:")}{" "}
            {f.sources.map((s, i) => (
              <span key={s}>
                <a href={s} target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-300">
                  {new URL(s).hostname}
                </a>
                {i < f.sources.length - 1 ? ", " : ""}
              </span>
            ))}
          </p>
        </footer>
      </div>

      <nav className="mt-8 grid grid-cols-2 gap-3" aria-label={L("Otros festivales", "Other festivals")}>
        {prev ? (
          <Link href={`/festival/${prev.slug}/`} className="glass rounded-2xl p-4 hover:border-neon-cyan/40">
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <ChevronLeft className="h-3.5 w-3.5" /> {L("Anterior", "Previous")}
            </span>
            <span className="mt-1 block truncate font-semibold">{prev.name}</span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={`/festival/${next.slug}/`} className="glass rounded-2xl p-4 text-right hover:border-neon-cyan/40">
            <span className="flex items-center justify-end gap-1 text-xs text-slate-400">
              {L("Siguiente", "Next")} <ChevronRight className="h-3.5 w-3.5" />
            </span>
            <span className="mt-1 block truncate font-semibold">{next.name}</span>
          </Link>
        )}
      </nav>
    </article>
  );
}
