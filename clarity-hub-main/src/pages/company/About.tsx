import { LandingHeader } from "@/components/landing/LandingHeader";
import { FooterLinks } from "@/components/landing/FooterLinks";

export default function About() {
    return (
        <div className="min-h-screen flex flex-col">
            <LandingHeader />
            <main className="flex-1 container mx-auto py-24 px-6">
                <h1 className="text-4xl font-bold mb-6">About Us</h1>
                <p className="text-xl text-muted-foreground">Learn more about VentureMond and our mission.</p>
                <div className="mt-8 h-64 bg-secondary/20 rounded-xl flex items-center justify-center">
                    <span className="text-muted-foreground">About Content Placeholder</span>
                </div>
            </main>
            <FooterLinks />
        </div>
    );
}
