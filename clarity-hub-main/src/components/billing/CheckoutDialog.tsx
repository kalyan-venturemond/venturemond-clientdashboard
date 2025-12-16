import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, CheckCircle2 } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import { PaymentMethodDialog } from "./PaymentMethodDialog";

interface CheckoutDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    amount: number;
    itemDescription: string;
}

export function CheckoutDialog({ open, onOpenChange, amount, itemDescription }: CheckoutDialogProps) {
    const { toast } = useToast();
    const { formatPrice, currency } = useCurrency();
    const [loading, setLoading] = useState(false);
    const [addMethodOpen, setAddMethodOpen] = useState(false);

    const exchangeRate = 83;
    const displayAmount = currency === "INR" ? amount * exchangeRate : amount;

    const handlePay = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            onOpenChange(false);
            toast({
                title: "Payment Successful",
                description: `Successfully paid ${formatPrice(displayAmount)}. An email receipt has been sent.`,
                className: "bg-success text-white border-none",
            });
        }, 2000);
    };

    if (addMethodOpen) {
        return <PaymentMethodDialog open={true} onOpenChange={setAddMethodOpen} defaultMethod={true} />
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle>Complete Payment</DialogTitle>
                    <DialogDescription>
                        Secure checkout for your subscription.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-6">
                    <div className="bg-secondary/20 p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-medium text-sm">{itemDescription}</p>
                            <p className="text-xs text-muted-foreground">Total Due</p>
                        </div>
                        <p className="text-xl font-bold">{formatPrice(displayAmount)}</p>
                    </div>

                    <div className="space-y-3">
                        <p className="text-sm font-medium">Payment Method</p>
                        <div className="border rounded-lg p-3 flex items-center justify-between cursor-pointer border-primary bg-primary/5">
                            <div className="flex items-center gap-3">
                                <CreditCard className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="font-medium text-sm">Visa ending in 4242</p>
                                    <p className="text-xs text-muted-foreground">Default</p>
                                </div>
                            </div>
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                        </div>
                        <Button variant="ghost" size="sm" className="w-full h-8" onClick={() => setAddMethodOpen(true)}>
                            + Add new payment method
                        </Button>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handlePay} disabled={loading} className="w-full sm:w-auto">
                        {loading ? "Processing..." : `Pay ${formatPrice(displayAmount)}`}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
