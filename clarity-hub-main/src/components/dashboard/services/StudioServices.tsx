import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Info } from "lucide-react";
import { ServiceItem } from "./constants";
import { useState } from "react";
import { QuoteModal, CompareModal } from "./Modals";

export default function StudioServices({ currency, services = [] }: { currency: "INR" | "USD", services?: ServiceItem[] }) {
    const [selectedService, setSelectedService] = useState<string | null>(null);
    const [showCompare, setShowCompare] = useState(false);

    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
            style: "currency",
            currency: currency,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Studio Services</h2>
                    <p className="text-muted-foreground">Expert services to build, launch, and scale your venture.</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowCompare(true)}>
                    Compare MVP Tiers
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {services.map((service) => (
                    <Card key={service.id} className="flex flex-col relative group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-border/50">
                        {service.badge && (
                            <div className="absolute top-0 right-0">
                                <Badge className="rounded-tl-none rounded-br-none rounded-tr-xl bg-primary text-primary-foreground px-3 py-1">
                                    {service.badge}
                                </Badge>
                            </div>
                        )}
                        <CardHeader>
                            <CardTitle className="flex flex-col gap-1">
                                <span className="text-xl font-bold">{service.title}</span>
                                <span className="text-2xl font-bold text-primary">
                                    {currency === "INR" ? formatPrice(service.price.inr) : formatPrice(service.price.usd)}
                                    <span className="text-sm font-normal text-muted-foreground ml-1">{service.price.period}</span>
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <ul className="space-y-3">
                                {service.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                        <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-3 pt-6 border-t bg-secondary/10">
                            <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
                                <span className="flex items-center gap-1"><Info className="h-3 w-3" /> SLA: 48h Response</span>
                            </div>
                            <Button className="w-full" onClick={() => setSelectedService(service.title)}>
                                Request Quote
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <QuoteModal
                isOpen={!!selectedService}
                onClose={() => setSelectedService(null)}
                serviceName={selectedService || ""}
            />

            <CompareModal
                isOpen={showCompare}
                onClose={() => setShowCompare(false)}
                currency={currency}
                services={services}
            />
        </div>
    );
}
