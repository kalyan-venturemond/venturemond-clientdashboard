import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function SupportCTA() {
    return (
        <section className="py-24 px-6 bg-primary text-primary-foreground">
            <div className="max-w-4xl mx-auto text-center space-y-8">
                <h2 className="text-3xl md:text-4xl font-bold">
                    Get 24/7 ticket support with guaranteed SLAs
                </h2>
                <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
                    Track issues, escalate tickets, and view response times directly within your client dashboard.
                </p>
                <Button asChild size="lg" variant="secondary" className="font-semibold">
                    <Link to="/contact">Get Started Now</Link>
                </Button>
            </div>
        </section>
    );
}
