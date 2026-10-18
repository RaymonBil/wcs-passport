import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { festivals, getFestival } from "@/lib/festivals";
import { FestivalDetail } from "./FestivalDetail";

export const dynamicParams = false;

export function generateStaticParams() {
  return festivals.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const f = getFestival(slug);
  if (!f) return {};
  return { title: `${f.name} ${f.edition}`, description: f.summary.es };
}

export default async function FestivalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getFestival(slug)) notFound();
  return <FestivalDetail slug={slug} />;
}
