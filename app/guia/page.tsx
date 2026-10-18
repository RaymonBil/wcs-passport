import type { Metadata } from "next";
import { Guide } from "./Guide";

export const metadata: Metadata = {
  title: "Guía del competidor principiante",
  description: "Qué es la WSDC, cómo funcionan los puntos y las divisiones, cómo preparar tu primer Jack & Jill, glosario y consejos para viajar barato.",
};

export default function GuidePage() {
  return <Guide />;
}
