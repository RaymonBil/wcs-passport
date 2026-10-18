"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Download, PlusSquare, Share, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface InstallCtx {
  canInstall: boolean;
  install: () => void;
}

const Ctx = createContext<InstallCtx>({ canInstall: false, install: () => {} });
export const useInstall = () => useContext(Ctx);

/**
 * Android/Chrome: usa el diálogo nativo (beforeinstallprompt).
 * iPhone/iPad: Safari no lo permite, así que mostramos una guía de 2 pasos.
 */
export function InstallProvider({ children }: { children: React.ReactNode }) {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [standalone, setStandalone] = useState(true);
  const [sheet, setSheet] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    setIsIOS(/iPad|iPhone|iPod/.test(ua) || (ua.includes("Mac") && "ontouchend" in document));
    setStandalone(
      window.matchMedia("(display-mode: standalone)").matches ||
        (navigator as Navigator & { standalone?: boolean }).standalone === true
    );
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setDeferred(null);
      setStandalone(true);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const install = useCallback(() => {
    if (deferred) {
      deferred.prompt();
      deferred.userChoice.finally(() => setDeferred(null));
    } else {
      setSheet(true);
    }
  }, [deferred]);

  const canInstall = !standalone && (!!deferred || isIOS);

  return (
    <Ctx.Provider value={{ canInstall, install }}>
      {children}
      <InstallSheet open={sheet} onClose={() => setSheet(false)} isIOS={isIOS} />
    </Ctx.Provider>
  );
}

function InstallSheet({ open, onClose, isIOS }: { open: boolean; onClose: () => void; isIOS: boolean }) {
  const { L } = useLang();
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="install-title"
            className="glass w-full max-w-md rounded-t-3xl bg-slate-950/95 p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:rounded-3xl"
            initial={{ y: 80 }}
            animate={{ y: 0 }}
            exit={{ y: 80 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <h2 id="install-title" className="font-display text-xl font-bold">
                {L("Añade el Passport a tu inicio", "Add the Passport to your home screen")}
              </h2>
              <button onClick={onClose} aria-label={L("Cerrar", "Close")} className="rounded-full p-1 text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            {isIOS ? (
              <ol className="space-y-4 text-sm text-slate-300">
                <li className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                    <Share className="h-5 w-5 text-neon-cyan" />
                  </span>
                  {L("1. En Safari, toca el botón Compartir (abajo o arriba).", "1. In Safari, tap the Share button.")}
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                    <PlusSquare className="h-5 w-5 text-neon-magenta" />
                  </span>
                  {L("2. Elige «Añadir a pantalla de inicio» y confirma.", "2. Choose 'Add to Home Screen' and confirm.")}
                </li>
              </ol>
            ) : (
              <p className="text-sm text-slate-300">
                {L(
                  "Abre el menú del navegador (⋮) y elige «Instalar aplicación» o «Añadir a pantalla de inicio».",
                  "Open the browser menu (⋮) and choose 'Install app' or 'Add to Home screen'."
                )}
              </p>
            )}
            <p className="mt-5 text-xs text-slate-500">
              {L(
                "Se abrirá a pantalla completa como una app y funcionará sin conexión.",
                "It will open full-screen like an app and work offline."
              )}
            </p>
            <Button className="mt-5 w-full" onClick={onClose}>
              {L("Entendido", "Got it")}
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function InstallButton({ className }: { className?: string }) {
  const { canInstall, install } = useInstall();
  const { L } = useLang();
  if (!canInstall) return null;
  return (
    <Button size="sm" variant="outline" onClick={install} className={className}>
      <Download /> {L("Instalar", "Install")}
    </Button>
  );
}
