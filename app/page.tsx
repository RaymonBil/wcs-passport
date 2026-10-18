import { BottomNav } from "@/components/BottomNav";
import { FestivalCatalog } from "@/components/sections/FestivalCatalog";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { SocialHub } from "@/components/sections/SocialHub";
import { TravelerChecklist } from "@/components/sections/TravelerChecklist";

export default function Home() {
  return (
    <>
      <Hero />
      <main className="relative pb-24">
        <Manifesto />
        <SocialHub />
        <FestivalCatalog />
        <TravelerChecklist />
      </main>
      <Footer />
      <BottomNav />
    </>
  );
}
