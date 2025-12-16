import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, PenLine, Save } from "lucide-react";

export interface BillingInfo {
    name: string;
    address: string;
    city: string;
    country: string;
    taxId?: string;
}

interface BillingDetailsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialDetails: BillingInfo;
    onSave: (details: BillingInfo) => Promise<void>;
}

export function BillingDetailsDialog({
    open,
    onOpenChange,
    initialDetails,
    onSave
}: BillingDetailsDialogProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [details, setDetails] = useState<BillingInfo>(initialDetails);
    const [loading, setLoading] = useState(false);

    // Reset state when opening
    useEffect(() => {
        if (open) {
            setDetails(initialDetails);
            setIsEditing(false);
        }
    }, [open, initialDetails]);

    const handleSave = async () => {
        setLoading(true);
        await onSave(details);
        setLoading(false);
        setIsEditing(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex justify-between items-center">
                        Billing Details
                        {!isEditing && (
                            <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>
                                <PenLine className="h-4 w-4 mr-2" /> Edit
                            </Button>
                        )}
                    </DialogTitle>
                    <DialogDescription>
                        Manage your billing address and tax information.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="company">Company Name</Label>
                        <Input
                            id="company"
                            value={details.name}
                            disabled={!isEditing}
                            onChange={(e) => setDetails({ ...details, name: e.target.value })}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                            id="address"
                            value={details.address}
                            disabled={!isEditing}
                            onChange={(e) => setDetails({ ...details, address: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="city">City</Label>
                            <Input
                                id="city"
                                value={details.city}
                                disabled={!isEditing}
                                onChange={(e) => setDetails({ ...details, city: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="country">Country</Label>
                            <Input
                                id="country"
                                value={details.country}
                                disabled={!isEditing}
                                onChange={(e) => setDetails({ ...details, country: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="taxId">Tax ID / VAT</Label>
                        <Input
                            id="taxId"
                            value={details.taxId || ''}
                            disabled={!isEditing}
                            onChange={(e) => setDetails({ ...details, taxId: e.target.value })}
                            placeholder="Optional"
                        />
                    </div>
                </div>

                {isEditing && (
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                        <Button onClick={handleSave} disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            <Save className="mr-2 h-4 w-4" /> Save Changes
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}
