"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Backpack, CalendarHeart, HeartPulse, QrCode } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "#manifiesto", label: "Manifiesto", icon: HeartPulse },
  { href: "#conecta", label: "Conecta", icon: QrCode },
  { href: "#festivales", label: "Festivales", icon: CalendarHeart },
  { href: "#checklist", label: "Checklist", icon: Backpack },
];

/** Barra de navegación inferior estilo app, visible tras salir del hero. */
export function BottomNav() {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    nav.forEach((n) => {
      const el = document.querySelector(n.href);
      if (el) observer.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed inset-x-0 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-50 mx-auto w-[calc(100%-1.5rem)] max-w-md"
          aria-label="Secciones"
        >
          <ul className="flex justify-around rounded-full border border-white/10 bg-slate-950/90 backdrop-blur-xl p-1.5 shadow-2xl shadow-black/50">
            {nav.map((n) => {
              const isActive = active === n.href;
              return (
                <li key={n.href} className="flex-1">
                  <a
                    href={n.href}
                    className={cn(
                      "flex flex-col items-center gap-0.5 rounded-full px-2 py-2 text-[10px] font-semibold transition-colors",
                      isActive ? "bg-white/10 text-neon-cyan" : "text-slate-400 hover:text-white"
                    )}
                  >
                    <n.icon className="h-5 w-5" />
                    {n.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
