import type { Metadata } from "next";
import { Agenda } from "./Agenda";

export const metadata: Metadata = {
  title: "Agenda 2026–2027",
  description: "Todos los festivales de West Coast Swing de España y Europa, mes a mes, con suscripción al calendario.",
};

export default function AgendaPage() {
  return <Agenda />;
}
