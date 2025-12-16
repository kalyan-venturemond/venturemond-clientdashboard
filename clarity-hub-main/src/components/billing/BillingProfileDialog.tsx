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
import { useToast } from "@/hooks/use-toast";

interface BillingProfileDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function BillingProfileDialog({ open, onOpenChange }: BillingProfileDialogProps) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            onOpenChange(false);
            toast({
                title: "Profile Updated",
                description: "Your billing profile has been successfully updated.",
                className: "bg-success text-white border-none",
            });
        }, 1000);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Billing Profile</DialogTitle>
                    <DialogDescription>
                        Update your company billing details for invoices.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input id="companyName" defaultValue="Acme Corp" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="gst">GST / VAT Number</Label>
                            <Input id="gst" placeholder="Optional" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Billing Phone</Label>
                            <Input id="phone" type="tel" defaultValue="+1 555 123 4567" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Billing Email</Label>
                        <Input id="email" type="email" defaultValue="billing@acme.com" required />
                        <p className="text-[10px] text-muted-foreground">Invoices will be sent to this address.</p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address">Billing Address</Label>
                        <Input id="address" defaultValue="123 Business Rd, Tech City" required />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Profile"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
