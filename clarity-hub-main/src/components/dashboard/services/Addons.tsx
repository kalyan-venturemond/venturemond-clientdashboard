import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ADDONS } from "./constants";
import { Plus } from "lucide-react";

export default function Addons({ currency }: { currency: "INR" | "USD" }) {

    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
            style: "currency",
            currency: currency,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Add-ons</h2>
                    <p className="text-muted-foreground">Enhance your workspace with premium features.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {ADDONS.map((addon) => (
                    <Card key={addon.id} className="p-6 flex flex-col justify-between hover:shadow-md transition-shadow border-border/50">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Badge variant="outline" className="text-xs font-normal">Optional</Badge>
                                <Switch />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{addon.title}</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {addon.features.join(", ")}
                                </p>
                            </div>
                        </div>
                        <div className="mt-6 pt-4 border-t flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-lg font-bold text-primary">
                                    {currency === "INR" ? formatPrice(addon.price.inr) : formatPrice(addon.price.usd)}
                                </span>
                                <span className="text-xs text-muted-foreground">{addon.price.period}</span>
                            </div>
                            <Button size="icon" variant="ghost" className="rounded-full">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="flex justify-center mt-12">
                <p className="text-muted-foreground text-sm">Need a custom add-on? <a href="#" className="underline text-primary">Contact us</a></p>
            </div>
        </div>
    );
}
