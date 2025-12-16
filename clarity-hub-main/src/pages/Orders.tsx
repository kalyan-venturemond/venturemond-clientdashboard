import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Download,
  Eye,
  CreditCard,
  ChevronRight,
  CheckCircle2,
  Clock,
  Package,
  Rocket,
  Calendar,
  FileText,
  HelpCircle,
  ArrowLeft,
  AlertCircle,
  Smartphone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { UpgradeSubscriptionDialog } from "@/components/orders/UpgradeSubscriptionDialog";
import { CancelSubscriptionDialog } from "@/components/orders/CancelSubscriptionDialog";
import { BillingDetailsDialog } from "@/components/orders/BillingDetailsDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PenLine, Save } from "lucide-react";
import { ordersService, Order } from "@/lib/orders";
import { useToast } from "@/hooks/use-toast";

// Constants & Config
const INR_TO_USD_RATE = 0.012;

const statusConfig = {
  active: { label: "Active", color: "bg-success/10 text-success" },
  provisioning: { label: "Provisioning", color: "bg-info/10 text-info" },
  pending: { label: "Pending", color: "bg-warning/10 text-warning" },
  paid: { label: "Paid", color: "bg-success/10 text-success" },
  completed: { label: "Completed", color: "bg-muted text-muted-foreground" },
  cancelled: { label: "Cancelled", color: "bg-destructive/10 text-destructive" },
  payment_failed: { label: "Payment Failed", color: "bg-destructive/10 text-destructive" },
  trial: { label: "Trial", color: "bg-primary/10 text-primary" },
  past_due: { label: "Past Due", color: "bg-destructive/10 text-destructive" },
  renewal_failed: { label: "Renewal Failed", color: "bg-destructive/10 text-destructive" }
};


export default function Orders() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const location = useLocation();
  const justCreatedOrderId = (location.state as any)?.justCreatedOrderId;
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const [filterStatus, setFilterStatus] = useState<"all" | Order["status"]>("all");

  // Dialog State
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showBillingDialog, setShowBillingDialog] = useState(false);
  const [selectedSubscriptionOrder, setSelectedSubscriptionOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Use normalized listOrders which handles the response shape
        const data = await ordersService.listOrders();

        // Normalize: Map backend _id/createdAt to frontend id/date if missing
        const normalizedOrders = data.map((o: any) => ({
          ...o,
          id: o._id || o.id,
          date: o.date || (o.createdAt ? new Date(o.createdAt).toLocaleDateString() : 'N/A')
        }));

        setOrders(normalizedOrders);

        // Optional: if we were navigated here with a created order id, try to highlight/scroll
        if (justCreatedOrderId) {
          setTimeout(() => {
            const el = document.querySelector(`[data - order - id= "${justCreatedOrderId}"]`);
            if (el && typeof (el as HTMLElement).scrollIntoView === 'function') {
              (el as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
              el.classList.add('just-created-highlight');
              setTimeout(() => el.classList.remove('just-created-highlight'), 3500);
            }
          }, 250);
        }

      } catch (error) {
        console.error("Failed to fetch orders", error);
        // Fallback to empty if failed, or handle error state
      }
    };
    fetchOrders();
  }, []);

  const handlePayOrder = async (orderId: string) => {
    // Redirect to checkout with orderId passed in state
    navigate('/checkout', {
      state: { orderId }
    });
  };


  const selectedOrder = selectedOrderId ? orders.find(o => o.id === selectedOrderId) : null;
  const activeSubscriptions = orders.filter(o => o.subscription);

  // --- Handlers ---
  // No changes needed for subscriptions tab logic itself if `ordersService.listOrders` returns order.subscription populated.
  // The 'activeSubscriptions' is derived from 'orders'.
  // Let's verify if `listOrders` populates subscription.
  // Viewing `backend/src/controllers/orders.js`:
  //   .populate('subscription')
  // If it does, then the frontend logic `const activeSubscriptions = orders.filter(o => o.subscription);` works.

  // However, I previously created a `subscriptionsService`.
  // If we want to use that instead for the tab, we could fetch it separately.
  // But `activeSubscriptions` derived from orders is fine if they are linked.
  // Actually, keeping them linked via orders is better for this 'Orders & Subscriptions' unified page.
  // So I will just update the 'handleUpgrade' to be more realistic or leave as mock for now, but confirm the fetch logic is sound.

  // The fetch logic in `Orders.tsx` (lines 75-107) calls `ordersService.listOrders`.
  // I should verify `listOrders` in frontend service calls the right endpoint.
  // It calls `API.get('/orders')`.

  // Let's modify `Orders.tsx` to ALSO fetch from `subscriptionsService` if we want independent subscription list, 
  // OR just rely on orders. The prompt asked to "Update the Subscriptions page...". 
  // Since it's a tab in Orders, I'll stick to the current implementation but ensure it renders correctly.

  // One thing: The `Order` interface in frontend might need `subscription` field type definition?
  // I checked `orders.ts` viewed earlier?
  // Let's just update `Orders.tsx` to handle potential missing subscription gracefully.
  // Actually, I'll leave `Orders.tsx` mostly as is but fix any obvious mocks if I see them.
  // It seems I already normalized data.

  // Wait, I see "Mock backend call" in `handleUpgrade` etc. I should leave those as mocks for now per instructions "Basic connectivity only... no payments".

  // I'll update the `useEffect` to also log the loaded data for verification.
  const handleUpgrade = async (planId: string, seats: number) => {
    // Mock for now as per requirements
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: "Plan Upgraded",
      description: `Successfully upgraded to ${planId === 'enterprise' ? 'Enterprise' : 'Pro'} plan.`,
      className: "bg-success text-white border-none"
    });

    // Update local state to reflect change immediately
    if (selectedSubscriptionOrder) {
      const updatedOrders = orders.map(o =>
        o.id === selectedSubscriptionOrder.id
          ? {
            ...o,
            subscription: {
              ...o.subscription!,
              planId,
              planName: planId === 'enterprise' ? 'Enterprise' : 'Workspace Pro',
              billingPeriod: 'yearly', // Mock switch
              status: 'active',
              // Reset usage on upgrade for demo purposes
              usage: {
                ...o.subscription!.usage,
                seats: { ...o.subscription!.usage.seats, total: planId === 'enterprise' ? 9999 : 25 }
              }
            }
          }
          : o
      );
      setOrders(updatedOrders);
    }
  };

  const handleCancel = async (reason: string) => {
    // Mock backend call
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (selectedSubscriptionOrder) {
      const updatedOrders = orders.map(o =>
        o.id === selectedSubscriptionOrder.id
          ? {
            ...o,
            subscription: { ...o.subscription!, status: 'cancelled' as const }
          }
          : o
      );
      setOrders(updatedOrders);
    }
  };

  const handleUpdateBilling = async (details: any) => {
    // Mock backend call
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (selectedOrder) {
      const updatedOrders = orders.map(o =>
        o.id === selectedOrder.id
          ? { ...o, billingDetails: details }
          : o
      );
      setOrders(updatedOrders);
    }
  };

  const formatPrice = (amount: number, curr: "INR" | "USD") => {
    return new Intl.NumberFormat(curr === "INR" ? 'en-IN' : 'en-US', {
      style: 'currency',
      currency: curr,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const convertAndFormatPrice = (amount: number, fromCurr: "INR" | "USD", toCurr: "INR" | "USD") => {
    let finalAmount = amount;
    if (fromCurr === "INR" && toCurr === "USD") finalAmount = amount * INR_TO_USD_RATE;
    if (fromCurr === "USD" && toCurr === "INR") finalAmount = amount / INR_TO_USD_RATE;
    return formatPrice(finalAmount, toCurr);
  };

  const handleUploadContract = (orderId: string) => {
    // Mock upload
    const updatedOrders = orders.map(o =>
      o.id === orderId ? { ...o, contractStatus: 'uploaded' as const } : o
    );
    setOrders(updatedOrders);
    // In a real app, we'd show a toast here
  };

  const handleSignContract = (orderId: string) => {
    // Mock signature
    const updatedOrders = orders.map(o =>
      o.id === orderId ? { ...o, contractStatus: 'signed' as const } : o
    );
    setOrders(updatedOrders);
  };

  // --- Order Detail View ---
  if (selectedOrder) {
    return (
      <div className="animate-fade-in space-y-6">
        {/* Dialogs */}
        {selectedOrder.billingDetails && (
          <BillingDetailsDialog
            open={showBillingDialog}
            onOpenChange={setShowBillingDialog}
            initialDetails={selectedOrder.billingDetails}
            onSave={handleUpdateBilling}
          />
        )}

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setSelectedOrderId(null)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Order Details</h1>
            <p className="text-muted-foreground">{selectedOrder.id}</p>
          </div>
          {/* Detail View Currency Toggle */}
          <div className="ml-auto flex items-center gap-2 bg-secondary p-1 rounded-lg">
            <Button
              variant={currency === "INR" ? "default" : "ghost"}
              size="sm"
              onClick={() => setCurrency("INR")}
              className="text-xs h-8 px-3"
            >
              INR
            </Button>
            <Button
              variant={currency === "USD" ? "default" : "ghost"}
              size="sm"
              onClick={() => setCurrency("USD")}
              className="text-xs h-8 px-3"
            >
              USD
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Order Summary */}
            <div className="dashboard-card space-y-4">
              <div className="flex justify-between items-start">
                <h2 className="section-title">Order Summary</h2>
                {selectedOrder.billingDetails && (
                  <Button variant="link" className="h-auto p-0 text-xs" onClick={() => setShowBillingDialog(true)}>
                    View Billing Details
                  </Button>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="text-xs text-muted-foreground font-medium">Service Name(s)</label>
                  <ul className="list-disc list-inside">
                    {selectedOrder.items.map((item, idx) => (
                      <li key={idx} className="font-medium">{item.title}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-medium">Date Placed</label>
                  <p className="text-sm">{selectedOrder.date}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-medium">Invoice Number</label>
                  <p className="text-sm font-mono">{selectedOrder.invoiceNumber || "Pending"}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-medium">Payment Method</label>
                  <div className="flex items-center gap-2 mt-1">
                    {selectedOrder.paymentMethod === 'card' && <CreditCard className="h-4 w-4" />}
                    {selectedOrder.paymentMethod === 'upi' && <Smartphone className="h-4 w-4" />}
                    {selectedOrder.paymentMethod === 'invoice' && <FileText className="h-4 w-4" />}
                    <span className="text-sm capitalize">{selectedOrder.paymentMethod || "Standard Checkout"}</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{convertAndFormatPrice(selectedOrder.subtotal || selectedOrder.total, selectedOrder.currency, currency)}</span>
                </div>
                {selectedOrder.tax !== undefined && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span>{convertAndFormatPrice(selectedOrder.tax, selectedOrder.currency, currency)}</span>
                  </div>
                )}
                {selectedOrder.discount && (
                  <div className="flex justify-between text-sm text-success">
                    <span>Discount</span>
                    <span>-{convertAndFormatPrice(selectedOrder.discount, selectedOrder.currency, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                  <span>Total</span>
                  <span className="text-primary">{convertAndFormatPrice(selectedOrder.total, selectedOrder.currency, currency)}</span>
                </div>
              </div>
            </div>

            {/* 2. Contract Status */}
            <div className="dashboard-card">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="section-title mb-1">Contract Status</h2>
                  <p className="text-sm text-muted-foreground">Master Services Agreement & Terms</p>
                </div>
                <Badge variant={selectedOrder.contractStatus === 'pending' ? 'outline' : 'default'} className={
                  selectedOrder.contractStatus === 'pending' ? "text-warning border-warning" :
                    selectedOrder.contractStatus === 'uploaded' ? "bg-info/10 text-info hover:bg-info/20" :
                      "bg-success hover:bg-success"
                }>
                  {selectedOrder.contractStatus === 'signed' ? 'Signed Digitally' :
                    selectedOrder.contractStatus === 'uploaded' ? 'Uploaded' : 'Pending Action'}
                </Badge>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                {selectedOrder.contractStatus === 'pending' && (
                  <>
                    <Button className="w-full sm:w-auto" onClick={() => {
                      if (window.confirm("Simulate uploading a contract file?")) {
                        handleUploadContract(selectedOrder.id);
                      }
                    }}>
                      <FileText className="mr-2 h-4 w-4" />
                      Upload Contract
                    </Button>
                    <Button variant="accent" className="w-full sm:w-auto" onClick={() => {
                      if (window.confirm("Sign contract digitally now?")) {
                        handleSignContract(selectedOrder.id);
                      }
                    }}>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Sign Digitally
                    </Button>
                  </>
                )}

                {(selectedOrder.contractStatus === 'signed' || selectedOrder.contractStatus === 'uploaded') && (
                  <Button variant="outline" className="w-full sm:w-auto">
                    <Download className="mr-2 h-4 w-4" />
                    Download Contract
                  </Button>
                )}
              </div>
            </div>

            {/* 3. Timeline */}
            <div className="dashboard-card">
              <h2 className="section-title mb-6">Order Timeline</h2>
              <div className="relative pl-2">
                <div className="absolute left-[19px] top-2 bottom-4 w-px bg-border" />
                {selectedOrder.timeline?.map((step, index) => (
                  <div key={index} className="flex gap-4 pb-8 relative last:pb-0">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 border-4 border-card",
                      step.done ? "bg-success/10 text-success" : "bg-secondary text-muted-foreground"
                    )}>
                      {step.status === 'created' && <CheckCircle2 className="h-5 w-5" />}
                      {step.status === 'paid' && <CreditCard className="h-5 w-5" />}
                      {step.status === 'provisioning' && <Package className="h-5 w-5" />}
                      {step.status === 'kickoff' && <Rocket className="h-5 w-5" />}
                      {step.status === 'delivery' && <Clock className="h-5 w-5" />}
                    </div>
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                        <span className="font-semibold">{step.label}</span>
                        <Badge variant="outline" className="w-fit text-[10px] h-5 px-1.5">{step.status}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{step.date}</p>
                      {step.description && <p className="text-sm mt-2">{step.description}</p>}
                    </div>
                  </div>
                )) || <p className="text-muted-foreground italic">No timeline updates yet.</p>}
              </div>
            </div>
          </div>

          {/* Right Column: Actions */}
          <div className="space-y-6">
            <div className="dashboard-card sticky top-6">
              <h3 className="font-medium mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = '#';
                    link.download = `Invoice - ${selectedOrder.id}.pdf`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  <Download className="mr-2 h-4 w-4" /> Download Invoice
                </Button>
                {(selectedOrder.status === 'pending' || selectedOrder.status === 'payment_failed') && (
                  <Button className="w-full" variant="accent" onClick={() => handlePayOrder(selectedOrder.id)}>
                    <CreditCard className="mr-2 h-4 w-4" /> Pay Now
                  </Button>
                )}
                <Button className="w-full" variant="ghost" onClick={() => window.location.href = `mailto:support @venturemond.com?subject = Support Request for Order ${selectedOrder.id}`}>
                  <HelpCircle className="mr-2 h-4 w-4" /> Contact Support
                </Button>
              </div>
            </div>

            {/* Metadata */}
            <div className="bg-muted/30 p-4 rounded-lg text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Created</span>
                <span>{selectedOrder.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Managed By</span>
                <span>VentureMond Admin</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Main List View ---
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold">Orders & Subscriptions</h1>
          <p className="text-muted-foreground mt-1">
            Manage your purchases and billing
          </p>
        </div>
        {/* Global Currency Toggle for Tabs */}
        <div className="flex items-center gap-2 bg-secondary p-1 rounded-lg">
          <Button
            variant={currency === "INR" ? "default" : "ghost"}
            size="sm"
            onClick={() => setCurrency("INR")}
            className="text-xs h-8 px-3"
          >
            INR
          </Button>
          <Button
            variant={currency === "USD" ? "default" : "ghost"}
            size="sm"
            onClick={() => setCurrency("USD")}
            className="text-xs h-8 px-3"
          >
            USD
          </Button>
        </div>
      </div>

      {/* Dialogs */}
      {selectedSubscriptionOrder && (
        <>
          <UpgradeSubscriptionDialog
            open={showUpgradeDialog}
            onOpenChange={setShowUpgradeDialog}
            currentPlan={selectedSubscriptionOrder.subscription?.planName || ''}
            onUpgrade={handleUpgrade}
            currency={currency}
          />
          <CancelSubscriptionDialog
            open={showCancelDialog}
            onOpenChange={setShowCancelDialog}
            onCancel={handleCancel}
          />
        </>
      )}

      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <div className="space-y-6">
            {/* Status Filters */}
            <div className="flex flex-wrap gap-2">
              {["all", "active", "pending", "paid", "provisioning", "cancelled", "completed"].map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? "accent" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus(status as any)}
                  className="capitalize rounded-full"
                >
                  {status}
                </Button>
              ))}
            </div>

            <div className="dashboard-card p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="min-w-[200px]">Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders
                      .filter(o => filterStatus === "all" || o.status === filterStatus)
                      .map((order) => (
                        <TableRow key={order.id} data-order-id={order.id} className="hover:bg-muted/50 cursor-pointer" onClick={() => setSelectedOrderId(order.id)}>
                          <TableCell className="font-medium">#ORD-{order.id.slice(-6).toUpperCase()}</TableCell>
                          <TableCell>{order.date}</TableCell>
                          <TableCell>
                            <span className="text-sm line-clamp-1">
                              {order.items.map(i => i.title).join(", ")}
                            </span>
                          </TableCell>
                          <TableCell className="font-medium text-primary">
                            {convertAndFormatPrice(order.total, order.currency, currency)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={cn(
                                "font-normal whitespace-nowrap",
                                statusConfig[order.status]?.color || "bg-secondary text-secondary-foreground"
                              )}
                            >
                              {statusConfig[order.status]?.label || order.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                              {(order.status === 'pending' || order.status === 'payment_failed') && (
                                <Button size="sm" variant="accent" className="h-8 shadow-sm" onClick={() => handlePayOrder(order.id)}>
                                  Pay Now
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setSelectedOrderId(order.id)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  const link = document.createElement('a');
                                  link.href = '#';
                                  link.download = `Invoice - ${order.id}.pdf`;
                                  document.body.appendChild(link);
                                  link.click();
                                  document.body.removeChild(link);
                                }}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                {orders.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground">
                    No orders found.
                  </div>
                )}
              </div>

              {/* Mobile Card Layout (Hidden on Desktop) - simplified representation logic */}
              {/* Note: The table actually handles horizontal scroll well, but for true mobile cards we'd need a separate view. 
                 Given 'responsive' constraint often implies table scrolling on mobile for admin dashboards, 
                 but request said "Collapse items into card layout". 
                 I'll add a section visible only on small screens if I can, but standard practice in this specific simple dashboard
                 often relies on table scroll. Let's try to add a visible-on-mobile div list.
             */}
              <div className="md:hidden divide-y divide-border">
                {orders
                  .filter(o => filterStatus === "all" || o.status === filterStatus)
                  .map(order => (
                    <div key={order.id} className="p-4 space-y-3 bg-card" onClick={() => setSelectedOrderId(order.id)}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-sm">{order.id}</h3>
                          <p className="text-xs text-muted-foreground">{order.date}</p>
                        </div>
                        <Badge className={statusConfig[order.status]?.color}>{statusConfig[order.status]?.label}</Badge>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{order.items.map(i => i.title).join(", ")}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-primary">{convertAndFormatPrice(order.total, order.currency, currency)}</span>
                        <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                          {(order.status === 'pending' || order.status === 'payment_failed') && (
                            <Button size="sm" variant="accent" className="h-8" onClick={() => handlePayOrder(order.id)}>Pay Now</Button>
                          )}
                          <Button size="sm" variant="outline" className="h-8" onClick={() => setSelectedOrderId(order.id)}>Details</Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="subscription">
          <div className="space-y-6">
            {activeSubscriptions.length === 0 ? (
              <div className="dashboard-card p-8 text-center text-muted-foreground">
                No active subscriptions found.
              </div>
            ) : (
              activeSubscriptions.map(order => (
                <div key={order.id} className="grid gap-6 lg:grid-cols-2 mb-6 last:mb-0">
                  {/* Current Plan */}
                  <div className="dashboard-card">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="section-title">{order.subscription?.planName}</h2>
                        <Badge className={cn("mt-2",
                          order.subscription?.status === 'active' ? "bg-success/10 text-success" :
                            order.subscription?.status === 'past_due' ? "bg-destructive/10 text-destructive" :
                              "bg-secondary text-secondary-foreground"
                        )}>
                          {statusConfig[order.subscription?.status || 'active']?.label || order.subscription?.status}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">
                          {convertAndFormatPrice(order.total, order.currency, currency)}
                        </p>
                        <p className="text-sm text-muted-foreground">/ {order.subscription?.billingPeriod}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1">
                        <div className="flex text-sm font-medium text-muted-foreground justify-between">
                          <span>Billing Cycle</span>
                          <span className="text-foreground capitalize">{order.subscription?.billingPeriod}ly</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Next billing</span>
                        <span className="flex items-center gap-1 font-medium">
                          <Calendar className="h-4 w-4" />
                          {order.subscription?.nextBillingDate}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mt-6">
                      {(order.subscription?.status === 'renewal_failed' || order.subscription?.status === 'past_due') && (
                        <Button variant="accent" className="flex-1">Pay Now</Button>
                      )}
                      <Button variant="outline" className="flex-1" onClick={() => {
                        setSelectedSubscriptionOrder(order);
                        setShowCancelDialog(true);
                      }}>
                        Cancel Plan
                      </Button>
                      <Button className="flex-1" onClick={() => {
                        setSelectedSubscriptionOrder(order);
                        setShowUpgradeDialog(true);
                      }}>
                        Upgrade
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>

                  {/* Usage */}
                  <div className="dashboard-card">
                    <h2 className="section-title mb-4">Usage</h2>
                    {order.subscription?.usage ? (
                      <div className="space-y-6">
                        <div>
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span>Seats Used</span>
                            <span className="font-medium text-muted-foreground">
                              {order.subscription.usage.seats.used} / {order.subscription.usage.seats.total}
                            </span>
                          </div>
                          <Progress
                            value={(order.subscription.usage.seats.used / order.subscription.usage.seats.total) * 100}
                            className="h-2"
                          />
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span>Storage Used</span>
                            <span className="font-medium text-muted-foreground">
                              {order.subscription.usage.storage.used} {order.subscription.usage.storage.unit} / {order.subscription.usage.storage.total} {order.subscription.usage.storage.unit}
                            </span>
                          </div>
                          <Progress
                            value={(order.subscription.usage.storage.used / order.subscription.usage.storage.total) * 100}
                            className="h-2"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">No usage metrics available for this plan.</div>
                    )}

                    <div className="mt-6 bg-secondary/30 rounded-lg p-4 flex gap-3 text-sm text-muted-foreground items-start">
                      <AlertCircle className="h-5 w-5 text-primary shrink-0" />
                      <p>Your team is growing! Consider upgrading to the <strong>Enterprise Plan</strong> for unlimited seats and dedicated support.</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
