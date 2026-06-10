import { HeroSection } from "./_components/hero-section";
import { FeaturesSection } from "./_components/features-section";
import { DemoSection } from "./_components/demo-section";
import { CtaSection } from "./_components/cta-section";

export default function HomePage() {
    return (
        <>
            <HeroSection />
            <FeaturesSection />
            <DemoSection />
            <CtaSection />
        </>
    );
}
