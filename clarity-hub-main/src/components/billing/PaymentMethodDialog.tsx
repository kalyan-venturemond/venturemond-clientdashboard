import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentMethodDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    defaultMethod?: boolean;
}

export function PaymentMethodDialog({ open, onOpenChange, defaultMethod = false }: PaymentMethodDialogProps) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            onOpenChange(false);
            toast({
                title: "Payment Method Saved",
                description: "Your new payment method has been added successfully.",
                className: "bg-success text-white border-none",
            });
        }, 1500);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Payment Method</DialogTitle>
                    <DialogDescription>
                        Add a new credit or debit card for secure billing.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label>Card Number</Label>
                        <Input placeholder="1234 5678 9012 3456" className="mt-1" required />
                        <div className="flex gap-2 mt-2">
                            {/* Mock Card Brand Icons */}
                            <div className="w-8 h-5 bg-muted rounded border border-border" />
                            <div className="w-8 h-5 bg-muted rounded border border-border" />
                            <div className="w-8 h-5 bg-muted rounded border border-border" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Expiry</Label>
                            <Input placeholder="MM/YY" className="mt-1" required />
                        </div>
                        <div>
                            <Label>CVV / CVC</Label>
                            <Input placeholder="123" className="mt-1" required />
                        </div>
                    </div>
                    <div>
                        <Label>Cardholder Name</Label>
                        <Input placeholder="John Doe" className="mt-1" required />
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                        <input type="checkbox" id="default" className="rounded border-gray-300" defaultChecked={defaultMethod} />
                        <Label htmlFor="default" className="cursor-pointer">Set as default payment method</Label>
                    </div>

                    <div className="bg-secondary/10 p-3 rounded-md text-xs text-muted-foreground flex gap-2">
                        <Check className="h-4 w-4 text-success" />
                        Your payment information is encrypted and secure.
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Adding..." : "Add Card"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
