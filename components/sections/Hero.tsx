"use client";

import { motion } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=1600&q=70";

export function Hero() {
  return (
    <header className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden px-4">
      {/* Fondo: foto de Unsplash + degradados de respaldo (si la imagen no carga, sigue viéndose bien) */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(2,6,23,0.55) 0%, rgba(2,6,23,0.75) 60%, #020617 100%), url(${HERO_IMAGE}), radial-gradient(ellipse at 20% 20%, #0e7490 0%, transparent 55%), radial-gradient(ellipse at 80% 70%, #a21caf 0%, transparent 55%)`,
        }}
      />
      <div aria-hidden className="noise absolute inset-0 -z-10 opacity-60" />

      {/* Orbes de luz animados */}
      <motion.div
        aria-hidden
        className="absolute -left-24 top-1/4 -z-10 h-72 w-72 rounded-full bg-neon-cyan/30 blur-[100px]"
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute -right-24 bottom-1/4 -z-10 h-80 w-80 rounded-full bg-neon-magenta/30 blur-[110px]"
        animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Badge variant="cyan" className="mb-6">
            <Sparkles className="h-3.5 w-3.5" /> Revista digital · Temporada 26/27
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-[2.6rem] font-black uppercase leading-[0.95] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
        >
          <span className="text-neon-gradient bg-[length:200%_auto] animate-gradient-x drop-shadow-[0_0_30px_rgba(217,70,239,0.35)]">
            West Coast Swing
          </span>
          <br />
          <span className="text-neon-gradient bg-[length:200%_auto] animate-gradient-x">Passport</span>
          <br />
          <span className="mt-2 inline-block text-2xl font-extrabold tracking-[0.25em] text-white/90 sm:text-4xl">
            2026–2027
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-6 max-w-xl text-balance text-base text-slate-300 sm:text-lg"
        >
          La Guía Definitiva del Circuito Europeo: De la Pista Local al Mundo.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8"
        >
          <Badge variant="glass" className="flex-wrap justify-center gap-x-2 px-5 py-2 text-center text-[10px] tracking-[0.15em] sm:text-xs">
            <span>Edición Especial Levante West Coast Swing</span>
            <span className="text-neon-magenta">|</span>
            <span>LOBAILAO</span>
          </Badge>
        </motion.div>
      </div>

      {/* Botón flotante "Explorar Guía" */}
      <div className="absolute inset-x-0 bottom-[max(2rem,env(safe-area-inset-bottom))] flex justify-center">
      <motion.a
        href="#manifiesto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: [0, -8, 0] }}
        transition={{ opacity: { delay: 0.9 }, y: { duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.9 } }}
      >
        <span className="relative flex flex-col items-center gap-2">
          <span className="absolute inset-0 -z-10 rounded-full bg-neon-magenta/40 animate-pulse-ring" />
          <span className="flex items-center gap-2 rounded-full bg-gradient-to-r from-neon-cyan to-neon-magenta px-6 py-3 font-display text-sm font-bold text-white shadow-neon-magenta">
            Explorar Guía <ChevronDown className="h-4 w-4" />
          </span>
        </span>
      </motion.a>
      </div>
    </header>
  );
}
