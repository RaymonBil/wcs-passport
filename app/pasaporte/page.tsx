import type { Metadata } from "next";
import { Passport } from "./Passport";

export const metadata: Metadata = {
  title: "Mi Pasaporte",
  description: "Tus festivales favoritos, sellos de los festivales a los que has ido, checklist del viajero y presupuesto de temporada.",
};

export default function PassportPage() {
  return <Passport />;
}
