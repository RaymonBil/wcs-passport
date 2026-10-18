"use client";

import { motion } from "framer-motion";
import { CalendarDays, MapPin, Plane, Ticket, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { type DanceEvent, getFlightsUrl, getTravelInfo } from "@/data/events";

export function EventCard({ event }: { event: DanceEvent }) {
  const { flag, airport } = getTravelInfo(event);
  const isTier1 = event.type.includes("Tier 1");

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="group relative h-full"
    >
      {/* Borde neón que aparece al hover */}
      <div
        aria-hidden
        className="absolute -inset-px rounded-3xl bg-gradient-to-br from-neon-cyan via-transparent to-neon-magenta opacity-30 transition-opacity duration-300 group-hover:opacity-100"
      />
      <Card className="relative flex h-full flex-col bg-slate-950/80">
        <CardHeader className="gap-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-3xl leading-none" role="img" aria-label={`Bandera de ${event.location}`}>
              {flag}
            </span>
            <Badge variant={isTier1 ? "magenta" : "cyan"}>
              {isTier1 && <Trophy className="h-3 w-3" />}
              {event.type}
            </Badge>
          </div>
          <CardTitle className="text-2xl">{event.title}</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col gap-4">
          <dl className="grid gap-2 text-sm">
            <div className="flex items-center gap-2 text-slate-200">
              <dt className="sr-only">Fechas</dt>
              <CalendarDays className="h-4 w-4 shrink-0 text-neon-cyan" />
              <dd className="font-semibold">{event.date}</dd>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <dt className="sr-only">Sede</dt>
              <MapPin className="h-4 w-4 shrink-0 text-neon-magenta" />
              <dd>{event.location}</dd>
            </div>
          </dl>
          <p className="text-sm leading-relaxed text-slate-400">{event.description}</p>
        </CardContent>

        <CardFooter className="mt-auto grid grid-cols-2 gap-3">
          <Button asChild size="sm" className="h-11">
            <a href={event.link} target="_blank" rel="noopener noreferrer">
              <Ticket /> Reservar
            </a>
          </Button>
          <Button asChild size="sm" variant="outline" className="h-11">
            <a href={getFlightsUrl(event)} target="_blank" rel="noopener noreferrer" aria-label={`Ver vuelos a ${airport || event.location}`}>
              <Plane /> Ver Vuelos
            </a>
          </Button>
        </CardFooter>
      </Card>
    </motion.article>
  );
}
