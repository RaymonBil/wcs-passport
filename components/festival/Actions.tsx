"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import QRCode from "react-qr-code";
import { CalendarPlus, Check, Copy, ExternalLink, Plane, QrCode, Share2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { googleCalendarUrl, icsPath } from "@/lib/calendar";
import type { Festival } from "@/lib/festivals";
import { getCity } from "@/lib/festivals";
import { useLang } from "@/lib/i18n";
import { usePassport } from "@/lib/store";

const ORIGIN_AIRPORT: Record<string, string> = {
  alicante: "ALC",
  murcia: "RMU",
  cartagena: "RMU",
  torrevieja: "ALC",
  valencia: "VLC",
  madrid: "MAD",
  barcelona: "BCN",
};

export function flightsUrl(f: Festival, originId: string) {
  const to = getCity(f).airports[0]?.code ?? f.cityId;
  const from = ORIGIN_AIRPORT[originId] ?? "ALC";
  return `https://www.google.com/travel/flights?q=${encodeURIComponent(`Vuelos de ${from} a ${to} el ${f.start}`)}&hl=es`;
}

/** Menú «Añadir al calendario»: Google Calendar o archivo .ics (iPhone, Outlook, Android). */
export function CalendarMenu({ festival }: { festival: Festival }) {
  const { L } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <Button variant="outline" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="w-full">
        <CalendarPlus /> {L("Al calendario", "Add to calendar")}
      </Button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="glass absolute left-0 right-0 top-full z-30 mt-2 min-w-[14rem] overflow-hidden rounded-2xl bg-slate-950/95 p-1.5 shadow-2xl"
          >
            <a
              href={googleCalendarUrl(festival)}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl px-3 py-2.5 text-sm hover:bg-white/10"
              onClick={() => setOpen(false)}
            >
              Google Calendar
            </a>
            <a href={icsPath(festival.slug)} download className="block rounded-xl px-3 py-2.5 text-sm hover:bg-white/10" onClick={() => setOpen(false)}>
              {L("iPhone / Outlook / otro (.ics)", "iPhone / Outlook / other (.ics)")}
            </a>
            {festival.dateStatus === "tentative" && (
              <p className="px-3 pb-2 pt-1 text-xs text-amber-300">
                {L("Fechas estimadas: se añadirá como «Por confirmar».", "Estimated dates: it will be added as 'TBC'.")}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ShareButton({ title, text }: { title: string; text: string }) {
  const { L } = useLang();
  const [copied, setCopied] = useState(false);
  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {
        return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };
  return (
    <Button variant="outline" onClick={share} className="w-full">
      {copied ? <Check /> : <Share2 />} {copied ? L("Enlace copiado", "Link copied") : L("Compartir", "Share")}
    </Button>
  );
}

export function FlightsButton({ festival }: { festival: Festival }) {
  const { L } = useLang();
  const origin = usePassport((s) => s.origin);
  return (
    <Button asChild variant="outline" className="w-full">
      <a href={flightsUrl(festival, origin)} target="_blank" rel="noopener noreferrer">
        <Plane /> {L("Buscar vuelos", "Find flights")}
      </a>
    </Button>
  );
}

export function WebButton({ festival }: { festival: Festival }) {
  const { L } = useLang();
  if (!festival.website) return null;
  return (
    <Button asChild className="w-full">
      <a href={festival.website} target="_blank" rel="noopener noreferrer">
        <ExternalLink /> {L("Web oficial / Reservar", "Official site / Book")}
      </a>
    </Button>
  );
}

/** QR de la ficha para compartirla en la social: otra persona lo escanea y la abre al instante. */
export function QrButton({ name }: { name: string }) {
  const { L } = useLang();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);
  useEffect(() => setUrl(window.location.href), []);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)} className="w-full">
        <QrCode /> {L("Código QR", "QR code")}
      </Button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={L("Código QR de la ficha", "QR code for this page")}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="glass w-full max-w-xs rounded-3xl bg-slate-950/95 p-6 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display font-bold">{name}</h2>
                <button onClick={() => setOpen(false)} aria-label={L("Cerrar", "Close")} className="text-slate-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="mx-auto w-fit rounded-2xl bg-white p-3">{url && <QRCode value={url} size={200} fgColor="#020617" />}</div>
              <p className="mt-3 text-xs text-slate-400">{L("Escanéalo con la cámara de otro móvil.", "Scan it with another phone's camera.")}</p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(url);
                    setCopied(true);
                  } catch {}
                }}
              >
                {copied ? <Check /> : <Copy />} {copied ? L("Copiado", "Copied") : L("Copiar enlace", "Copy link")}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
