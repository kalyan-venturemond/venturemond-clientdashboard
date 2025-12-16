import { FileText, Zap, Layout, ShieldCheck } from "lucide-react";

const features = [
    {
        icon: FileText,
        title: "Transparent Billing",
        description: "Automated invoices and clear pricing. No hidden fees or surprises.",
        color: "text-blue-500",
        bgColor: "bg-blue-500/10"
    },
    {
        icon: Zap,
        title: "Fast Provisioning",
        description: "Get started immediately with our automated provisioning system.",
        color: "text-teal-500",
        bgColor: "bg-teal-500/10"
    },
    {
        icon: Layout,
        title: "Full Workspace",
        description: "Integrated tasks, files, and approvals in one place.",
        color: "text-indigo-500",
        bgColor: "bg-indigo-500/10"
    },
    {
        icon: ShieldCheck,
        title: "Enterprise Security",
        description: "Bank-grade security with SSO, MFA, and audit logs.",
        color: "text-teal-500",
        bgColor: "bg-teal-500/10"
    }
];

export default function WhyVentureMond() {
    return (
        <section className="py-24 px-6 bg-secondary/20">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">Why VentureMond?</h2>
                    <p className="text-muted-foreground">Built for speed, transparency, and security.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <div key={index} className="p-8 rounded-2xl bg-background border border-border/50 hover:border-primary/50 transition-colors">
                            <div className={`w-12 h-12 rounded-lg ${feature.bgColor} ${feature.color} flex items-center justify-center mb-6`}>
                                <feature.icon className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
