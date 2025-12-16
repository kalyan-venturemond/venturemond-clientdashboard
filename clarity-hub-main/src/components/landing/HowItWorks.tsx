import { ShoppingCart, UserPlus, LayoutDashboard } from "lucide-react";

const steps = [
    {
        icon: ShoppingCart,
        title: "Choose a Service",
        description: "Browse our catalog and select the plan that fits your needs.",
        step: "1"
    },
    {
        icon: UserPlus,
        title: "Complete Onboarding",
        description: "Fill out a few questions to help us start your process.",
        step: "2"
    },
    {
        icon: LayoutDashboard,
        title: "Access Dashboard",
        description: "Track progress, manage files, and communicate in real-time.",
        step: "3"
    }
];

export default function HowItWorks() {
    return (
        <section className="py-24 px-6 bg-background">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-3xl font-bold mb-4">How It Works</h2>
                    <p className="text-muted-foreground">Start your journey with VentureMond in three simple steps.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-12 relative">
                    {/* Connector Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-border/50 -z-10" />

                    {steps.map((item, index) => (
                        <div key={index} className="flex flex-col items-center text-center group">
                            <div className="relative mb-8">
                                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm absolute -top-4 -right-4 shadow-lg z-10">
                                    {item.step}
                                </div>
                                <div className="w-24 h-24 rounded-2xl bg-secondary/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <item.icon className="h-10 w-10 text-primary" />
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                            <p className="text-muted-foreground max-w-xs">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
