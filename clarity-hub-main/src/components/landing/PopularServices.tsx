import { ArrowRight, Database, LayoutTemplate, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const services = [
    {
        icon: LayoutTemplate,
        title: "MVP Development",
        description: "Launch your product in weeks, not months. Full-stack development.",
        price: "$4,999",
        period: "/month",
        features: ["Tech Stack Consultation", "Mobile First Design", "Database Setup", "Deployment"],
        popular: false,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10"
    },
    {
        icon: Rocket,
        title: "Growth & GTM",
        description: "Strategic marketing and go-to-market execution for startups.",
        price: "$2,499",
        period: "/month",
        features: ["Market Analysis", "Campaign Strategy", "Content Plan", "Analytics Setup"],
        popular: false, // Middle card in image looked distinct but maybe not "popular" badge style
        color: "text-teal-500",
        bgColor: "bg-teal-500/10"
    },
    {
        icon: Database,
        title: "Workspace SaaS Pro",
        description: "Complete project management and collaboration suite.",
        price: "$49",
        period: "/seat",
        features: ["Unlimited Projects", "Team Collaboration", "File Sharing", "Priority Support"],
        popular: false,
        color: "text-indigo-500",
        bgColor: "bg-indigo-500/10"
    }
];

export default function PopularServices() {
    return (
        <section className="py-24 px-6 bg-secondary/20">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">Popular Services</h2>
                    <p className="text-muted-foreground">Choose from our range of professional services and SaaS solutions.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <Card key={index} className="relative border-none shadow-lg hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <div className={`w-12 h-12 rounded-lg ${service.bgColor} ${service.color} flex items-center justify-center mb-4`}>
                                    <service.icon className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                                <p className="text-sm text-muted-foreground">{service.description}</p>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-6">
                                    <span className="text-3xl font-bold">{service.price}</span>
                                    <span className="text-muted-foreground text-sm">{service.period}</span>
                                </div>
                                <ul className="space-y-3">
                                    {service.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" asChild variant="outline">
                                    <Link to="/catalog">
                                        View Details <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Button variant="outline" size="lg" asChild className="rounded-full px-8">
                        <Link to="/catalog">View All Services</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
