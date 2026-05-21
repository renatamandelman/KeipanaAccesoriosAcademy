import { Card, CardContent } from "@/components/ui/card";
import { CoursesOverviewSection } from "./sections/CoursesOverviewSection";
import { FooterBrandSection } from "./sections/FooterBrandSection";
import { FooterLinksSection } from "./sections/FooterLinksSection";
import { HeroBannerSection } from "./sections/HeroBannerSection";
import { LearningProcessSection } from "./sections/LearningProcessSection";

const sections = [
  { id: "hero-banner-section", component: HeroBannerSection },
  { id: "courses-overview-section", component: CoursesOverviewSection },
  { id: "learning-process-section", component: LearningProcessSection },
  { id: "footer-brand-section", component: FooterBrandSection },
  { id: "footer-links-section", component: FooterLinksSection },
];

export const Body = (): JSX.Element => {
  return (
    <main className="relative w-full bg-[#e9e8e8]">
      <Card className="w-full rounded-none border-0 bg-transparent shadow-none">
        <CardContent className="w-full p-0">
          {sections.map(({ id, component: Section }) => (
            <section key={id} id={id} className="relative w-full">
              <Section />
            </section>
          ))}
        </CardContent>
      </Card>
    </main>
  );
};
