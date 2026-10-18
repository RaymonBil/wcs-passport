import { HeartPulse, MapPin } from "lucide-react";
import { Reveal } from "./Reveal";

const cities = ["Cartagena", "Murcia", "Alicante", "Torrevieja"];

export function Manifesto() {
  return (
    <section id="manifiesto" className="relative scroll-mt-4 px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <p className="section-kicker flex items-center gap-2">
            <HeartPulse className="h-4 w-4" /> Manifiesto
          </p>
          <h2 className="mt-4 font-display text-4xl font-black leading-tight sm:text-5xl">
            El Latido de una <span className="text-neon-gradient">Comunidad</span>
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-8 border-l-2 border-neon-magenta/60 pl-5 sm:pl-8">
            <p className="text-lg leading-relaxed text-slate-300 first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-6xl first-letter:font-black first-letter:leading-[0.85] first-letter:text-neon-cyan sm:text-xl sm:leading-relaxed">
              En octubre de 2025, esto no era más que una quedada informal en Alicante. Hoy, con clases regulares en
              Cartagena, Murcia, Alicante y Torrevieja, hemos construido una red viva. Este ecosistema es impulsado por
              la dedicación de Ray en las aulas, el pilar organizativo de María Jesús e Isabel, y el respaldo de la
              Asociación LOBAILAO. No olvidamos a nuestros pioneros: el crecimiento bebe del terreno arado por líderes
              nacionales como Fran Vidal y Sara Mouchon. Al usar esta guía, estás financiando la expansión de las clases
              en el Levante.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <ul className="mt-10 flex flex-wrap gap-2">
            {cities.map((c) => (
              <li
                key={c}
                className="glass flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-slate-200"
              >
                <MapPin className="h-3.5 w-3.5 text-neon-magenta" /> {c}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
