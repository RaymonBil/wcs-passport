import { withBase } from "./base-path";
import type { Festival } from "./festivals";

const compact = (iso: string) => iso.replaceAll("-", "");

const dayAfter = (iso: string) => {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
};

export function googleCalendarUrl(f: Festival) {
  const title = `${f.dateStatus === "tentative" ? "(Por confirmar) " : ""}${f.name} ${f.edition} · WCS`;
  const details = [f.summary.es, f.website ? `Web: ${f.website}` : "", "— West Coast Swing Passport 2026–2027"]
    .filter(Boolean)
    .join("\n\n");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${compact(f.start)}/${compact(dayAfter(f.end))}`,
    details,
    location: f.venue,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

/** Archivo .ics estático de un festival (generado en el build por scripts/generate-static.mjs). */
export const icsPath = (slug: string) => withBase(`/ics/${slug}.ics`);

export const seasonIcsPath = () => withBase("/calendario.ics");

/** URL absoluta del calendario de la temporada, para suscribirse (se actualiza solo). */
export function seasonFeedUrls() {
  const abs = new URL(seasonIcsPath(), window.location.origin).toString();
  const webcal = abs.replace(/^https?:/, "webcal:");
  return {
    https: abs,
    webcal,
    google: `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(webcal)}`,
  };
}
