"use client";

import QRCode from "react-qr-code";
import { motion } from "framer-motion";
import { Camera, ExternalLink, Globe, HandHeart, HeartPulse, MapPin, MessageCircle, PenLine, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { site } from "@/data/site";
import { useLang } from "@/lib/i18n";

const socials: { title: string; es: string; en: string; cta: [string, string]; url: string; icon: LucideIcon }[] = [
  {
    title: "Web Oficial",
    es: "Horarios, sedes y novedades de las clases en el Levante.",
    en: "Class schedules, venues and news in the Levante.",
    cta: ["Visitar web", "Visit website"],
    url: site.links.web,
    icon: Globe,
  },
  {
    title: "WhatsApp",
    es: "Sociales, quedadas, coche compartido y pareja de inscripción para festivales.",
    en: "Socials, meetups, car sharing and registration partners for festivals.",
    cta: ["Unirme al grupo", "Join the group"],
    url: site.links.whatsapp,
    icon: MessageCircle,
  },
  {
    title: "Instagram",
    es: "Vídeos, fotos de las sociales y anuncios del circuito.",
    en: "Videos, social photos and circuit news.",
    cta: ["Seguir", "Follow"],
    url: site.links.instagram,
    icon: Camera,
  },
];

export function Community() {
  const { L } = useLang();
  return (
    <div className="mx-auto max-w-4xl px-4 pt-6">
      {/* Manifiesto */}
      <section>
        <p className="section-kicker flex items-center gap-2">
          <HeartPulse className="h-4 w-4" /> {L("Manifiesto", "Manifesto")}
        </p>
        <h1 className="mt-3 font-display text-4xl font-black leading-tight sm:text-5xl">
          {L("El Latido de una ", "The Heartbeat of a ")}
          <span className="text-neon-gradient">{L("Comunidad", "Community")}</span>
        </h1>
        <div className="mt-6 border-l-2 border-neon-magenta/60 pl-5 sm:pl-8">
          <p className="text-lg leading-relaxed text-slate-300 first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-6xl first-letter:font-black first-letter:leading-[0.85] first-letter:text-neon-cyan">
            En octubre de 2025, esto no era más que una quedada informal en Alicante. Hoy, con clases regulares en Cartagena, Murcia, Alicante y Torrevieja,
            hemos construido una red viva. Este ecosistema es impulsado por la dedicación de Ray en las aulas, el pilar organizativo de María Jesús e Isabel, y
            el respaldo de la Asociación LOBAILAO. No olvidamos a nuestros pioneros: el crecimiento bebe del terreno arado por líderes nacionales como Fran
            Vidal y Sara Mouchon. Al usar esta guía, estás financiando la expansión de las clases en el Levante.
          </p>
        </div>
        <ul className="mt-6 flex flex-wrap gap-2">
          {site.cities.map((c) => (
            <li key={c} className="glass flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium">
              <MapPin className="h-3.5 w-3.5 text-neon-magenta" /> {c}
            </li>
          ))}
        </ul>
      </section>

      {/* Carta del editor */}
      <section className="glass mt-10 rounded-3xl p-6 sm:p-8">
        <p className="section-kicker flex items-center gap-2">
          <PenLine className="h-4 w-4" /> {L("Carta del editor", "Editor's letter")}
        </p>
        <h2 className="mt-3 font-display text-2xl font-black">{L("¡Bienvenido a tu pasaporte westie!", "Welcome to your westie passport!")}</h2>
        <div className="mt-4 space-y-3 leading-relaxed text-slate-300">
          <p>
            {L(
              `Soy ${site.editor}, impulsor de Alicante West Coast Swing, y he preparado esta guía para ti. Si quieres dar el salto a las pistas nacionales e internacionales, planificar tu año de baile y vivir experiencias inolvidables, estás en el lugar correcto.`,
              `I'm ${site.editor}, founder of Alicante West Coast Swing, and I made this guide for you. If you want to jump onto national and international floors, plan your dance year and live unforgettable experiences, you're in the right place.`
            )}
          </p>
          <p>
            {L(
              "Está pensada para ser tu manual de cabecera: práctica, directa y llena de los detalles logísticos que de verdad importan para viajar desde España, y sobre todo desde el Levante.",
              "It's meant to be your go-to manual: practical, direct and full of the logistics that really matter when travelling from Spain — especially from the Levante."
            )}
          </p>
          <p>
            {L(
              "Un consejo: la comunidad española viaja muy unida. Revisa las webs de cada evento un par de meses antes y prepárate para inscribirte rápido, porque los early bird vuelan. ¡Nos vemos en la pista!",
              "One tip: the Spanish community travels together. Check each event's site a couple of months ahead and be quick to register — early birds sell out. See you on the floor!"
            )}
          </p>
          <p className="font-display font-bold text-white">— {site.editor}, {site.community}</p>
        </div>
      </section>

      {/* Hub social */}
      <section className="mt-10">
        <h2 className="font-display text-2xl font-black">
          {L("Conecta con la ", "Connect with the ")}
          <span className="text-neon-gradient">{L("pista", "floor")}</span>
        </h2>
        <p className="mt-1 text-sm text-slate-400">{L("Toca para abrir, o enseña el QR en la social para que otros lo escaneen.", "Tap to open, or show the QR at the social for others to scan.")}</p>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {socials.map((s, i) => (
            <motion.div
              key={s.url}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="glass flex flex-col rounded-3xl p-5"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-neon-cyan/25 to-neon-magenta/25">
                  <s.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display font-bold">{s.title}</h3>
                  <p className="text-sm text-slate-400">{L(s.es, s.en)}</p>
                </div>
              </div>
              <div className="mx-auto my-5 w-fit rounded-2xl bg-white p-3">
                <QRCode value={s.url} size={140} fgColor="#020617" aria-label={`QR ${s.title}`} />
              </div>
              <Button asChild variant="outline" className="mt-auto w-full">
                <a href={s.url} target="_blank" rel="noopener noreferrer">
                  {L(...s.cta)} <ExternalLink />
                </a>
              </Button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Apoyo */}
      <section className="mt-10 rounded-3xl border border-neon-magenta/30 bg-gradient-to-br from-neon-magenta/15 via-slate-950 to-neon-cyan/10 p-6 sm:p-8">
        <h2 className="flex items-center gap-2 font-display text-2xl font-black">
          <HandHeart className="h-6 w-6 text-neon-magenta" /> {L("Apoya el proyecto", "Support the project")}
        </h2>
        <p className="mt-3 leading-relaxed text-slate-300">
          {L(
            "Esta guía es gratuita y la mantiene la comunidad. Cada aportación ayuda a abrir clases nuevas en el Levante, traer profesores invitados y mantener el Passport actualizado.",
            "This guide is free and community-run. Every contribution helps open new classes in the Levante, bring guest teachers and keep the Passport up to date."
          )}
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          {site.donationUrl ? (
            <Button asChild size="lg">
              <a href={site.donationUrl} target="_blank" rel="noopener noreferrer">
                <HandHeart /> {L("Hacer una donación", "Make a donation")}
              </a>
            </Button>
          ) : (
            <Button asChild size="lg">
              <a href={site.links.web} target="_blank" rel="noopener noreferrer">
                <HandHeart /> {L("Hazte socio de LOBAILAO", "Join LOBAILAO")}
              </a>
            </Button>
          )}
          <Button asChild size="lg" variant="outline">
            <a href={site.links.whatsapp} target="_blank" rel="noopener noreferrer">
              <MessageCircle /> {L("Ven a clase", "Come to class")}
            </a>
          </Button>
        </div>
      </section>

      <footer className="mt-10 border-t border-white/10 pb-4 pt-6 text-center text-xs text-slate-500">
        <p className="font-display text-sm font-black uppercase tracking-widest text-slate-300">
          <span className="text-neon-gradient">WCS Passport</span> 26/27
        </p>
        <p className="mt-2">
          {site.community} · {site.association}
        </p>
        <p className="mt-2">
          {L(
            `Datos recopilados de webs oficiales y del registro WSDC (verificados el ${site.dataVerified}). Fechas y precios pueden cambiar: confírmalos siempre en la web de cada evento.`,
            `Data compiled from official sites and the WSDC registry (verified ${site.dataVerified}). Dates and prices may change — always confirm on each event's site.`
          )}
        </p>
        <p className="mt-1">{L("Mapas © colaboradores de OpenStreetMap.", "Maps © OpenStreetMap contributors.")}</p>
      </footer>
    </div>
  );
}
