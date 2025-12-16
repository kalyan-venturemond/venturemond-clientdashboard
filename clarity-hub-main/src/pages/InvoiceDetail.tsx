import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Download,
    CreditCard,
    Building2,
    Calendar,
    CheckCircle2,
    Clock,
    AlertCircle,
    FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useCurrency } from "@/context/CurrencyContext";

// Mock data (matches Billing.tsx mock)
const INVOICES = [
    {
        id: "INV-2024-001",
        date: "Jan 15, 2024",
        amount: 248,
        status: "paid",
        items: [
            { description: "Pro Plan Subscription (Monthly)", quantity: 1, unitPrice: 199, total: 199 },
            { description: "Additional Seats (x2)", quantity: 2, unitPrice: 24.5, total: 49 },
        ],
        tax: 0, // Calculated dynamically
        billingAddress: "Acme Corp, 123 Business Rd, Tech City",
        paymentMethod: "Visa ending in 4242",
        transactionId: "tx_123456789",
    },
    {
        id: "INV-2024-002", // Recent pending one
        date: "Feb 15, 2024", // Future date for next invoice in mock, lets assume this is due now
        amount: 248,
        status: "pending",
        items: [
            { description: "Pro Plan Subscription (Monthly)", quantity: 1, unitPrice: 199, total: 199 },
            { description: "Additional Seats (x2)", quantity: 2, unitPrice: 24.5, total: 49 },
        ],
        tax: 0,
        billingAddress: "Acme Corp, 123 Business Rd, Tech City",
    }
];

export default function InvoiceDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { currency, formatPrice } = useCurrency();

    // Find invoice or default to first if not found (for dev/demo)
    const invoice = INVOICES.find((inv) => inv.id === id) || INVOICES[0];

    const handleDownload = () => {
        toast({
            title: "Downloading Invoice",
            description: `Invoice ${invoice.id} download started.`,
        });
        // Simulate download
    };

    const handlePayNow = () => {
        // In real app, this might open the checkout modal or redirect
        toast({
            title: "Proceeding to Payment",
            description: "Redirecting to secure payment gateway...",
        });
        // For now just show toast, integration would be via common Modal logic
    };

    const exchangeRate = 83; // 1 USD = 83 INR (Mock)
    const convert = (amount: number) => currency === "INR" ? amount * exchangeRate : amount;

    // Calculate totals
    const subtotal = invoice.items.reduce((acc, item) => acc + item.total, 0);
    const taxRate = 0.18; // 18% GST mock
    const taxAmount = subtotal * taxRate;
    const total = subtotal + taxAmount;

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate("/billing")}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Invoice {id}</h1>
                    <p className="text-muted-foreground">View invoice details and line items</p>
                </div>
                <div className="ml-auto flex gap-2">
                    {invoice.status === 'pending' && (
                        <Button onClick={handlePayNow}>Pay Now</Button>
                    )}
                    <Button variant="outline" onClick={handleDownload}>
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                    {/* Invoice Details Card */}
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-lg">Invoice Details</CardTitle>
                                    <p className="text-sm text-muted-foreground mt-1">Issued on {invoice.date}</p>
                                </div>
                                <Badge variant={invoice.status === 'paid' ? 'success' : invoice.status === 'pending' ? 'warning' : 'secondary'} className="capitalize">
                                    {invoice.status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid sm:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Billed To</h3>
                                    <div className="flex items-start gap-2">
                                        <Building2 className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                        <p className="text-sm">{invoice.billingAddress}</p>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Payment Details</h3>
                                    {invoice.status === 'paid' ? (
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm">
                                                <CreditCard className="h-4 w-4 text-muted-foreground" />
                                                <span>{invoice.paymentMethod}</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground">Transaction ID: {invoice.transactionId}</p>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-warning flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            Payment Pending
                                        </p>
                                    )}
                                </div>
                            </div>

                            <Separator className="my-6" />

                            <h3 className="text-sm font-medium mb-4">Line Items</h3>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Description</TableHead>
                                        <TableHead className="text-right">Qty</TableHead>
                                        <TableHead className="text-right">Unit Price</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {invoice.items.map((item, i) => (
                                        <TableRow key={i}>
                                            <TableCell>{item.description}</TableCell>
                                            <TableCell className="text-right">{item.quantity}</TableCell>
                                            <TableCell className="text-right">{formatPrice(convert(item.unitPrice))}</TableCell>
                                            <TableCell className="text-right font-medium">{formatPrice(convert(item.total))}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            <div className="mt-6 flex flex-col items-end space-y-2">
                                <div className="flex justify-between w-full max-w-xs text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>{formatPrice(convert(subtotal))}</span>
                                </div>
                                <div className="flex justify-between w-full max-w-xs text-sm">
                                    <span className="text-muted-foreground">Tax (18% GST)</span>
                                    <span>{formatPrice(convert(taxAmount))}</span>
                                </div>
                                <Separator className="my-2 max-w-xs" />
                                <div className="flex justify-between w-full max-w-xs font-bold text-lg">
                                    <span>Total</span>
                                    <span>{formatPrice(convert(total))}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Need Help?</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p className="text-sm text-muted-foreground">
                                Have a question about this invoice?
                            </p>
                            <Button variant="outline" className="w-full justify-start" onClick={() => window.location.href = "mailto:billing@venturemond.com"}>
                                <Mail className="h-4 w-4 mr-2" />
                                Contact Billing Support
                            </Button>
                            {invoice.status === 'paid' && (
                                <Button variant="outline" className="w-full justify-start text-muted-foreground">
                                    <AlertCircle className="h-4 w-4 mr-2" />
                                    Request Refund
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

// Helper icon
function Mail({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
    )
}
