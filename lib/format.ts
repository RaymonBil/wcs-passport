import type { Festival } from "./festivals";

export type Lang = "es" | "en";

const locale = (lang: Lang) => (lang === "es" ? "es-ES" : "en-GB");
const parse = (iso: string) => new Date(`${iso}T12:00:00`);

/** «18–21 feb 2027», «29 abr – 2 may 2027» o «≈ jul 2027» si la fecha es estimada. */
export function formatRange(f: Festival, lang: Lang) {
  const s = parse(f.start);
  const e = parse(f.end);
  const month = (d: Date) => d.toLocaleDateString(locale(lang), { month: "short" }).replace(".", "");
  if (f.dateStatus === "tentative") {
    return `≈ ${month(s)} ${s.getFullYear()}`;
  }
  const sameMonth = s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();
  if (sameMonth) return `${s.getDate()}–${e.getDate()} ${month(s)} ${s.getFullYear()}`;
  const sameYear = s.getFullYear() === e.getFullYear();
  return `${s.getDate()} ${month(s)}${sameYear ? "" : ` ${s.getFullYear()}`} – ${e.getDate()} ${month(e)} ${e.getFullYear()}`;
}

export function monthKey(iso: string) {
  return iso.slice(0, 7);
}

export function formatMonth(key: string, lang: Lang) {
  const d = parse(`${key}-01`);
  const s = d.toLocaleDateString(locale(lang), { month: "long", year: "numeric" });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function dayParts(iso: string, lang: Lang) {
  const d = parse(iso);
  return {
    day: d.getDate(),
    weekday: d.toLocaleDateString(locale(lang), { weekday: "short" }).replace(".", ""),
    month: d.toLocaleDateString(locale(lang), { month: "short" }).replace(".", ""),
  };
}

export const formatNumber = (n: number, lang: Lang) => n.toLocaleString(locale(lang));

export const formatEUR = (n: number, lang: Lang) =>
  n.toLocaleString(locale(lang), { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

/** Días que faltan desde hoy (fecha ISO local) hasta el inicio. */
export function daysUntil(iso: string, today: string) {
  return Math.round((parse(iso).getTime() - parse(today).getTime()) / 86_400_000);
}
