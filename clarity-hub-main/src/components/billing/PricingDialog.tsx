import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useCurrency } from "@/context/CurrencyContext";

interface PricingDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function PricingDialog({ open, onOpenChange }: PricingDialogProps) {
    const { currency, formatPrice } = useCurrency();
    const exchangeRate = 83; // Mock

    const getPrice = (usd: number) => {
        const val = currency === "INR" ? usd * exchangeRate : usd;
        return formatPrice(val);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Overage Pricing</DialogTitle>
                    <DialogDescription>
                        Charges applied for usage exceeding your plan limits.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Resource</TableHead>
                                <TableHead>Limit</TableHead>
                                <TableHead className="text-right">Overage Rate</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">Storage</TableCell>
                                <TableCell>100 GB</TableCell>
                                <TableCell className="text-right">{getPrice(0.10)} / GB / month</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Seats</TableCell>
                                <TableCell>25 Seats</TableCell>
                                <TableCell className="text-right">{getPrice(15)} / seat / month</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">API Calls</TableCell>
                                <TableCell>10k / month</TableCell>
                                <TableCell className="text-right">{getPrice(5)} / 1k calls</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <p className="text-xs text-muted-foreground mt-4 text-center">
                        Overage charges are billed in the next invoice cycle.
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
