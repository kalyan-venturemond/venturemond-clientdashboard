import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Check } from "lucide-react";
import { API } from "@/api";
import { ServiceItem } from "@/components/dashboard/services/constants";

export default function Catalog() {
    const [currency, setCurrency] = useState<"INR" | "USD">("USD");
    const [services, setServices] = useState<ServiceItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await API.get('/services');
                setServices(response.data);
            } catch (error) {
                console.error("Failed to load catalog", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchServices();
    }, []);

    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat(currency === "USD" ? "en-US" : "en-IN", {
            style: "currency",
            currency: currency,
            maximumFractionDigits: 0
        }).format(amount);
    };

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading catalog...</div>;
    }

    return (
        <div className="min-h-screen bg-background animate-fade-in">
            <header className="px-6 h-16 flex items-center border-b border-border/40 glass sticky top-0 z-50">
                <Button variant="ghost" size="sm" asChild className="gap-2">
                    <Link to="/">
                        <ArrowLeft className="h-4 w-4" /> Back to Home
                    </Link>
                </Button>
            </header>

            <main className="container mx-auto py-12 px-4 md:px-6">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">Services & Pricing</h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Choose the perfect plan to accelerate your business growth.
                        All plans include access to our client dashboard.
                    </p>

                    <div className="flex justify-center mt-6 gap-2">
                        <Button
                            variant={currency === "INR" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrency("INR")}
                            className="w-24"
                        >
                            INR (₹)
                        </Button>
                        <Button
                            variant={currency === "USD" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrency("USD")}
                            className="w-24"
                        >
                            USD ($)
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
                    {services.filter(s => s.price.period !== 'one-time').map((service) => (
                        <Card key={service.id} className={`flex flex-col ${service.badge ? 'border-primary shadow-glow-sm' : ''}`}>
                            <CardHeader>
                                {service.badge && <Badge className="w-fit mb-2">{service.badge}</Badge>}
                                <CardTitle className="text-2xl">{service.title}</CardTitle>
                                {service.description && <CardDescription>{service.description}</CardDescription>}
                            </CardHeader>
                            <CardContent className="flex-1">
                                <div className="mb-6">
                                    <span className="text-4xl font-bold">
                                        {formatPrice(currency === "USD" ? service.price.usd : service.price.inr)}
                                    </span>
                                    {service.price.period && <span className="text-muted-foreground"> {service.price.period}</span>}
                                </div>
                                <ul className="space-y-3">
                                    {service.features?.slice(0, 5).map((feature, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm">
                                            <Check className="h-4 w-4 text-success shrink-0" />
                                            <span className="line-clamp-2">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" asChild variant={service.badge ? "default" : "outline"}>
                                    <Link to="/auth/signup">Get Started</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                    {services.length === 0 && <div className="col-span-3 text-center text-muted-foreground">No services available.</div>}
                </div>

                <div className="mt-16 text-center">
                    <h2 className="text-2xl font-bold mb-4">Looking for Custom Development?</h2>
                    <p className="text-muted-foreground mb-6">We offer end-to-end studio services for MVP and Enterprise apps.</p>
                    <Button asChild size="lg">
                        <Link to="/auth/signup">Contact Sales</Link>
                    </Button>
                </div>
            </main>
        </div>
    );
}
