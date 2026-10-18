// Genera, antes del build, los archivos estáticos que dependen de los datos:
//  - public/ics/<slug>.ics      → un evento por festival (Apple/Outlook/Google)
//  - public/calendario.ics      → la temporada completa, para suscribirse
//  - public/precache.json       → rutas que el service worker guarda para uso sin conexión
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const dataDir = join(root, "data", "festivals");
const publicDir = join(root, "public");

const festivals = readdirSync(dataDir)
  .filter((f) => f.endsWith(".json"))
  .sort()
  .flatMap((f) => JSON.parse(readFileSync(join(dataDir, f), "utf8")))
  .sort((a, b) => a.start.localeCompare(b.start));

const SITE_URL = process.env.SITE_URL || "https://raymonbil.github.io/wcs-passport";

const escape = (s) => String(s).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

/** Pliega líneas a 75 octetos como exige RFC 5545. */
function fold(line) {
  const bytes = Buffer.from(line, "utf8");
  if (bytes.length <= 75) return line;
  const out = [];
  let chunk = "";
  for (const ch of line) {
    if (Buffer.byteLength(chunk + ch, "utf8") > (out.length ? 74 : 75)) {
      out.push(chunk);
      chunk = "";
    }
    chunk += ch;
  }
  out.push(chunk);
  return out.join("\r\n ");
}

const compact = (iso) => iso.replaceAll("-", "");
const dayAfter = (iso) => {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
};
const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");

function vevent(f) {
  const tentative = f.dateStatus === "tentative";
  const url = `${SITE_URL}/festival/${f.slug}/`;
  const description = [
    f.summary.es,
    tentative ? `⚠ Fechas por confirmar. ${f.dateNote || ""}` : "",
    f.website ? `Web oficial: ${f.website}` : "",
    `Ficha completa: ${url}`,
  ]
    .filter(Boolean)
    .join("\n\n");
  return [
    "BEGIN:VEVENT",
    `UID:${f.slug}-${f.edition}@wcs-passport`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${compact(f.start)}`,
    `DTEND;VALUE=DATE:${compact(dayAfter(f.end))}`,
    `SUMMARY:${escape(`${tentative ? "(Por confirmar) " : ""}${f.name} ${f.edition} · WCS`)}`,
    `LOCATION:${escape(f.venue)}`,
    `GEO:${f.coords[0]};${f.coords[1]}`,
    `DESCRIPTION:${escape(description)}`,
    `URL:${url}`,
    `STATUS:${tentative ? "TENTATIVE" : "CONFIRMED"}`,
    "TRANSP:TRANSPARENT",
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escape(`¡Quedan 2 semanas para ${f.name}! Prepara la maleta 🕺💃`)}`,
    "TRIGGER:-P14D",
    "END:VALARM",
    "END:VEVENT",
  ];
}

function calendar(name, events) {
  return (
    [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Levante West Coast Swing//WCS Passport//ES",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      `X-WR-CALNAME:${escape(name)}`,
      "X-WR-TIMEZONE:Europe/Madrid",
      "REFRESH-INTERVAL;VALUE=DURATION:P1D",
      "X-PUBLISHED-TTL:P1D",
      ...events.flatMap(vevent),
      "END:VCALENDAR",
    ]
      .map(fold)
      .join("\r\n") + "\r\n"
  );
}

const icsDir = join(publicDir, "ics");
rmSync(icsDir, { recursive: true, force: true });
mkdirSync(icsDir, { recursive: true });
for (const f of festivals) {
  writeFileSync(join(icsDir, `${f.slug}.ics`), calendar(`${f.name} ${f.edition}`, [f]));
}
writeFileSync(join(publicDir, "calendario.ics"), calendar("WCS Passport 2026–2027 · Festivales de West Coast Swing", festivals));

const routes = ["", "agenda/", "explorar/", "pasaporte/", "guia/", "comunidad/", ...festivals.map((f) => `festival/${f.slug}/`)];
writeFileSync(join(publicDir, "precache.json"), JSON.stringify(routes));

console.log(`✓ ${festivals.length} festivales → ics/, calendario.ics y precache.json (${routes.length} rutas)`);
