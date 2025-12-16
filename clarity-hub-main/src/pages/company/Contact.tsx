import { LandingHeader } from "@/components/landing/LandingHeader";
import { FooterLinks } from "@/components/landing/FooterLinks";

export default function Contact() {
    return (
        <div className="min-h-screen flex flex-col">
            <LandingHeader />
            <main className="flex-1 container mx-auto py-24 px-6">
                <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
                <p className="text-xl text-muted-foreground">Get in touch with our team.</p>
                <div className="mt-8 h-64 bg-secondary/20 rounded-xl flex items-center justify-center">
                    <span className="text-muted-foreground">Contact Form Placeholder</span>
                </div>
            </main>
            <FooterLinks />
        </div>
    );
}
