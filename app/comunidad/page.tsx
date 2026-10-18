import type { Metadata } from "next";
import { Community } from "./Community";

export const metadata: Metadata = {
  title: "Comunidad",
  description: "Levante West Coast Swing y la Asociación Cultural LOBAILAO: clases en Cartagena, Murcia, Alicante y Torrevieja.",
};

export default function CommunityPage() {
  return <Community />;
}
