"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { BookOpen, CalendarDays, Compass, Home, Stamp } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/", icon: Home, es: "Inicio", en: "Home" },
  { href: "/agenda/", icon: CalendarDays, es: "Agenda", en: "Calendar" },
  { href: "/explorar/", icon: Compass, es: "Explorar", en: "Explore" },
  { href: "/pasaporte/", icon: Stamp, es: "Pasaporte", en: "Passport" },
  { href: "/guia/", icon: BookOpen, es: "Guía", en: "Guide" },
];

export function BottomNav() {
  const pathname = usePathname();
  const { L } = useLang();
  const trim = (p: string) => p.replace(/\/$/, "") || "/";
  const current = trim(pathname);
  const active = (href: string) => {
    const h = trim(href);
    if (h === "/") return current === "/";
    return current.startsWith(h) || (h === "/explorar" && current.startsWith("/festival"));
  };

  return (
    <nav
      aria-label={L("Navegación principal", "Main navigation")}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-slate-950/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl"
    >
      <ul className="mx-auto flex max-w-lg">
        {tabs.map((t) => {
          const isActive = active(t.href);
          return (
            <li key={t.href} className="flex-1">
              <Link
                href={t.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold transition-colors",
                  isActive ? "text-neon-cyan" : "text-slate-400 hover:text-white"
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="tab-glow"
                    className="absolute inset-x-4 top-0 h-0.5 rounded-full bg-gradient-to-r from-neon-cyan to-neon-magenta"
                  />
                )}
                <t.icon className="h-5 w-5" />
                {L(t.es, t.en)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
