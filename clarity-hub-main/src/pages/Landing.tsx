import { LandingHeader } from "@/components/landing/LandingHeader";
import HeroSection from "@/components/landing/HeroSection";
import FeatureGrid from "@/components/landing/FeatureGrid";
import PopularServices from "@/components/landing/PopularServices";
import HowItWorks from "@/components/landing/HowItWorks";
import WhyVentureMond from "@/components/landing/WhyVentureMond";
import SupportCTA from "@/components/landing/SupportCTA";
import { FooterLinks } from "@/components/landing/FooterLinks";

export default function Landing() {
    return (
        <div className="min-h-screen bg-background font-sans antialiased text-foreground">
            <LandingHeader />
            <main>
                <HeroSection />
                <PopularServices />
                <HowItWorks />
                <WhyVentureMond />
                <FeatureGrid />
                <SupportCTA />
            </main>
            <FooterLinks />
        </div>
    );
}
