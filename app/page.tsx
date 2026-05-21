import { HeroBannerSection } from "@/components/sections/HeroBannerSection";
import { CoursesOverviewSection } from "@/components/sections/CoursesOverviewSection";
import { LearningProcessSection } from "@/components/sections/LearningProcessSection";
import { FooterBrandSection } from "@/components/sections/FooterBrandSection";
import { FooterLinksSection } from "@/components/sections/FooterLinksSection";

export default function Home() {
  return (
    <main className="relative w-full bg-[#e9e8e8]">
      <HeroBannerSection />
      <CoursesOverviewSection />
      <LearningProcessSection />
      <FooterBrandSection />
      <FooterLinksSection />
    </main>
  );
}
