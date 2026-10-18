"use client";

import { motion } from "framer-motion";
import QRCode from "react-qr-code";
import { ExternalLink, Camera, Globe, MessageCircle, QrCode, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Reveal } from "./Reveal";

interface SocialLink {
  title: string;
  description: string;
  cta: string;
  url: string;
  icon: LucideIcon;
  glow: string;
}

const links: SocialLink[] = [
  {
    title: "Web Oficial",
    description: "Horarios, sedes y novedades de las clases en el Levante.",
    cta: "Visitar web",
    url: "https://wcslevante.es",
    icon: Globe,
    glow: "group-hover:shadow-neon-cyan",
  },
  {
    title: "Comunidad WhatsApp",
    description: "Sociales, quedadas y coches compartidos a festivales.",
    cta: "Unirme al grupo",
    url: "https://chat.whatsapp.com/CEWS2XSNzgLJOCChcmEPNH",
    icon: MessageCircle,
    glow: "group-hover:shadow-[0_0_24px_-4px_rgba(34,197,94,0.6)]",
  },
  {
    title: "Instagram",
    description: "Vídeos, fotos de las sociales y anuncios del circuito.",
    cta: "Seguir en Instagram",
    url: "https://www.instagram.com/alicantewestcoastswing/",
    icon: Camera,
    glow: "group-hover:shadow-neon-magenta",
  },
];

export function SocialHub() {
  return (
    <section id="conecta" className="relative px-4 py-24 sm:py-32">
      <div aria-hidden className="absolute inset-x-0 top-1/2 -z-10 h-64 -translate-y-1/2 bg-gradient-to-r from-neon-cyan/10 via-transparent to-neon-magenta/10 blur-3xl" />
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-12 text-center">
          <p className="section-kicker flex items-center justify-center gap-2">
            <QrCode className="h-4 w-4" /> Hub Social
          </p>
          <h2 className="mt-4 font-display text-4xl font-black sm:text-5xl">
            Conecta con la <span className="text-neon-gradient">pista</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-slate-400">
            Toca para abrir o escanea el QR desde otro móvil para compartirlo en la social.
          </p>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((link, i) => (
            <Reveal key={link.url} delay={i * 0.1}>
              <motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="group h-full">
                <Card className={`flex h-full flex-col transition-shadow duration-300 ${link.glow}`}>
                  <CardHeader className="flex-row items-start gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-neon-cyan/25 to-neon-magenta/25 ring-1 ring-white/10">
                      <link.icon className="h-6 w-6 text-white" />
                    </span>
                    <div>
                      <CardTitle>{link.title}</CardTitle>
                      <CardDescription className="mt-1">{link.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="mt-auto flex flex-col items-center gap-5">
                    <div className="rounded-2xl bg-white p-3 shadow-[0_0_40px_-10px_rgba(6,182,212,0.6)] transition-transform duration-300 group-hover:scale-[1.03]">
                      <QRCode
                        value={link.url}
                        size={152}
                        bgColor="#FFFFFF"
                        fgColor="#020617"
                        level="M"
                        aria-label={`Código QR para ${link.title}`}
                        style={{ height: "auto", maxWidth: "100%", width: "152px" }}
                      />
                    </div>
                    <Button asChild variant="outline" className="w-full">
                      <a href={link.url} target="_blank" rel="noopener noreferrer">
                        {link.cta} <ExternalLink />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
