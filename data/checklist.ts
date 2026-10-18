/** Checklist del viajero. Los 5 primeros son los del Passport original. */
export const checklist = [
  {
    id: "ropa",
    es: "Calzado y ropa",
    en: "Shoes & clothes",
    items: [
      { id: "suelas", es: "Suelas deslizantes/fieltro", en: "Suede/felt soles" },
      { id: "mudas", es: "3-4 mudas de ropa por noche", en: "3–4 changes of clothes per night" },
      { id: "clases", es: "Ropa cómoda para las clases", en: "Comfortable clothes for workshops" },
      { id: "tematica", es: "Outfit para la noche temática", en: "Outfit for the theme night" },
      { id: "banador", es: "Bañador (si hay spa o piscina)", en: "Swimsuit (if there's a spa or pool)" },
    ],
  },
  {
    id: "salud",
    es: "Salud y bienestar",
    en: "Health & wellbeing",
    items: [
      { id: "botiquin", es: "Botiquín (Ibuprofeno, tiritas, magnesio)", en: "First-aid kit (ibuprofen, plasters, magnesium)" },
      { id: "tapones", es: "Tapones para los oídos", en: "Earplugs" },
      { id: "desodorante", es: "Desodorante y toallitas", en: "Deodorant and wipes" },
      { id: "mentas", es: "Caramelos de menta o chicles", en: "Mints or chewing gum" },
      { id: "agua", es: "Botella de agua reutilizable", en: "Reusable water bottle" },
    ],
  },
  {
    id: "competicion",
    es: "Competición",
    en: "Competition",
    items: [
      { id: "wsdc", es: "Número WSDC memorizado", en: "WSDC number memorised" },
      { id: "imperdibles", es: "Imperdibles para el dorsal", en: "Safety pins for your bib" },
      { id: "reglas", es: "Reglas del evento leídas", en: "Event rules read" },
    ],
  },
  {
    id: "viaje",
    es: "Documentación y viaje",
    en: "Documents & travel",
    items: [
      { id: "documento", es: "DNI o pasaporte (Reino Unido: pasaporte + ETA)", en: "ID or passport (UK: passport + ETA)" },
      { id: "tse", es: "Tarjeta Sanitaria Europea", en: "European Health Insurance Card" },
      { id: "seguro", es: "Seguro de viaje", en: "Travel insurance" },
      { id: "offline", es: "Entradas y reservas guardadas sin conexión", en: "Tickets and bookings saved offline" },
      { id: "cargador", es: "Cargador, batería externa y adaptador (UK/Suiza)", en: "Charger, power bank and adapter (UK/Switzerland)" },
    ],
  },
] as const;

export const checklistCount = checklist.reduce((n, g) => n + g.items.length, 0);
