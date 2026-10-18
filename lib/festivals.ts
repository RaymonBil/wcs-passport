import espanaPortugal from "@/data/festivals/01-espana-portugal.json";
import francia from "@/data/festivals/02-francia.json";
import reinoUnido from "@/data/festivals/03-reino-unido-irlanda.json";
import centro from "@/data/festivals/04-centro-europa-italia.json";
import esteNordicos from "@/data/festivals/05-este-nordicos.json";
import citiesData from "@/data/cities.json";

export type WsdcType = "registry" | "trial" | "none";
export type FestivalSize = "boutique" | "mediano" | "grande" | "masivo";

export interface PriceLine {
  label: string;
  value: string;
}

export interface Festival {
  slug: string;
  name: string;
  edition: string;
  region: "espana" | "europa";
  country: string;
  countryCode: string;
  cityId: string;
  venue: string;
  coords: [number, number];
  start: string;
  end: string;
  dateStatus: "confirmed" | "tentative";
  dateNote?: string;
  wsdc: WsdcType;
  size: FestivalSize;
  tags: string[];
  beginner: number;
  costLevel: number;
  soldOut?: boolean;
  prices: PriceLine[];
  priceYear: string;
  priceRefEUR?: number;
  priceNote?: string;
  website?: string;
  teachers?: string[];
  summary: { es: string; en: string };
  description: string;
  highlights: string[];
  levanteTip: string;
  access: string;
  sources: string[];
  verified: string;
}

export interface City {
  name: string;
  region: string;
  intro: string;
  culture: string[];
  food: string[];
  climate: string;
  airports: { code: string; name: string; distance: string }[];
  train: string;
  fromSpain: { madrid: string; barcelona: string; valencia: string; alicante: string };
}

export const cities = citiesData as Record<string, City>;

export const festivals: Festival[] = (
  [...espanaPortugal, ...francia, ...reinoUnido, ...centro, ...esteNordicos] as Festival[]
).sort((a, b) => a.start.localeCompare(b.start) || a.name.localeCompare(b.name));

export const getFestival = (slug: string) => festivals.find((f) => f.slug === slug);
export const getCity = (f: Festival) => cities[f.cityId];

/** ISO yyyy-mm-dd del día local. */
export const toISODate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const isPast = (f: Festival, today: string) => f.end < today;
export const isOngoing = (f: Festival, today: string) => f.start <= today && f.end >= today;

export const upcoming = (today: string) => festivals.filter((f) => !isPast(f, today));

export const nights = (f: Festival) =>
  Math.max(1, Math.round((Date.parse(f.end) - Date.parse(f.start)) / 86_400_000));

export const countries = Array.from(new Set(festivals.map((f) => f.country))).sort((a, b) => a.localeCompare(b, "es"));

/** Emoji de bandera a partir del código ISO (con soporte para Escocia). */
export function flagEmoji(code: string) {
  if (code === "GB-SCT") return "🏴󠁧󠁢󠁳󠁣󠁴󠁿";
  return code
    .slice(0, 2)
    .toUpperCase()
    .replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
}

export const wsdcLabel: Record<WsdcType, { es: string; en: string }> = {
  registry: { es: "WSDC Registry", en: "WSDC Registry" },
  trial: { es: "WSDC Trial", en: "WSDC Trial" },
  none: { es: "Sin puntos WSDC", en: "No WSDC points" },
};

export const sizeLabel: Record<FestivalSize, { es: string; en: string }> = {
  boutique: { es: "Boutique", en: "Boutique" },
  mediano: { es: "Mediano", en: "Medium" },
  grande: { es: "Grande", en: "Large" },
  masivo: { es: "Masivo", en: "Huge" },
};

export const costSymbol = (level: number) => "€".repeat(Math.min(3, Math.max(1, level)));

/** Degradado de portada determinista por festival, siempre dentro de la paleta de la marca. */
const POSTER_GRADIENTS = [
  "from-cyan-500 via-sky-600 to-fuchsia-600",
  "from-fuchsia-600 via-purple-600 to-cyan-500",
  "from-violet-600 via-fuchsia-500 to-amber-400",
  "from-emerald-500 via-cyan-600 to-indigo-600",
  "from-rose-500 via-fuchsia-600 to-indigo-700",
  "from-sky-500 via-indigo-600 to-fuchsia-500",
];

export function posterGradient(slug: string) {
  let h = 0;
  for (const c of slug) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return POSTER_GRADIENTS[h % POSTER_GRADIENTS.length];
}
