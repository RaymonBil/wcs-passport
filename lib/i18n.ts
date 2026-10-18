"use client";

import type { Lang } from "./format";
import { usePassport } from "./store";

/** Traducción en línea: L("Hola", "Hello"). Mantiene cada texto junto a su traducción. */
export function useLang() {
  const lang = usePassport((s) => s.lang);
  const L = (es: string, en: string) => (lang === "es" ? es : en);
  return { lang, L };
}

export const pick = <T>(lang: Lang, value: { es: T; en: T }) => value[lang];
