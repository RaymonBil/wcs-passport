"use client";

import { Calculator, Info } from "lucide-react";
import { type Festival, nights } from "@/lib/festivals";
import { formatEUR } from "@/lib/format";
import { distanceKm, origins, travelEstimateEUR } from "@/lib/geo";
import { useLang } from "@/lib/i18n";
import { type BudgetEntry, usePassport } from "@/lib/store";

const HOTEL_BY_COST = [0, 60, 90, 130];
const FOOD_BY_COST = [0, 25, 35, 50];

/** Valores por defecto orientativos; el usuario los ajusta y se guardan en su dispositivo. */
export function budgetDefaults(f: Festival, originCoords: readonly [number, number]): Required<BudgetEntry> {
  return {
    pass: f.priceRefEUR ?? 0,
    travel: travelEstimateEUR(distanceKm(originCoords, f.coords)),
    hotelPerNight: HOTEL_BY_COST[f.costLevel] ?? 90,
    foodPerDay: FOOD_BY_COST[f.costLevel] ?? 35,
  };
}

export function budgetTotal(f: Festival, b: Required<BudgetEntry>) {
  const n = nights(f);
  return b.pass + b.travel + b.hotelPerNight * n + b.foodPerDay * (n + 1);
}

/** Valores efectivos: los guardados por el usuario sobre los valores por defecto. */
export function resolveBudget(f: Festival, originCoords: readonly [number, number], saved?: BudgetEntry) {
  const values: Required<BudgetEntry> = {
    ...budgetDefaults(f, originCoords),
    ...Object.fromEntries(Object.entries(saved ?? {}).filter(([, v]) => v !== undefined)),
  };
  return { values, total: budgetTotal(f, values) };
}

export function useBudget(f: Festival) {
  const origin = usePassport((s) => s.origin);
  const saved = usePassport((s) => s.budgets[f.slug]);
  return resolveBudget(f, origins[origin].coords, saved);
}

export function BudgetCalculator({ festival }: { festival: Festival }) {
  const { lang, L } = useLang();
  const setBudget = usePassport((s) => s.setBudget);
  const origin = usePassport((s) => s.origin);
  const { values, total } = useBudget(festival);
  const n = nights(festival);

  const fields: { key: keyof BudgetEntry; label: string; hint: string }[] = [
    {
      key: "pass",
      label: L("Pase (Full Pass)", "Pass (Full Pass)"),
      hint: festival.priceRefEUR ? L(`Referencia: ${festival.priceYear}`, `Reference: ${festival.priceYear}`) : L("Precio desconocido: introdúcelo", "Unknown price: enter it"),
    },
    { key: "travel", label: L(`Transporte i/v desde ${origins[origin].name}`, `Return travel from ${origins[origin].name}`), hint: L("Estimación según distancia", "Estimate by distance") },
    { key: "hotelPerNight", label: L(`Alojamiento por noche (${n} noches)`, `Accommodation per night (${n} nights)`), hint: L("Por persona, habitación compartida", "Per person, shared room") },
    { key: "foodPerDay", label: L(`Comida por día (${n + 1} días)`, `Food per day (${n + 1} days)`), hint: L("Media orientativa", "Rough average") },
  ];

  return (
    <section className="glass rounded-3xl p-5 sm:p-6" aria-labelledby="budget-title">
      <h2 id="budget-title" className="flex items-center gap-2 font-display text-xl font-bold">
        <Calculator className="h-5 w-5 text-neon-cyan" /> {L("Calcula tu presupuesto", "Estimate your budget")}
      </h2>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {fields.map((f) => (
          <label key={f.key} className="block">
            <span className="text-sm font-medium text-slate-200">{f.label}</span>
            <div className="mt-1 flex items-center rounded-xl border border-white/15 bg-white/5 focus-within:border-neon-cyan">
              <input
                type="number"
                inputMode="numeric"
                min={0}
                value={values[f.key]}
                onChange={(e) => setBudget(festival.slug, { [f.key]: e.target.value === "" ? 0 : Math.max(0, Number(e.target.value)) })}
                className="w-full bg-transparent px-3 py-2.5 text-base tabular-nums outline-none"
              />
              <span className="pr-3 text-slate-400">€</span>
            </div>
            <span className="mt-1 block text-xs text-slate-500">{f.hint}</span>
          </label>
        ))}
      </div>
      <div className="mt-5 flex items-end justify-between gap-4 rounded-2xl bg-gradient-to-r from-neon-cyan/15 to-neon-magenta/15 p-4">
        <span className="text-sm text-slate-300">{L("Total estimado por persona", "Estimated total per person")}</span>
        <span className="font-display text-3xl font-black tabular-nums">{formatEUR(total, lang)}</span>
      </div>
      <p className="mt-3 flex gap-2 text-xs text-slate-500">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        {L(
          "Cifras orientativas y editables. Se guardan en tu móvil y suman en tu Pasaporte. Los precios en otras monedas están convertidos de forma aproximada.",
          "Rough, editable figures. They're saved on your phone and add up in your Passport. Non-euro prices are approximate conversions."
        )}
      </p>
    </section>
  );
}
