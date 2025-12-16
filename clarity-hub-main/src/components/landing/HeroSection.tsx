import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
    return (
        <section className="relative px-6 py-24 md:py-32 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 -z-10" />
            <div className="mx-auto max-w-5xl text-center space-y-8 animate-fade-in">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                    Supercharge Your Agency with <br />
                    <span className="text-gradient">VentureMond</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    The all-in-one client dashboard designed to streamline your workflow, manage projects, and delight your clients.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity">
                        <Link to="/auth/signup">
                            Get Started <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                        <Link to="/catalog">View Services</Link>
                    </Button>
                </div>
                <div className="pt-12">
                    <img
                        src="/hero-dashboard.png"
                        alt="Dashboard Preview"
                        className="rounded-xl border shadow-2xl mx-auto w-full max-w-4xl"
                        onError={(e) => {
                            // Fallback if image doesn't exist
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                        }}
                    />
                </div>
            </div>
        </section>
    );
}
