"use client";

import Link from "next/link";
import { BookOpen, ChevronDown, Clock, Compass, Gavel, Hash, HeartHandshake, Medal, PiggyBank, Shirt, Sparkles, Trophy, Users } from "lucide-react";
import { festivals, flagEmoji } from "@/lib/festivals";
import { formatRange } from "@/lib/format";
import { useLang } from "@/lib/i18n";

function Block({ icon: Icon, title, children, open }: { icon: typeof BookOpen; title: string; children: React.ReactNode; open?: boolean }) {
  return (
    <details open={open} className="glass group rounded-3xl [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex cursor-pointer list-none items-center gap-3 p-5 sm:p-6">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-neon-cyan/25 to-neon-magenta/25">
          <Icon className="h-5 w-5 text-white" />
        </span>
        <h2 className="flex-1 font-display text-lg font-bold sm:text-xl">{title}</h2>
        <ChevronDown className="h-5 w-5 text-slate-400 transition-transform group-open:rotate-180" />
      </summary>
      <div className="space-y-3 px-5 pb-6 text-[15px] leading-relaxed text-slate-300 sm:px-6">{children}</div>
    </details>
  );
}

const PICKS = ["madrid-westie-fest", "arousa-westie-fest", "swing-resolution", "king-swing", "swing-in-capital", "mediterranean-open", "trinity-swing", "detonation-dance"];

export function Guide() {
  const { lang, L } = useLang();
  const picks = PICKS.map((s) => festivals.find((f) => f.slug === s)!).filter(Boolean);

  const divisions = [
    { d: "Newcomer", es: "Si nunca has competido en un evento WSDC. Debes subir al conseguir 1 punto en Newcomer o 1 en Novice.", en: "If you have never competed at a WSDC event. Move up after 1 Newcomer or 1 Novice point." },
    { d: "Novice", es: "Puedes subir con 16 puntos; obligatorio al llegar a 30 puntos (o 1 punto en Intermediate).", en: "Allowed up at 16 points; required at 30 (or 1 Intermediate point)." },
    { d: "Intermediate", es: "Puedes subir con 30; obligatorio a los 45 (o 1 punto en Advanced).", en: "Allowed up at 30; required at 45 (or 1 Advanced point)." },
    { d: "Advanced", es: "Puedes subir con 60; obligatorio a los 90 (o 1 punto en All-Star).", en: "Allowed up at 60; required at 90 (or 1 All-Star point)." },
    { d: "All-Star", es: "Puedes subir a Champion con 150; obligatorio a los 225.", en: "Allowed up to Champion at 150; required at 225." },
    { d: "Champion", es: "La élite mundial.", en: "The world elite." },
  ];

  const glossary: [string, string, string][] = [
    ["Jack & Jill (J&J)", "Competición con pareja asignada al azar: la reina del WCS y la que da puntos WSDC.", "Competition with a randomly drawn partner — the core WSDC points contest."],
    ["Strictly Swing", "Competición con pareja elegida por ti y música sorpresa.", "Competition with a partner you choose, to surprise music."],
    ["Routine / Showcase", "Coreografía preparada con música propia.", "A choreographed performance to your own music."],
    ["Heat / Preliminar", "Ronda clasificatoria con rotación de parejas.", "Qualifying round with partner rotation."],
    ["Callback", "Pasar a la siguiente ronda.", "Advancing to the next round."],
    ["Bib / Dorsal", "Tu número. Siempre visible en la espalda.", "Your number. Always visible on your back."],
    ["WSDC #", "Tu número de registro de puntos. Te lo asignan en tu primera competición.", "Your points-registry number, assigned at your first competition."],
    ["Full Pass", "Pase completo: clases, fiestas y competir.", "Full pass: classes, parties and competitions."],
    ["Party Pass", "Solo fiestas (a veces incluye competir).", "Parties only (sometimes includes competing)."],
    ["Early bird", "Tarifa anticipada, la más barata. Vuela.", "Early, cheapest pricing tier. Sells fast."],
    ["Track", "Itinerario de clases por nivel.", "A levelled workshop track."],
    ["Intensive", "Clase larga y especializada, normalmente el jueves.", "A long, focused class, usually on Thursday."],
    ["Late night", "La social de madrugada. Aquí se hacen amigos.", "The after-hours social. Where friendships happen."],
    ["Taxi dancer", "Profesional que baila con alumnos durante la social.", "A pro who dances with students during the social."],
    ["Anchor", "El final de cada patrón, el «ancla» del WCS.", "The ending of each pattern — WCS's signature."],
    ["Sugar push · Whip · Left side pass", "Los patrones básicos que bailarás toda tu vida.", "The basic patterns you'll dance forever."],
    ["Leader / Follower", "Los dos roles (no dependen del género).", "The two roles (not gender-specific)."],
    ["Rising Star", "Circuito y división para talentos emergentes de nivel avanzado.", "Circuit and division for up-and-coming advanced dancers."],
    ["Sophisticated / Masters", "Divisiones por edad (Sophisticated, a partir de 35 años; Masters, de 50).", "Age divisions (Sophisticated 35+, Masters 50+)."],
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 pt-6">
      <h1 className="font-display text-3xl font-black sm:text-4xl">
        {L("Guía del ", "The beginner ")}
        <span className="text-neon-gradient">{L("competidor principiante", "competitor's guide")}</span>
      </h1>
      <p className="mt-2 text-slate-400">
        {L(
          "Todo lo que necesitas saber antes de tu primer festival y tu primer Jack & Jill.",
          "Everything you need to know before your first festival and your first Jack & Jill."
        )}
      </p>

      <div className="mt-6 space-y-3">
        <Block icon={Trophy} title={L("¿Qué es la WSDC?", "What is the WSDC?")} open>
          <p>
            {L(
              "La World Swing Dance Council (WSDC) es la organización que lleva el registro oficial de puntos del West Coast Swing en todo el mundo. Los eventos «Registry» están acreditados de forma estable; los «Trial» están en periodo de prueba, pero sus puntos cuentan igual.",
              "The World Swing Dance Council (WSDC) keeps the official West Coast Swing points registry worldwide. 'Registry' events are fully accredited; 'Trial' events are on probation, but their points count the same."
            )}
          </p>
          <p>
            {L(
              "Los puntos solo se consiguen llegando a la final de un Jack & Jill. Cuantos más competidores hay en tu división, más puntos reparte esa final. Puedes consultar tus puntos en worldsdc.com con tu número WSDC.",
              "Points are only earned by placing in a Jack & Jill final. The more competitors in your division, the more points that final awards. Check your points on worldsdc.com with your WSDC number."
            )}
          </p>
        </Block>

        <Block icon={Medal} title={L("Divisiones y puntos", "Divisions and points")}>
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-white/5">
                {divisions.map((d) => (
                  <tr key={d.d}>
                    <th scope="row" className="w-32 bg-white/[0.03] p-3 text-left align-top font-display font-bold text-neon-cyan">
                      {d.d}
                    </th>
                    <td className="p-3">{L(d.es, d.en)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-500">
            {L(
              "Umbrales según la tabla de avance de 2026 que publican los eventos. La WSDC los revisa periódicamente: comprueba siempre la tabla oficial en worldsdc.com. Puedes competir como máximo en dos divisiones por evento, una por rol.",
              "Thresholds per the 2026 advancement chart published by events. The WSDC revises them periodically — always check the official chart on worldsdc.com. You may enter at most two divisions per event, one per role."
            )}
          </p>
        </Block>

        <Block icon={Sparkles} title={L("Tu primer Jack & Jill: empieza en Newcomer", "Your first Jack & Jill: start in Newcomer")}>
          <p>
            {L(
              "Si nunca has competido en un evento WSDC, inscríbete en Newcomer. Está pensado para que conozcas el proceso sin presión. Los jueces no buscan perfección: buscan potencial, musicalidad básica y, sobre todo, que te estés divirtiendo.",
              "If you've never competed at a WSDC event, enter Newcomer. It's designed to let you learn the process without pressure. Judges aren't looking for perfection: they want potential, basic musicality and, above all, that you're having fun."
            )}
          </p>
          <p>
            {L(
              "Una sonrisa genuina y una buena actitud pueden puntuar más que una figura difícil mal ejecutada. Si pasas a la final de Newcomer, darás el salto a Novice con mucha más confianza.",
              "A genuine smile and good attitude can score more than a hard move done badly. Reaching a Newcomer final means you'll move up to Novice with far more confidence."
            )}
          </p>
        </Block>

        <Block icon={Users} title={L("Preliminares (heats): te juzgan a ti", "Prelims (heats): you are judged individually")}>
          <ul className="list-disc space-y-2 pl-5">
            <li>{L("Te agrupan en tandas y bailas canciones cortas con varias parejas distintas, asignadas al azar.", "You're grouped in heats and dance short songs with several random partners.")}</li>
            <li>{L("Aunque bailas en pareja, la evaluación es individual: leaders contra leaders y followers contra followers.", "Although you dance with a partner, judging is individual: leaders vs leaders, followers vs followers.")}</li>
            <li>{L("Los jueces tienen muy poco tiempo para mirarte: se fijan en los fundamentos. Conexión clara, timing con la música y trabajo en equipo.", "Judges have very little time to watch you, so they focus on fundamentals: clear connection, timing and teamwork.")}</li>
            <li>{L("No intentes trucos: si sacrificas el ritmo o la conexión, resta.", "Don't attempt tricks: losing timing or connection costs you.")}</li>
            <li>{L("En eventos boutique como Arousa las preliminares son más pequeñas y los jueces te ven más veces; en gigantes como BudaFest hay muchísimas rondas.", "At boutique events like Arousa prelims are smaller and judges see you more; at giants like BudaFest there are many rounds.")}</li>
          </ul>
        </Block>

        <Block icon={HeartHandshake} title={L("La final: os juzgan como pareja", "The final: you are judged as a couple")}>
          <p>
            {L(
              "En la final te asignan una única pareja al azar para toda la ronda, y los jueces ya no te evalúan a ti, sino a la pareja. Tu nota depende de lo que creéis juntos: si bailas perfecto pero ignoras a tu pareja, la puntuación baja.",
              "In the final you get one random partner for the whole round, and judges now score the couple, not you. Your score depends on what you create together: dance perfectly but ignore your partner and the score drops."
            )}
          </p>
          <p className="font-semibold text-white">{L("Las 3 C de la final:", "The 3 Cs of the final:")}</p>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {[
              [L("Conexión", "Connection"), L("La calidad de la comunicación física.", "Quality of physical communication.")],
              [L("Musicalidad", "Musicality"), L("Cómo interpretáis la música juntos.", "How you interpret the music together.")],
              [L("Trabajo en equipo", "Teamwork"), L("Cómo os adaptáis el uno al otro.", "How you adapt to each other.")],
            ].map(([t, d]) => (
              <li key={t} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                <strong className="block text-neon-magenta">{t}</strong>
                <span className="text-sm">{d}</span>
              </li>
            ))}
          </ul>
        </Block>

        <Block icon={Clock} title={L("El día D: checklist del competidor", "Competition day checklist")}>
          <ul className="space-y-2">
            {[
              [Hash, L("Dorsal en la espalda, bien sujeto y visible: es la única forma que tienen los jueces de saber quién eres. Lleva imperdibles.", "Bib on your back, secure and visible — it's the only way judges know who you are. Bring safety pins.")],
              [Clock, L("Llega al salón al menos 15 minutos antes: calienta, escucha los anuncios y encuentra tu zona sin correr.", "Be in the ballroom at least 15 minutes early: warm up, hear announcements and find your spot calmly.")],
              [Gavel, L("Lee las reglas del evento o ve a la reunión de competidores. Cada evento tiene sus particularidades.", "Read the event rules or attend the competitors' meeting. Each event has its quirks.")],
              [HeartHandshake, L("Deportividad: agradece cada baile, salga bien o mal. Una mala actitud en la pista se nota y se recuerda.", "Sportsmanship: thank every partner, good dance or bad. Bad attitude on the floor gets noticed and remembered.")],
              [Sparkles, L("Si te equivocas, recupera con una sonrisa: esa habilidad te hace mejor competidor y mejor bailarín social.", "If you slip, recover with a smile — that skill makes you a better competitor and social dancer.")],
            ].map(([Icon, text], i) => {
              const I = Icon as typeof Hash;
              return (
                <li key={i} className="flex gap-3">
                  <I className="mt-0.5 h-5 w-5 shrink-0 text-neon-cyan" />
                  <span>{text as string}</span>
                </li>
              );
            })}
          </ul>
          <Link href="/pasaporte/" className="inline-block text-sm font-semibold text-neon-cyan underline">
            {L("Abrir mi checklist de maleta →", "Open my packing checklist →")}
          </Link>
        </Block>

        <Block icon={Compass} title={L("¿Qué festival elijo para empezar?", "Which festival should I start with?")}>
          <p>{L("Nuestras recomendaciones para la comunidad del Levante, por presión, precio y ambiente:", "Our picks for the Levante community, by pressure, price and vibe:")}</p>
          <ul className="space-y-2">
            {picks.map((f) => (
              <li key={f.slug}>
                <Link href={`/festival/${f.slug}/`} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3 hover:border-neon-cyan/40">
                  <span className="min-w-0">
                    <strong className="block truncate text-white">
                      {flagEmoji(f.countryCode)} {f.name}
                    </strong>
                    <span className="text-xs text-slate-400">{formatRange(f, lang)}</span>
                  </span>
                  <span className="shrink-0 text-xs text-emerald-300">{"★".repeat(f.beginner)}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-sm">
            {L(
              "Para tu primera vez evita los gigantes (BudaFest, French Open, UK Championships) si tu objetivo es competir: son increíbles, pero las preliminares son masivas. Ve a disfrutarlos como espectador y bailarín social.",
              "For your first time, avoid the giants (BudaFest, French Open, UK Championships) if you want to compete: they're amazing but prelims are huge. Enjoy them as a spectator and social dancer."
            )}
          </p>
        </Block>

        <Block icon={PiggyBank} title={L("Cómo ahorrar en tu temporada", "How to save money this season")}>
          <ul className="list-disc space-y-2 pl-5">
            <li>{L("Compra el early bird en cuanto abra la inscripción: la diferencia con el late puede superar los 40 €.", "Buy the early bird as soon as registration opens — the gap to late pricing can exceed €40.")}</li>
            <li>{L("Muchos eventos (Arousa, Warsaw Halloween, Baltic Swing) venden pases en pareja leader + follower. Busca pareja de inscripción en el grupo de WhatsApp.", "Many events (Arousa, Warsaw Halloween, Baltic Swing) sell leader + follower couple passes. Find a registration partner in the WhatsApp group.")}</li>
            <li>{L("Viajar en grupo da descuentos: Lisboa ofrece −10 % a grupos de 10 o más.", "Group travel gets discounts: Lisbon offers −10% for groups of 10+.")}</li>
            <li>{L("Comparte habitación en el hotel del evento: es más barato y no pierdes tiempo en traslados.", "Share a room at the event hotel: cheaper and no commuting.")}</li>
            <li>{L("Polonia y Hungría tienen la mejor relación calidad-precio de Europa.", "Poland and Hungary offer Europe's best value.")}</li>
            <li>{L("Desde el Levante: AVE/Ouigo/Iryo con antelación para España, y Alicante-Elche (ALC) para Europa, con muchísimas rutas low cost.", "From the Levante: book high-speed trains early for Spain, and use Alicante-Elche (ALC) for Europe — tons of low-cost routes.")}</li>
            <li>{L("Reino Unido: necesitas pasaporte y la autorización electrónica ETA. Para la UE basta el DNI y lleva la Tarjeta Sanitaria Europea.", "UK: you need a passport and the ETA. For the EU your ID card is enough; bring your EHIC.")}</li>
          </ul>
        </Block>

        <Block icon={Shirt} title={L("Glosario westie", "Westie glossary")}>
          <dl className="divide-y divide-white/5">
            {glossary.map(([term, es, en]) => (
              <div key={term} className="grid gap-1 py-2.5 sm:grid-cols-[12rem_1fr]">
                <dt className="font-semibold text-white">{term}</dt>
                <dd className="text-sm">{L(es, en)}</dd>
              </div>
            ))}
          </dl>
        </Block>
      </div>
    </div>
  );
}
