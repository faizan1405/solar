import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/solar/Nav";
import { Hero } from "@/components/solar/Hero";
import { Calculator } from "@/components/solar/Calculator";
import { Comparison, EnergyFlow, FAQ, FinalCTA, Projects, Solutions, Stats, Timeline, WhatsAppFab, WhySolar, WhyUs } from "@/components/solar/Sections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Suryavan Solar — Rooftop Solar for Homes & Businesses in India" },
      { name: "description", content: "Generate your own clean energy and cut electricity bills. Calculate your solar savings and get a free consultation." },
      { property: "og:title", content: "Suryavan Solar — Power Your Future With Solar" },
      { property: "og:description", content: "Calculate your solar savings and get a free rooftop solar consultation in India." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main>
      <Nav />
      <Hero />
      <Calculator />
      <WhySolar />
      <EnergyFlow />
      <Comparison />
      <Solutions />
      <Stats />
      <Projects />
      <WhyUs />
      <Timeline />
      <FAQ />
      <FinalCTA />
      <WhatsAppFab />
    </main>
  );
}
