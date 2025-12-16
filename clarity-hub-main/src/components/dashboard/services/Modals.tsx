import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Check, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Pricing, TAX_RATE, ServiceItem } from "./constants";
import { cartService } from "@/lib/cart";
import { useToast } from "@/hooks/use-toast";

// Helper to format currency
const formatPrice = (amount: number, currency: "INR" | "USD") => {
    if (amount === 0) return "Custom";
    return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
        style: "currency",
        currency: currency,
        maximumFractionDigits: 0,
    }).format(amount);
};

// --- Configurator Modal ---
export function ConfiguratorModal({
    isOpen,
    onClose,
    currency,
    plan,
}: {
    isOpen: boolean;
    onClose: () => void;
    currency: "INR" | "USD";
    plan: ServiceItem;
}) {
    const [seats, setSeats] = useState(5);
    const [tickets, setTickets] = useState(false);
    const [sso, setSso] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    // Use passed plan
    const selectedPlan = plan;

    // Base cost from plan
    const baseRate = currency === "INR" ? selectedPlan.price.inr : selectedPlan.price.usd;
    const planSubtotal = seats * baseRate;

    // ... (rest of ConfiguratorModal body is fine as it uses selectedPlan)

    // I need to be careful not to delete the body. I will assume the tool keeps the rest if I match correctly.
    // But I'm effectively rewriting the top of the function.

    const planSubtotal_dummy = 0; // Just to minimize diff context issues? No, replace implementation top.

    const prioritySupportPrice = currency === "INR" ? 8000 : 99;
    const ssoPrice = currency === "INR" ? 25000 : 299;

    const addonsTotal =
        (tickets ? prioritySupportPrice : 0) +
        (sso ? ssoPrice : 0);

    const subtotal = planSubtotal + addonsTotal;
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;

    const handleAddToCart = () => {
        cartService.addToCart({
            id: selectedPlan.id,
            title: `${selectedPlan.title} Plan (${seats} seats)`,
            price: total,
            currency,
            quantity: 1,
            period: "/mo"
        });
        toast({
            title: "Added to Cart Setup",
            description: `${selectedPlan.title} plan configured. Total: ${formatPrice(total, currency)}`
        });
        onClose();
        navigate("/checkout");
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Configure {selectedPlan.title} Workspace</DialogTitle>
                    <DialogDescription>
                        Adjust seats and add-ons. Pricing in {currency}.
                    </DialogDescription>
                </DialogHeader>
                {/* Body unchanged */}
                <div className="grid gap-6 py-4">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-base">Number of Users</Label>
                            <span className="text-lg font-bold">{seats} Seats</span>
                        </div>
                        <Slider
                            value={[seats]}
                            onValueChange={(vals) => setSeats(vals[0])}
                            min={1}
                            max={100}
                            step={1}
                            className="py-4"
                        />
                        <p className="text-xs text-muted-foreground text-right">
                            x {formatPrice(baseRate, currency)} / user
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-semibold text-sm text-foreground">Recommended Add-ons</h4>
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label className="text-base">Priority Support</Label>
                                <p className="text-sm text-muted-foreground">{formatPrice(prioritySupportPrice, currency)} / month</p>
                            </div>
                            <Switch checked={tickets} onCheckedChange={setTickets} />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label className="text-base">SSO Setup</Label>
                                <p className="text-sm text-muted-foreground">{formatPrice(ssoPrice, currency)} one-time</p>
                            </div>
                            <Switch checked={sso} onCheckedChange={setSso} />
                        </div>
                    </div>

                    <div className="space-y-2 border-t pt-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>{formatPrice(subtotal, currency)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Tax ({(TAX_RATE * 100).toFixed(0)}%)</span>
                            <span>{formatPrice(tax, currency)}</span>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                            <span className="text-lg font-bold">Total</span>
                            <span className="text-2xl font-bold text-primary">{formatPrice(total, currency)}</span>
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleAddToCart}>To Checkout</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// --- Request Quote Modal ---
export function QuoteModal({
    isOpen,
    onClose,
    serviceName,
}: {
    isOpen: boolean;
    onClose: () => void;
    serviceName: string;
}) {
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock API call
        setTimeout(() => {
            toast({
                title: "Quote Requested",
                description: `Request for ${serviceName} sent successfully.`,
            });
            onClose();
        }, 500);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Request a Quote</DialogTitle>
                    <DialogDescription>
                        Tell us about your requirements for <strong>{serviceName}</strong>.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="company">Company Name</Label>
                        <Input id="company" defaultValue="Acme Corp" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" placeholder="you@company.com" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="budget">Budget Range</Label>
                        <Input id="budget" placeholder="e.g. $10k - $20k" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="requirements">Requirements</Label>
                        <Textarea id="requirements" placeholder="Describe your project goals..." required />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit">Submit Request</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

// --- Compare Modal ---
export function CompareModal({
    isOpen,
    onClose,
    currency,
    services,
}: {
    isOpen: boolean;
    onClose: () => void;
    currency: "INR" | "USD";
    services: ServiceItem[];
}) {
    const tiers = services;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Compare MVP Plans</DialogTitle>
                    <DialogDescription>
                        Detailed feature breakdown for our development tiers.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[180px]">Feature</TableHead>
                                {tiers.map(t => (
                                    <TableHead key={t.id} className="text-center min-w-[140px]">
                                        <div className="font-bold text-base">{t.title}</div>
                                        <div className="text-sm font-normal text-muted-foreground mt-1">
                                            {formatPrice(currency === "INR" ? t.price.inr : t.price.usd, currency)}
                                        </div>
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {[
                                "Product Strategy", "UI/UX Design", "Full Stack Dev",
                                "Cloud Deployment", "Support SLA", "Deliverables", "Scalable Arch", "Microservices"
                            ].map((feature, i) => (
                                <TableRow key={i}>
                                    <TableCell className="font-medium">{feature}</TableCell>
                                    {tiers.map(t => {
                                        // Simplified Mock Logic for filling table
                                        // In production, map this from t.features or t.sla/deliverables
                                        let content: React.ReactNode = <MinusIcon />;

                                        if (feature === "Support SLA") {
                                            content = <span className="text-xs">{t.sla || "N/A"}</span>;
                                        } else if (feature === "Deliverables") {
                                            content = <span className="text-xs truncate max-w-[150px]" title={t.deliverables?.join(", ")}>{t.deliverables?.length ?? 0} items</span>
                                        } else {
                                            const hasFeature =
                                                (t.id.includes("tier-1") && i < 4) ||
                                                (t.id.includes("tier-2") && i < 6) ||
                                                (t.id.includes("tier-3"));
                                            content = hasFeature ? <Check className="h-5 w-5 text-primary mx-auto" /> : <MinusIcon />;
                                        }

                                        return (
                                            <TableCell key={t.id} className="text-center">
                                                {content}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function MinusIcon() {
    return <span className="text-muted-foreground/30">-</span>
}
