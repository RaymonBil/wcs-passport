export type EventCategory = "Nacional" | "Social" | "Europa";

export interface DanceEvent {
  id: number;
  category: EventCategory;
  title: string;
  date: string;
  location: string;
  type: string;
  description: string;
  link: string;
}

export const initialEvents: DanceEvent[] = [
  { id: 1, category: "Nacional", title: "Arousa Westie Fest", date: "18-21 Feb 2027", location: "Sanxenxo, Galicia", type: "WSDC Registry", description: "Evento boutique de altísimo nivel competitivo y gastronomía premium.", link: "https://www.arousawestiefest.com/" },
  { id: 2, category: "Nacional", title: "BeeMAD WCS", date: "29 Abr - 2 May 2027", location: "Madrid", type: "WSDC Registry", description: "La gran cumbre nacional con sistema de Tracks pedagógicos. Social hasta el amanecer.", link: "https://beemadwcs.com/" },
  { id: 3, category: "Social", title: "Madrid Westie Fest", date: "Octubre Anual", location: "Círculo de Baile, Madrid", type: "Formativo", description: "Ideal para desconectar de los puntos. Clases desde cero con Sara Mouchon y Fran Vidal.", link: "https://wcswingmadrid.com/" },
  { id: 4, category: "Europa", title: "BudaFest Open", date: "5-10 Ene 2027", location: "Budapest, Hungría", type: "WSDC Tier 1", description: "El Super Bowl europeo (>1.200 asistentes). Termas, nivel All-Star y maratón.", link: "https://wcs-budafest.com/" },
  { id: 5, category: "Europa", title: "Swing Resolution", date: "21-25 Ene 2027", location: "Edimburgo, Escocia", type: "WSDC Registry", description: "El evento más amigable. Temática Disney, tartas gratis y 3 salones de baile.", link: "https://swingresolution.com/" },
];

export const categoryMeta: Record<EventCategory, { label: string; tagline: string; accent: "cyan" | "magenta" }> = {
  Nacional: { label: "Nacionales WSDC", tagline: "Puntúa en casa: el circuito oficial en España.", accent: "cyan" },
  Social: { label: "Alma Social", tagline: "Sin presión de puntos. Puro baile y comunidad.", accent: "magenta" },
  Europa: { label: "Gigantes Europeos", tagline: "Los escenarios donde se baila a otro nivel.", accent: "cyan" },
};

/** Bandera y aeropuerto de destino más cercano a cada sede (origen por defecto: Alicante, ALC). */
const travelInfo: Record<number, { flag: string; airport: string; city: string }> = {
  1: { flag: "🇪🇸", airport: "VGO", city: "Vigo" },
  2: { flag: "🇪🇸", airport: "MAD", city: "Madrid" },
  3: { flag: "🇪🇸", airport: "MAD", city: "Madrid" },
  4: { flag: "🇭🇺", airport: "BUD", city: "Budapest" },
  5: { flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", airport: "EDI", city: "Edimburgo" },
};

export function getTravelInfo(event: DanceEvent) {
  return travelInfo[event.id] ?? { flag: "🌍", airport: "", city: event.location };
}

export function getFlightsUrl(event: DanceEvent, origin = "ALC") {
  const { airport, city } = getTravelInfo(event);
  const q = `Vuelos de ${origin} a ${airport || city}`;
  return `https://www.google.com/travel/flights?q=${encodeURIComponent(q)}&hl=es`;
}
