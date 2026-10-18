"use client";

import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";
import type { Lang } from "./format";
import type { OriginId } from "./geo";

export type ViewMode = "grid" | "list" | "map";

export interface BudgetEntry {
  pass?: number;
  travel?: number;
  hotelPerNight?: number;
  foodPerDay?: number;
}

interface PassportState {
  lang: Lang;
  origin: OriginId;
  view: ViewMode;
  favorites: string[];
  /** slug → fecha ISO en la que se marcó como asistido. */
  attended: Record<string, string>;
  checklist: Record<string, boolean>;
  budgets: Record<string, BudgetEntry>;
  setLang: (lang: Lang) => void;
  setOrigin: (origin: OriginId) => void;
  setView: (view: ViewMode) => void;
  toggleFavorite: (slug: string) => void;
  toggleAttended: (slug: string, today: string) => void;
  toggleCheck: (id: string) => void;
  resetChecklist: () => void;
  setBudget: (slug: string, entry: BudgetEntry) => void;
}

/** localStorage puede no existir o lanzar (modo privado, previews): la app debe funcionar igual. */
const safeStorage: StateStorage = {
  getItem: (k) => {
    try {
      return localStorage.getItem(k);
    } catch {
      return null;
    }
  },
  setItem: (k, v) => {
    try {
      localStorage.setItem(k, v);
    } catch {}
  },
  removeItem: (k) => {
    try {
      localStorage.removeItem(k);
    } catch {}
  },
};

export const usePassport = create<PassportState>()(
  persist(
    (set) => ({
      lang: "es",
      origin: "alicante",
      view: "grid",
      favorites: [],
      attended: {},
      checklist: {},
      budgets: {},
      setLang: (lang) => set({ lang }),
      setOrigin: (origin) => set({ origin }),
      setView: (view) => set({ view }),
      toggleFavorite: (slug) =>
        set((s) => ({
          favorites: s.favorites.includes(slug) ? s.favorites.filter((x) => x !== slug) : [...s.favorites, slug],
        })),
      toggleAttended: (slug, today) =>
        set((s) => {
          const next = { ...s.attended };
          if (next[slug]) delete next[slug];
          else next[slug] = today;
          return { attended: next };
        }),
      toggleCheck: (id) => set((s) => ({ checklist: { ...s.checklist, [id]: !s.checklist[id] } })),
      resetChecklist: () => set({ checklist: {} }),
      setBudget: (slug, entry) => set((s) => ({ budgets: { ...s.budgets, [slug]: { ...s.budgets[slug], ...entry } } })),
    }),
    {
      name: "wcs-passport",
      version: 1,
      storage: createJSONStorage(() => safeStorage),
      // Se rehidrata tras el montaje (ver <Hydrator />) para no romper el HTML estático.
      skipHydration: true,
      partialize: ({ lang, origin, view, favorites, attended, checklist, budgets }) => ({
        lang,
        origin,
        view,
        favorites,
        attended,
        checklist,
        budgets,
      }),
    }
  )
);
