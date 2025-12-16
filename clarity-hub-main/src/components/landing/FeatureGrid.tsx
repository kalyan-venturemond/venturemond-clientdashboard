import { CheckCircle2, Zap, Shield, BarChart3, Users, Globe } from "lucide-react";

export default function FeatureGrid() {
    const features = [
        {
            icon: Zap,
            title: "Lightning Fast",
            description: "Optimized for speed and performance, ensuring a smooth experience for you and your clients."
        },
        {
            icon: Shield,
            title: "Secure by Default",
            description: "Enterprise-grade security to keep your data and your clients' data safe."
        },
        {
            icon: BarChart3,
            title: "Real-time Analytics",
            description: "Track project progress, revenue, and client engagement in real-time."
        },
        {
            icon: Users,
            title: "Team Collaboration",
            description: "Invite your team and collaborate seamlessly on projects and tasks."
        },
        {
            icon: Globe,
            title: "Global Payments",
            description: "Accept payments from clients anywhere in the world with ease."
        },
        {
            icon: CheckCircle2,
            title: "Task Management",
            description: "Keep track of every deliverable and deadline with our intuitive task manager."
        }
    ];

    return (
        <section className="px-6 py-24 bg-card/50">
            <div className="mx-auto max-w-6xl">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold mb-4">Everything you need to scale</h2>
                    <p className="text-muted-foreground text-lg">
                        Powerful features built to help you manage your agency operations efficiently.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="p-6 rounded-xl border bg-card hover:shadow-lg transition-shadow">
                            <feature.icon className="h-10 w-10 text-primary mb-4" />
                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
