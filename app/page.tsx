import Navbar from "@/components/Navbar";
import Hero13 from "@/components/originkit/hero-13";
import EventsList from "@/components/EventsList";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#161618] text-white">
      <div className="relative -mb-16 z-50 pointer-events-none">
        <Navbar />
      </div>
      <Hero13 />
      <EventsList />
      <Footer />
    </main>
  );
}
