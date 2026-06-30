import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { Workflow } from "@/components/sections/Workflow";
import { Benefits } from "@/components/sections/Benefits";
import { Features } from "@/components/sections/Features";
import { TechnicalDetail } from "@/components/sections/TechnicalDetail";
import { Pricing } from "@/components/sections/Pricing";
import { Community } from "@/components/sections/Community";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Footer } from "@/components/sections/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Workflow />
        <Benefits />
        <Features />
        <TechnicalDetail />
        <Pricing />
        <Community />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
