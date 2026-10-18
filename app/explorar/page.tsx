import type { Metadata } from "next";
import { Explorer } from "./Explorer";

export const metadata: Metadata = {
  title: "Explorar festivales",
  description: "Busca y filtra los festivales de West Coast Swing de España y Europa por fecha, país, nivel y precio.",
};

export default function ExplorePage() {
  return <Explorer />;
}
