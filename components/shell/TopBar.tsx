"use client";

import Link from "next/link";
import { Users } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { usePassport } from "@/lib/store";
import { InstallButton } from "./InstallPrompt";

export function TopBar() {
  const { lang, L } = useLang();
  const setLang = usePassport((s) => s.setLang);

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/80 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-4">
        <Link href="/" className="mr-auto flex items-center gap-2" aria-label="WCS Passport — inicio">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-neon-cyan to-neon-magenta font-display text-[11px] font-black text-white">
            WCS
          </span>
          <span className="font-display text-sm font-extrabold uppercase tracking-wider">
            Passport <span className="text-neon-gradient">26/27</span>
          </span>
        </Link>
        <InstallButton className="h-8 px-3" />
        <Link
          href="/comunidad/"
          className="flex h-8 w-8 items-center justify-center rounded-full text-slate-300 hover:bg-white/10 hover:text-white"
          aria-label={L("Comunidad", "Community")}
        >
          <Users className="h-4 w-4" />
        </Link>
        <button
          onClick={() => setLang(lang === "es" ? "en" : "es")}
          className="h-8 rounded-full border border-white/15 px-3 text-xs font-bold text-slate-200 hover:border-neon-cyan/60 hover:text-neon-cyan"
          aria-label={L("Cambiar idioma a inglés", "Switch language to Spanish")}
        >
          {lang === "es" ? "EN" : "ES"}
        </button>
      </div>
    </header>
  );
}
