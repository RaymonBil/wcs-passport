"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Globe2, Heart, Medal, Sparkles, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { categoryMeta, initialEvents, type DanceEvent, type EventCategory } from "@/data/events";
import { EventCard } from "./EventCard";
import { Reveal } from "./Reveal";

type Filter = "Todos" | EventCategory;

const categoryOrder: EventCategory[] = ["Nacional", "Social", "Europa"];
const categoryIcons: Record<EventCategory, LucideIcon> = { Nacional: Medal, Social: Heart, Europa: Globe2 };

export function FestivalCatalog() {
  const [events] = useState<DanceEvent[]>(initialEvents);
  const [filter, setFilter] = useState<Filter>("Todos");

  const visibleCategories = filter === "Todos" ? categoryOrder : [filter];
  const filters: { value: Filter; label: string; count: number }[] = [
    { value: "Todos", label: "Todos", count: events.length },
    ...categoryOrder.map((c) => ({
      value: c,
      label: categoryMeta[c].label,
      count: events.filter((e) => e.category === c).length,
    })),
  ];

  return (
    <section id="festivales" className="relative px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-10">
          <p className="section-kicker flex items-center gap-2">
            <Sparkles className="h-4 w-4" /> Catálogo de Festivales
          </p>
          <h2 className="mt-4 font-display text-4xl font-black leading-tight sm:text-5xl">
            Tu próxima <span className="text-neon-gradient">pista</span> te espera
          </h2>
        </Reveal>

        {/* Filtros: barra fija con scroll horizontal en móvil */}
        <div className="sticky top-0 z-30 -mx-4 mb-10 border-b border-white/5 bg-slate-950/70 px-4 py-3 backdrop-blur-xl">
          <div role="tablist" aria-label="Filtrar por categoría" className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {filters.map((f) => {
              const active = filter === f.value;
              return (
                <button
                  key={f.value}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(f.value)}
                  className={cn(
                    "relative shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                    active ? "text-white" : "text-slate-400 hover:text-white"
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="filter-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-neon-cyan to-neon-magenta"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  {f.label} <span className={cn("ml-1 text-xs", active ? "text-white/80" : "text-slate-500")}>{f.count}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-16">
          <AnimatePresence mode="popLayout">
            {visibleCategories.map((cat) => {
              const meta = categoryMeta[cat];
              const Icon = categoryIcons[cat];
              const list = events.filter((e) => e.category === cat);
              return (
                <motion.div
                  key={cat}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="mb-6 flex items-end justify-between gap-4 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "flex h-11 w-11 items-center justify-center rounded-2xl ring-1",
                          meta.accent === "cyan"
                            ? "bg-neon-cyan/15 text-neon-cyan ring-neon-cyan/30"
                            : "bg-neon-magenta/15 text-neon-magenta ring-neon-magenta/30"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="font-display text-2xl font-extrabold">{meta.label}</h3>
                        <p className="text-sm text-slate-400">{meta.tagline}</p>
                      </div>
                    </div>
                    <span className="hidden font-display text-5xl font-black text-white/5 sm:block">
                      0{categoryOrder.indexOf(cat) + 1}
                    </span>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {list.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
