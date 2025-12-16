import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2 } from "lucide-react";

interface UpgradeSubscriptionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    currentPlan: string;
    onUpgrade: (planId: string, seats: number) => Promise<void>;
    currency: "INR" | "USD";
}

const PLANS = [
    {
        id: "pro",
        name: "Workspace Pro",
        priceUSD: 149,
        priceINR: 12499,
        features: ["Up to 25 seats", "100GB Storage", "Priority Support"]
    },
    {
        id: "enterprise",
        name: "Enterprise",
        priceUSD: 499,
        priceINR: 41999,
        features: ["Unlimited seats", "Unlimited Storage", "Dedicated Success Manager", "SLA"]
    }
];

export function UpgradeSubscriptionDialog({
    open,
    onOpenChange,
    currentPlan,
    onUpgrade,
    currency
}: UpgradeSubscriptionDialogProps) {
    const [selectedPlan, setSelectedPlan] = useState(currentPlan === "Workspace Pro" ? "enterprise" : "pro");
    const [seats, setSeats] = useState(10);
    const [loading, setLoading] = useState(false);

    const handleUpgrade = async () => {
        setLoading(true);
        await onUpgrade(selectedPlan, seats);
        setLoading(false);
        onOpenChange(false);
    };

    const selectedPlanDetails = PLANS.find(p => p.id === selectedPlan);
    const basePrice = currency === "USD" ? selectedPlanDetails?.priceUSD : selectedPlanDetails?.priceINR;

    // Format price helper
    const format = (amount: number) => new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
        style: 'currency',
        currency: currency,
        maximumFractionDigits: 0
    }).format(amount);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Upgrade Subscription</DialogTitle>
                    <DialogDescription>
                        Choose a plan that scales with your team.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    <div className="space-y-4">
                        <Label>Select Plan</Label>
                        <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {PLANS.map((plan) => (
                                <div key={plan.id}>
                                    <RadioGroupItem value={plan.id} id={plan.id} className="peer sr-only" />
                                    <Label
                                        htmlFor={plan.id}
                                        className="flex flex-col justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer h-full"
                                    >
                                        <div className="mb-3">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="font-semibold text-lg">{plan.name}</span>
                                                {plan.id === currentPlan.toLowerCase() && <Badge variant="secondary">Current</Badge>}
                                            </div>
                                            <span className="text-2xl font-bold">
                                                {format(currency === "USD" ? plan.priceUSD : plan.priceINR)}
                                            </span>
                                            <span className="text-muted-foreground ml-1">/mo</span>
                                        </div>
                                        <ul className="space-y-2 text-xs text-muted-foreground mt-auto">
                                            {plan.features.map((f, i) => (
                                                <li key={i} className="flex items-center">
                                                    <Check className="mr-2 h-3 w-3 text-primary" /> {f}
                                                </li>
                                            ))}
                                        </ul>
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <Label>Additional Seats</Label>
                            <span className="text-sm font-medium">{seats} seats</span>
                        </div>
                        <Slider
                            value={[seats]}
                            onValueChange={(v) => setSeats(v[0])}
                            min={1}
                            max={100}
                            step={1}
                            className="py-4"
                        />
                        <p className="text-xs text-muted-foreground">
                            Base plan includes standard limits. Adding seats adjusts your monthly billing automatically.
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleUpgrade} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Confirm Upgrade
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
