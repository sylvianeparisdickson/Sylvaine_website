// Interactive editor trial comment
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import NorthrupStrip from "@/components/NorthrupStrip";
import StatementSection from "@/components/StatementSection";
import CollectionsSection from "@/components/CollectionsSection";
import SelectedWorks from "@/components/SelectedWorks";
import CommissionTeaser from "@/components/CommissionTeaser";
import CollectorQuote from "@/components/CollectorQuote";
import Footer from "@/components/Footer";
import RevealObserver from "@/components/RevealObserver";

export default function Home() {
  return (
    <main>
      <RevealObserver />
      <Nav />
      <Hero />
      <NorthrupStrip />
      <CollectionsSection />
      <StatementSection />
      <SelectedWorks />
      <CommissionTeaser />
      <CollectorQuote />
      <Footer />
    </main>
  );
}
