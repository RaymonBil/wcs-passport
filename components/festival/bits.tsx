"use client";

import { motion } from "framer-motion";
import { Heart, Sparkles, Stamp, Trophy } from "lucide-react";
import { type Festival, costSymbol, flagEmoji, posterGradient, wsdcLabel } from "@/lib/festivals";
import { formatRange } from "@/lib/format";
import { useLang } from "@/lib/i18n";
import { usePassport } from "@/lib/store";
import { useToday } from "@/lib/use-today";
import { cn } from "@/lib/utils";

/** Portada tipográfica tipo revista (sin imágenes externas: siempre carga y sin derechos de terceros). */
export function Poster({ festival, size = "md", className }: { festival: Festival; size?: "sm" | "md" | "lg"; className?: string }) {
  const { lang } = useLang();
  const s = new Date(`${festival.start}T12:00:00`);
  const month = s.toLocaleDateString(lang === "es" ? "es-ES" : "en-GB", { month: "short" }).replace(".", "");
  return (
    <div
      className={cn(
        "relative isolate overflow-hidden bg-gradient-to-br",
        posterGradient(festival.slug),
        size === "sm" && "h-20 w-20 rounded-2xl",
        size === "md" && "h-36 rounded-t-3xl",
        size === "lg" && "h-56 rounded-3xl sm:h-72",
        className
      )}
      aria-hidden
    >
      <div className="noise absolute inset-0 opacity-50 mix-blend-overlay" />
      <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/20 blur-2xl" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />
      {size === "sm" ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <span className="font-display text-2xl font-black leading-none">{s.getDate()}</span>
          <span className="text-[10px] font-bold uppercase tracking-widest">{month}</span>
        </div>
      ) : (
        <>
          <span className={cn("absolute right-4 top-3 leading-none drop-shadow", size === "lg" ? "text-6xl" : "text-4xl")}>
            {flagEmoji(festival.countryCode)}
          </span>
          <span
            className={cn(
              "absolute bottom-2 left-4 font-display font-black uppercase leading-[0.85] tracking-tight text-white/15",
              size === "lg" ? "text-[5.5rem]" : "text-6xl"
            )}
          >
            {month}
          </span>
        </>
      )}
    </div>
  );
}

export function WsdcBadge({ festival, className }: { festival: Festival; className?: string }) {
  const { lang } = useLang();
  const styles = {
    registry: "border-neon-cyan/40 bg-neon-cyan/10 text-cyan-300",
    trial: "border-violet-400/40 bg-violet-400/10 text-violet-300",
    none: "border-amber-400/40 bg-amber-400/10 text-amber-300",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
        styles[festival.wsdc],
        className
      )}
    >
      {festival.wsdc !== "none" && <Trophy className="h-3 w-3" />}
      {wsdcLabel[festival.wsdc][lang]}
    </span>
  );
}

export function StatusBadges({ festival }: { festival: Festival }) {
  const { L } = useLang();
  const today = useToday();
  const past = festival.end < today;
  return (
    <>
      {festival.dateStatus === "tentative" && (
        <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300">
          {L("Por confirmar", "TBC")}
        </span>
      )}
      {festival.soldOut && (
        <span className="rounded-full border border-rose-400/40 bg-rose-400/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-300">
          {L("Agotado", "Sold out")}
        </span>
      )}
      {festival.beginner >= 4 && (
        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
          <Sparkles className="h-3 w-3" />
          {L("Para empezar", "Beginner-friendly")}
        </span>
      )}
      {past && (
        <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {L("Finalizado", "Finished")}
        </span>
      )}
    </>
  );
}

export function FavoriteButton({ slug, className, withLabel }: { slug: string; className?: string; withLabel?: boolean }) {
  const { L } = useLang();
  const fav = usePassport((s) => s.favorites.includes(slug));
  const toggle = usePassport((s) => s.toggleFavorite);
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
      aria-pressed={fav}
      aria-label={fav ? L("Quitar de favoritos", "Remove from favourites") : L("Añadir a favoritos", "Add to favourites")}
      className={cn(
        "flex items-center justify-center gap-2 rounded-full transition-colors",
        withLabel ? "h-11 border border-white/15 bg-white/5 px-4 text-sm font-semibold" : "h-10 w-10 bg-slate-950/50 backdrop-blur",
        fav ? "text-neon-magenta" : "text-white hover:text-neon-magenta",
        className
      )}
    >
      <motion.span key={String(fav)} initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 15 }}>
        <Heart className={cn("h-5 w-5", fav && "fill-current")} />
      </motion.span>
      {withLabel && (fav ? L("En favoritos", "Saved") : L("Favorito", "Save"))}
    </button>
  );
}

export function AttendedButton({ slug }: { slug: string }) {
  const { L } = useLang();
  const today = useToday();
  const done = usePassport((s) => !!s.attended[slug]);
  const toggle = usePassport((s) => s.toggleAttended);
  return (
    <button
      onClick={() => toggle(slug, today)}
      aria-pressed={done}
      className={cn(
        "flex h-11 items-center justify-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors",
        done ? "border-neon-cyan/60 bg-neon-cyan/15 text-neon-cyan" : "border-white/15 bg-white/5 text-white hover:text-neon-cyan"
      )}
    >
      <Stamp className="h-5 w-5" />
      {done ? L("Sellado ✓", "Stamped ✓") : L("He ido", "I went")}
    </button>
  );
}

export function MetaLine({ festival }: { festival: Festival }) {
  const { lang } = useLang();
  return (
    <span className="text-sm text-slate-300">
      {formatRange(festival, lang)} · {festival.country} · <span className="text-slate-400">{costSymbol(festival.costLevel)}</span>
    </span>
  );
}
