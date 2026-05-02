"use client"
import FeaturesSection from "../components/home/FeaturesSection";
import Hero from "../components/home/Hero";
import HomeBottomSection from "../components/home/HomeBottomSection";

// Mobile Components
import MobileHero from "../components/home/mobile/MobileHero";
import MobileCategoriesSection from "../components/home/mobile/MobileCategoriesSection";
import MobileExamplesSection from "../components/home/mobile/MobileExamplesSection";
import MobileFeatureBands from "../components/home/mobile/MobileFeatureBands";
import MobileHowItWorks from "../components/home/mobile/MobileHowItWorks";
import MobileHelperBand from "../components/home/mobile/MobileHelperBand";
import MobileEarningSteps from "../components/home/mobile/MobileEarningSteps";
import MobileTestimonials from "../components/home/mobile/MobileTestimonials";
import MobileBottomCTA from "../components/home/mobile/MobileBottomCTA";

export default function Page() {
  return (
    <main>
      {/* Desktop View */}
      <div className="hidden md:block">
        <Hero />
        <FeaturesSection />
        <HomeBottomSection />
      </div>

      {/* Mobile View */}
      <div className="block md:hidden bg-[#f9fafb]">
        <MobileHero />
        <MobileCategoriesSection />

        <MobileHowItWorks />
        <MobileFeatureBands />
        <MobileHelperBand />
        {/* <MobileEarningSteps /> */}
        <MobileTestimonials />
        <MobileBottomCTA />
      </div>
    </main>
  );
}
