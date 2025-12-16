import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, HelpCircle } from "lucide-react";
import { ServiceItem } from "./constants";
import { useState } from "react";
import { ConfiguratorModal } from "./Modals";

export default function WorkspacePlans({ currency, plans = [] }: { currency: "INR" | "USD", plans?: ServiceItem[] }) {
    const [showConfig, setShowConfig] = useState(false);

    const formatPrice = (amount: number) => {
        if (amount === 0) return "Custom";
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
                    <h2 className="text-2xl font-bold tracking-tight">Workspace Plans</h2>
                    <p className="text-muted-foreground">Scalable SaaS solutions for your team.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                    <Card key={plan.id} className={`flex flex-col relative transition-all duration-300 ${plan.id === 'pro' ? 'border-primary shadow-md scale-105 z-10' : 'border-border/50 hover:shadow-lg'}`}>
                        {plan.badge && (
                            <div className="absolute top-0 transform -translate-y-1/2 left-1/2 -translate-x-1/2">
                                <Badge className={`rounded-full px-4 py-1 text-xs ${plan.id === 'pro' ? 'bg-primary' : 'bg-secondary text-secondary-foreground'}`}>
                                    {plan.badge}
                                </Badge>
                            </div>
                        )}
                        <CardHeader className={plan.id === 'pro' ? 'pt-8' : ''}>
                            <CardTitle className="flex flex-col gap-1 items-center text-center">
                                <span className="text-xl font-bold">{plan.title}</span>
                                <span className="text-3xl font-bold text-foreground">
                                    {currency === "INR" ? formatPrice(plan.price.inr) : formatPrice(plan.price.usd)}
                                    {plan.price.inr > 0 && <span className="text-sm font-normal text-muted-foreground ml-1">{plan.price.period}</span>}
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <ul className="space-y-3 px-4">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                        <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-3 pb-6 px-6">
                            <Button
                                className="w-full"
                                variant={plan.id === 'pro' ? 'default' : 'outline'}
                                onClick={() => setShowConfig(true)}
                            >
                                {plan.id === 'enterprise' ? 'Contact Sales' : 'Buy Now'}
                            </Button>
                            <div className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1 cursor-help hover:text-foreground">
                                <HelpCircle className="h-3 w-3" />
                                <span>Compare Features</span>
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <ConfiguratorModal
                isOpen={showConfig}
                onClose={() => setShowConfig(false)}
                currency={currency}
            />
        </div>
    );
}
