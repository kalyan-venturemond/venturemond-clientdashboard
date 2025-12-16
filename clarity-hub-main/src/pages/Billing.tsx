import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CreditCard,
  Download,
  Plus,
  Building2,
  AlertCircle,
  Eye,
  MoreHorizontal,
  FileText,
  Trash2,
  ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/context/CurrencyContext";
import { useToast } from "@/hooks/use-toast";

import { BillingProfileDialog } from "@/components/billing/BillingProfileDialog";
import { PaymentMethodDialog } from "@/components/billing/PaymentMethodDialog";
import { PricingDialog } from "@/components/billing/PricingDialog";
import { RefundRequestDialog } from "@/components/billing/RefundRequestDialog";
import { CheckoutDialog } from "@/components/billing/CheckoutDialog";

import { ordersService, Order } from "@/lib/orders";

// INVOICES removed - we will fetch from ordersService

const USAGE = {
  storage: { used: 45, total: 100, unit: "GB" },
  seats: { used: 12, total: 25, unit: "seats" },
  apiCalls: { used: 8500, total: 10000, unit: "calls" },
};

const PAYMENT_METHODS = [
  {
    id: 1,
    type: "card",
    last4: "4242",
    brand: "Visa",
    expiry: "12/25",
    default: true,
  },
  {
    id: 2,
    type: "card",
    last4: "1234",
    brand: "Mastercard",
    expiry: "08/24",
    default: false,
  },
];

export default function Billing() {
  const { currency, setCurrency, formatPrice } = useCurrency();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Dialog States
  const [profileOpen, setProfileOpen] = useState(false);
  const [paymentMethodOpen, setPaymentMethodOpen] = useState(false);
  const [pricingOpen, setPricingOpen] = useState(false);
  const [refundOpen, setRefundOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);

  // Filter State
  const [filter, setFilter] = useState("all");
  const [invoices, setInvoices] = useState<any[]>([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const orders = await ordersService.getOrders();
        // Map orders to invoice format expected by UI
        const mappedInvoices = orders.map(order => ({
          id: order.invoiceNumber || order.id || order._id, // Prefer invoiceNumber if available
          date: order.date || (order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'),
          amount: order.total,
          status: order.status,
          tax: order.tax || 0
        }));
        setInvoices(mappedInvoices);
      } catch (e) {
        console.error(e);
      }
    };
    fetchInvoices();
  }, []);

  const exchangeRate = 83; // Mock conversion
  const convert = (amount: number) => currency === "INR" ? amount * exchangeRate : amount;

  const filteredInvoices = invoices.filter(inv => {
    if (filter === "all") return true;
    return inv.status === filter;
  });

  const handleDownload = (id: string) => {
    toast({ description: `Downloading invoice ${id}...` });
  };

  const currentBalance = 248.00;
  const nextInvoiceAmount = 248.00;

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Header with Currency Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Billing & Invoices</h1>
          <p className="text-muted-foreground mt-1">
            Manage your billing information and view invoices
          </p>
        </div>
        <div className="flex items-center bg-secondary/30 p-1 rounded-lg">
          <button
            onClick={() => setCurrency("INR")}
            className={cn("px-3 py-1.5 text-sm font-medium rounded-md transition-all", currency === "INR" ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground")}
          >
            INR (₹)
          </button>
          <button
            onClick={() => setCurrency("USD")}
            className={cn("px-3 py-1.5 text-sm font-medium rounded-md transition-all", currency === "USD" ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground")}
          >
            USD ($)
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-card rounded-xl border p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-accent/10 text-accent">
                <CreditCard className="h-5 w-5" />
              </div>
              <span className="text-sm text-muted-foreground">Current Balance</span>
            </div>
            <p className="text-2xl font-bold">{formatPrice(convert(currentBalance))}</p>
          </div>
          <div className="mt-4 pt-4 border-t">
            <button onClick={() => setProfileOpen(true)} className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
              Manage billing profile <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        <div className="bg-card rounded-xl border p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-info/10 text-info">
                <Building2 className="h-5 w-5" />
              </div>
              <span className="text-sm text-muted-foreground">Next Invoice</span>
            </div>
            <p className="text-2xl font-bold">{formatPrice(convert(nextInvoiceAmount))}</p>
            <p className="text-sm text-muted-foreground">Due Feb 15, 2024</p>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-warning/30 bg-warning/5 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-warning/10 text-warning">
              <AlertCircle className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium text-warning">Action Required</span>
          </div>
          <p className="text-sm mb-3">Primary payment method expiring soon.</p>
          <Button size="sm" variant="warning" onClick={() => setPaymentMethodOpen(true)}>
            Update Now
          </Button>
        </div>
      </div>

      {/* Usage & Overages */}
      <div className="bg-card rounded-xl border p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Usage This Period</h2>
          <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => setPricingOpen(true)}>
            View Pricing
          </Button>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {Object.entries(USAGE).map(([key, value]) => {
            const percentage = (value.used / value.total) * 100;
            const isWarning = percentage > 80;
            return (
              <div key={key}>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="capitalize font-medium">{key.replace(/([A-Z])/g, " $1")}</span>
                  <span className="text-muted-foreground">
                    {value.used.toLocaleString()} / {value.total.toLocaleString()} {value.unit}
                  </span>
                </div>
                <Progress
                  value={percentage}
                  className={cn("h-2", isWarning && "[&>div]:bg-warning")}
                />
                {isWarning && (
                  <p className="text-[10px] text-warning mt-1.5 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    High usage: Overage fees apply above limits.
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-card rounded-xl border p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Payment Methods</h2>
          <Button size="sm" variant="outline" onClick={() => setPaymentMethodOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Method
          </Button>
        </div>
        <div className="space-y-3">
          {PAYMENT_METHODS.map((method) => (
            <div
              key={method.id}
              className={cn(
                "flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border transition-all hover:bg-secondary/10",
                method.default ? "border-primary/20 bg-primary/5" : "border-border"
              )}
            >
              <div className="flex items-center gap-4 mb-3 sm:mb-0">
                <div className="p-3 rounded-lg bg-background border shadow-sm">
                  <CreditCard className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{method.brand} •••• {method.last4}</p>
                    {method.default && <Badge variant="secondary" className="text-[10px] h-5">Default</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">Expires {method.expiry}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setPaymentMethodOpen(true)}>Edit</Button>
                {!method.default && (
                  <Button variant="ghost" size="sm" onClick={() => toast({ description: "Set as default" })}>Set Default</Button>
                )}
                <Button variant="ghost" size="icon-sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => toast({ description: "Removed payment method" })}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invoices */}
      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">Invoice History</h2>
          <div className="flex flex-wrap gap-2">
            {['all', 'active', 'pending', 'paid', 'refunded'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded-full capitalize border transition-colors",
                  filter === f ? "bg-primary text-primary-foreground border-primary" : "bg-transparent text-muted-foreground border-transparent hover:bg-secondary"
                )}
              >
                {f}
              </button>
            ))}
            <Button variant="outline" size="sm" className="ml-2" onClick={() => toast({ description: "Exporting CSV..." })}>
              Export CSV
            </Button>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block">
          <Table>
            <TableHeader className="bg-secondary/30">
              <TableRow>
                <TableHead className="pl-6">Invoice</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Tax</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id} className="hover:bg-secondary/10">
                  <TableCell className="font-medium pl-6">{invoice.id}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell className="font-medium">{formatPrice(convert(invoice.amount))}</TableCell>
                  <TableCell className="text-muted-foreground">{formatPrice(convert(invoice.tax))}</TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        "font-normal capitalize",
                        invoice.status === "paid" && "bg-success/10 text-success border-success/20",
                        invoice.status === "pending" && "bg-warning/10 text-warning border-warning/20",
                        invoice.status === "refunded" && "bg-muted text-muted-foreground border-border"
                      )}
                    >
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-2">
                      {invoice.status === 'pending' && (
                        <Button size="sm" className="h-8" onClick={() => { setSelectedInvoice(invoice); setCheckoutOpen(true); }}>
                          Pay Now
                        </Button>
                      )}
                      <Button variant="ghost" size="icon-sm" onClick={() => handleDownload(invoice.id)} title="Download PDF">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => navigate(`/billing/invoices/${invoice.id}`)} title="View Details">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {invoice.status === 'paid' && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon-sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setRefundOpen(true)}>Request Refund</DropdownMenuItem>
                            <DropdownMenuItem>Report Issue</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile List */}
        <div className="md:hidden divide-y">
          {filteredInvoices.map((invoice) => (
            <div key={invoice.id} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-sm">{invoice.id}</span>
                </div>
                <Badge
                  className={cn(
                    "font-normal capitalize text-[10px]",
                    invoice.status === "paid" && "bg-success/10 text-success border-success/20",
                    invoice.status === "pending" && "bg-warning/10 text-warning border-warning/20",
                    invoice.status === "refunded" && "bg-muted text-muted-foreground border-border"
                  )}
                >
                  {invoice.status}
                </Badge>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">{invoice.date}</span>
                <div className="flex flex-col items-end">
                  <span className="font-bold">{formatPrice(convert(invoice.amount))}</span>
                  <span className="text-xs text-muted-foreground">Tax: {formatPrice(convert(invoice.tax))}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                {invoice.status === 'pending' ? (
                  <Button size="sm" className="w-full" onClick={() => { setSelectedInvoice(invoice); setCheckoutOpen(true); }}>Pay Now</Button>
                ) : (
                  <Button size="sm" variant="outline" className="w-full" onClick={() => handleDownload(invoice.id)}>Download</Button>
                )}
                <Button size="sm" variant="ghost" className="w-full border" onClick={() => navigate(`/billing/invoices/${invoice.id}`)}>View Details</Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Request Refund Section */}
      <div className="bg-card border-dashed border rounded-xl p-6 flex items-center justify-between">
        <div>
          <p className="font-medium">Need a refund or have a billing dispute?</p>
          <p className="text-sm text-muted-foreground">
            Contact our billing support team for assistance.
          </p>
        </div>
        <Button variant="outline" onClick={() => setRefundOpen(true)}>Request Refund</Button>
      </div>

      {/* Dialogs */}
      <BillingProfileDialog open={profileOpen} onOpenChange={setProfileOpen} />
      <PaymentMethodDialog open={paymentMethodOpen} onOpenChange={setPaymentMethodOpen} />
      <PricingDialog open={pricingOpen} onOpenChange={setPricingOpen} />
      <RefundRequestDialog open={refundOpen} onOpenChange={setRefundOpen} />
      {selectedInvoice && (
        <CheckoutDialog
          open={checkoutOpen}
          onOpenChange={setCheckoutOpen}
          amount={selectedInvoice.amount}
          itemDescription={`Invoice Payment ${selectedInvoice.id}`}
        />
      )}
    </div>
  );
}

