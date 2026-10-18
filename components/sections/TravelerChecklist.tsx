"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Backpack, PartyPopper, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

const items = [
  { id: "suelas", label: "Suelas deslizantes/fieltro", hint: "Para girar sin castigar las rodillas." },
  { id: "ropa", label: "3-4 mudas de ropa por noche", hint: "La social dura hasta el amanecer." },
  { id: "botiquin", label: "Botiquín (Ibuprofeno, tiritas, magnesio)", hint: "Ampollas y agujetas, bajo control." },
  { id: "tapones", label: "Tapones para los oídos", hint: "Para dormir entre maratones." },
  { id: "wsdc", label: "Número WSDC memorizado", hint: "Te lo pedirán al inscribirte en J&J." },
];

const STORAGE_KEY = "wcs-passport-checklist";

export function TravelerChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  // Estado en React; se recuerda en el dispositivo como comodidad (si el almacenamiento falla, sigue funcionando).
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setChecked(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
    } catch {}
  }, [checked]);

  const done = items.filter((i) => checked[i.id]).length;
  const progress = Math.round((done / items.length) * 100);
  const complete = done === items.length;

  return (
    <section id="checklist" className="relative px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-2xl">
        <Reveal className="mb-10">
          <p className="section-kicker flex items-center gap-2">
            <Backpack className="h-4 w-4" /> Checklist del Viajero
          </p>
          <h2 className="mt-4 font-display text-4xl font-black leading-tight sm:text-5xl">
            ¿Maleta <span className="text-neon-gradient">lista</span>?
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <Card className="overflow-hidden">
            <div className="border-b border-white/10 p-5 sm:p-6">
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-200">
                  {done} de {items.length} preparados
                </span>
                <span className="font-display font-bold text-neon-cyan">{progress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-neon-cyan to-neon-magenta"
                  animate={{ width: `${progress}%` }}
                  transition={{ type: "spring", stiffness: 120, damping: 20 }}
                />
              </div>
            </div>

            <ul className="divide-y divide-white/5">
              {items.map((item, i) => {
                const isChecked = !!checked[item.id];
                return (
                  <li key={item.id}>
                    <label
                      htmlFor={item.id}
                      className={cn(
                        "flex min-h-[64px] cursor-pointer items-center gap-4 px-5 py-4 transition-colors hover:bg-white/[0.03] sm:px-6",
                        isChecked && "bg-neon-magenta/[0.04]"
                      )}
                    >
                      <Checkbox
                        id={item.id}
                        checked={isChecked}
                        onCheckedChange={(v) => setChecked((prev) => ({ ...prev, [item.id]: v === true }))}
                      />
                      <span className="flex-1">
                        <span className="flex items-center gap-2">
                          <span className="font-display text-xs font-bold text-slate-500">0{i + 1}</span>
                          <span
                            className={cn(
                              "font-medium transition-all",
                              isChecked ? "text-slate-500 line-through decoration-neon-magenta/70" : "text-slate-100"
                            )}
                          >
                            {item.label}
                          </span>
                        </span>
                        <span className="mt-0.5 block pl-7 text-xs text-slate-500">{item.hint}</span>
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>

            <AnimatePresence>
              {complete && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center gap-3 bg-gradient-to-r from-neon-cyan/15 to-neon-magenta/15 px-5 py-4 sm:px-6">
                    <motion.span animate={{ rotate: [0, -15, 15, 0] }} transition={{ duration: 0.8, repeat: 2 }}>
                      <PartyPopper className="h-6 w-6 text-neon-magenta" />
                    </motion.span>
                    <p className="font-display font-bold">¡Listo para bailar hasta el amanecer!</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {done > 0 && (
              <div className="flex justify-end border-t border-white/10 px-5 py-3 sm:px-6">
                <Button variant="ghost" size="sm" onClick={() => setChecked({})}>
                  <RotateCcw /> Reiniciar lista
                </Button>
              </div>
            )}
          </Card>
        </Reveal>
      </div>
    </section>
  );
}
