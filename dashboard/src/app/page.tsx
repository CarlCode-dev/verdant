import Hero from "@/components/Hero";
import StatusCards from "@/components/StatusCards";
import TechStrip from "@/components/TechStrip";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col justify-center">
      <Hero />
      <StatusCards />
      <TechStrip />
    </main>
  );
}