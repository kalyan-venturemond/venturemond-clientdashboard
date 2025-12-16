import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Trash2,
  CreditCard,
  Building2,
  Smartphone,
  FileText,
  CheckCircle2,
  ChevronUp,
  ChevronDown,
  Upload,
  Pen
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { cartService, CartItem } from "@/lib/cart";
import { ordersService } from "@/lib/orders";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

// Configuration
const INR_TO_USD_RATE = 0.012; // Approximation: 1 INR ~ 0.012 USD (or 1 USD ~ 83.33 INR)
const USD_TO_INR_RATE = 83.33;

const convertPrice = (amount: number, fromCurrency: "INR" | "USD", toCurrency: "INR" | "USD") => {
  if (fromCurrency === toCurrency) return amount;
  if (fromCurrency === "INR" && toCurrency === "USD") return amount * INR_TO_USD_RATE;
  if (fromCurrency === "USD" && toCurrency === "INR") return amount * USD_TO_INR_RATE;
  return amount;
};

const formatPrice = (amount: number, curr: "INR" | "USD") => {
  return new Intl.NumberFormat(curr === "INR" ? 'en-IN' : 'en-US', {
    style: 'currency',
    currency: curr,
    maximumFractionDigits: 0
  }).format(amount);
};

export default function Checkout() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [step, setStep] = useState<"cart" | "payment" | "contract" | "success">("cart");
  const [existingOrder, setExistingOrder] = useState<any | null>(null);
  // ... existing logic below ...
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");

  // Cart Inputs
  const [startDate, setStartDate] = useState("");

  // Contract State
  const [contractSigned, setContractSigned] = useState(false);
  const [contractUploaded, setContractUploaded] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [signatureName, setSignatureName] = useState("");

  // Mobile summary drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // ...


  useEffect(() => {
    const init = async () => {
      const pendingOrderId = (location.state as any)?.orderId;
      if (pendingOrderId) {
        try {
          // Fetch existing pending order
          const order = await ordersService.getOrder(pendingOrderId);
          if (order && (order.status === 'pending' || order.status === 'payment_failed')) {
            setExistingOrder(order);
            // Map order items to cart items for display
            setCartItems(order.items);
            setStep('payment'); // Skip directly to payment
            // We need to ensure Total is correct. 
            // The calculateTotals function uses cartItems, so mapping order.items to cartItems should work if structure matches.
            // order.items are CartItem[] in interface so it should be compatible.
          }
        } catch (err) {
          console.error("Failed to load pending order", err);
          toast({ title: "Error", description: "Could not load order details", variant: "destructive" });
        }
      } else {
        setCartItems(cartService.getCart());
      }
    };
    init();
  }, [location.state]);

  // We need to adjust handleNext to handle paying for an EXISTING order instead of creating a NEW one.
  // ...


  const refreshCart = () => setCartItems([...cartService.getCart()]);

  const removeItem = (id: string) => {
    cartService.removeItem(id);
    refreshCart();
  };

  const handleDigitalSign = () => {
    if (signatureName.trim().length > 2) {
      setContractSigned(true);
      setShowSignatureModal(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setContractUploaded(true);
    }
  };

  const calculateTotals = () => {
    let subtotal = 0;

    cartItems.forEach(item => {
      subtotal += convertPrice(item.price, item.currency, currency);
    });

    const tax = subtotal * 0.18;
    const total = subtotal + tax;

    return { subtotal, tax, total };
  };

  const { subtotal, tax, total } = calculateTotals();

  const canProceed = () => {
    if (step === "cart") return cartItems.length > 0;
    if (step === "payment") return true; // simplified validation
    if (step === "contract") return (contractSigned || contractUploaded) && agreedToTerms;
    return false;
  };

  const [isLoading, setIsLoading] = useState(false);

  // NEW: store created order so we can show success UI and navigate on user click
  const [createdOrder, setCreatedOrder] = useState<any | null>(null);
  // Step 103 lines 1-41 imports show no useToast.
  // Wait, line 34: `import { useToast } from "@/hooks/use-toast";`
  // And line 100: `const { toast } = useToast();`? No, line 100 is inside `Billing.tsx` (Step 102).
  // Step 103 file content doesn't show `useToast` usage inside `Checkout` (lines 61+).
  // I need to add `useToast` import if missing.
  // Step 103 imports (lines 1-41) imports `useToast`? REMOVED?
  // Let me check Step 103 imports carefully.
  // Lines 1-40. `import { cartService... orderServices... }`.
  // I don't see `useToast` imported in Step 103 snippet.
  // So I'll add the import.

  const handleNext = async () => {
    if (step === "cart") {
      setStep("payment");
    } else if (step === "payment") {
      setStep("contract");
    } else if (step === "contract") {
      setIsLoading(true);
      try {
        if (existingOrder) {
          // If paying for existing order, simply mark it as paid (simulate)
          // In real world, this would hit a payment gateway confirmation
          await ordersService.payOrder(existingOrder.id || existingOrder._id);
          setCreatedOrder(existingOrder);
          setStep("success");
          toast({ title: "Success", description: "Payment for order completed." });
        } else {
          // Build payload that backend expects
          const payload = {
            items: [...cartItems],
            currency,
            total,
            paymentMethod: paymentMethod as any,
            billingDetails: {
              name: "John Doe", // replace with real billing inputs if available
              address: "123 Tech St",
              city: "San Francisco",
              country: "USA"
            }
          };

          // Create order; backend returns { order, invoice } or order directly
          const res = await ordersService.addOrder(payload);
          const newOrder = res?.order ?? res;
          setCreatedOrder(newOrder);

          // Clear cart and show success UI (do NOT auto-redirect)
          cartService.clearCart();
          setStep("success");
        }
      } catch (error: any) {
        console.error("Order processing failed", error);
        const errorMsg = error.response?.data?.msg || error.response?.data?.error || error.message || "Unknown error";
        try {
          toast({
            title: "Error",
            description: `Processing failed: ${errorMsg}`,
            variant: "destructive"
          });
        } catch {
          alert(`Processing failed: ${errorMsg}`);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getStepNumber = (s: string) => {
    switch (s) {
      case "cart": return 1;
      case "payment": return 2;
      case "contract": return 3;
      default: return 4;
    }
  };

  if (cartItems.length === 0 && step !== "success") {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center animate-fade-in min-h-[60vh]">
        <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-6 animate-scale-in">
          <CreditCard className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold mb-3 tracking-tight">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Explore our services to find the perfect solution for your business.
        </p>
        <Button asChild size="lg" className="rounded-full px-8">
          <Link to="/services">Explore Services</Link>
        </Button>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="max-w-xl mx-auto animate-fade-in pt-12 text-center px-4">
        <div className="dashboard-card p-8 md:p-12 overflow-visible">
          <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6 -mt-16 border-4 border-background">
            <CheckCircle2 className="h-10 w-10 text-success" />
          </div>
          <h1 className="text-3xl font-bold mb-2 tracking-tight">Purchase Complete</h1>
          <p className="text-muted-foreground mb-8">
            Thank you for your order. We've sent a confirmation email to your inbox.
          </p>

          <div className="bg-secondary/40 rounded-xl p-6 text-left mb-8 border border-border/50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-muted-foreground">Order Number</span>
              <span className="font-mono font-semibold">#{createdOrder ? (createdOrder._id || createdOrder.id || createdOrder.orderNumber) : '—'}</span>
            </div>
            <Separator className="mb-4" />
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total Paid</span>
              <span className="font-bold text-lg">{formatPrice(total, currency)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center text-sm">
            <Button
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => {
                navigate('/orders', { state: { justCreatedOrderId: createdOrder?._id || createdOrder?.id } });
              }}
            >
              View Order Details
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => {
                // fallback/in-demo invoice download
                const link = document.createElement('a');
                link.href = '#';
                link.download = `Invoice-${Date.now()}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              Download Invoice
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const SummaryContent = () => (
    <div className="space-y-4">
      <h2 className="section-title">Order Summary</h2>

      <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2 scrollbar-thin">
        {cartItems.map((item) => (
          <div key={item.id} className="flex justify-between text-sm group">
            <div className="pr-4">
              <div className="font-medium text-foreground">{item.title}</div>
              <div className="text-xs text-muted-foreground">{item.period}</div>
            </div>
            <div className="text-right whitespace-nowrap text-sm font-medium">
              {formatPrice(convertPrice(item.price, item.currency, currency), currency)}
            </div>
          </div>
        ))}
      </div>

      <Separator />

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">{formatPrice(subtotal, currency)}</span>
        </div>
        <div className="flex justify-between">
          {/* Hardcoded 18% as per existing logic, could be dynamic */}
          <span className="text-muted-foreground">Tax (18% GST)</span>
          <span className="font-medium">{formatPrice(tax, currency)}</span>
        </div>
      </div>

      <div className="bg-primary/5 p-4 rounded-lg flex justify-between items-center mt-4">
        <span className="font-semibold text-primary">Total</span>
        <span className="font-bold text-lg text-primary">{formatPrice(total, currency)}</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in relative min-h-screen pb-24 lg:pb-0">

      {/* Header & Steps */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
          {/* Breadcrumbs or subtitle could go here */}
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Currency Toggle */}
          <div className="flex items-center gap-2 bg-secondary p-1 rounded-lg self-start sm:self-auto">
            <Button
              variant={currency === "INR" ? "default" : "ghost"}
              size="sm"
              onClick={() => setCurrency("INR")}
              className="text-xs h-8 px-3"
            >
              INR (₹)
            </Button>
            <Button
              variant={currency === "USD" ? "default" : "ghost"}
              size="sm"
              onClick={() => setCurrency("USD")}
              className="text-xs h-8 px-3"
            >
              USD ($)
            </Button>
          </div>


          {/* Step Indicator */}
          <div className="flex items-center self-start md:self-auto">
            {["cart", "payment", "contract"].map((s, i) => {
              const stepNum = i + 1;
              const isActive = step === s;
              const isCompleted = getStepNumber(step) > stepNum;

              return (
                <div key={s} className="flex items-center">
                  <div className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors",
                    isActive ? "bg-primary text-primary-foreground" :
                      isCompleted ? "bg-success/10 text-success" : "text-muted-foreground"
                  )}>
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ring-1 ring-current",
                      isActive || isCompleted ? "ring-transparent bg-background/20" : "ring-border"
                    )}>
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : stepNum}
                    </div>
                    <span className="text-sm font-medium capitalize hidden sm:block">{s}</span>
                  </div>
                  {i < 2 && (
                    <div className={cn(
                      "w-8 md:w-16 h-px mx-2",
                      isCompleted ? "bg-success" : "bg-border"
                    )} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

      </div>
      <div className="grid gap-8 lg:grid-cols-3 items-start">

        {/* Left Column: Main Content */}
        <div className="lg:col-span-2 space-y-6">

          {step === "cart" && (
            <div className="dashboard-card animate-slide-up">
              <div className="flex items-center justify-between mb-6">
                <h2 className="section-title">Review Cart</h2>
                <span className="text-sm text-muted-foreground">{cartItems.length} Items</span>
              </div>

              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-secondary/30 rounded-xl border border-transparent hover:border-border transition-all"
                  >
                    <div className="mb-3 sm:mb-0">
                      <h3 className="font-semibold text-base">{item.title}</h3>
                      <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                        <span className="capitalize bg-background px-2 py-0.5 rounded border">{item.period || "One-time"}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                      <div className="font-semibold tabular-nums text-right">
                        {formatPrice(convertPrice(item.price, item.currency, currency), currency)}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 -mr-2"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <Label className="mb-2 block">Estimated Start Date (Optional)</Label>
                <Input
                  type="date"
                  className="max-w-xs"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
            </div>
          )}

          {step === "payment" && (
            <div className="dashboard-card animate-slide-up">
              <h2 className="section-title mb-6">Payment Method</h2>

              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="grid gap-4 md:grid-cols-3"
              >
                {[
                  { id: "card", icon: CreditCard, label: "Card" },
                  { id: "upi", icon: Smartphone, label: "UPI" },
                  { id: "invoice", icon: Building2, label: "Invoice / PO" },
                ].map((m) => (
                  <div key={m.id}>
                    <RadioGroupItem value={m.id} id={m.id} className="peer sr-only" />
                    <Label
                      htmlFor={m.id}
                      className={cn(
                        "flex flex-col items-center justify-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all hover:bg-secondary/50",
                        paymentMethod === m.id
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border text-muted-foreground"
                      )}
                    >
                      <m.icon className="h-6 w-6" />
                      <span className="font-medium">{m.label}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <div className="mt-8 animate-fade-in">
                {paymentMethod === "card" && (
                  <div className="space-y-4 max-w-md">
                    <div>
                      <Label>Cardholder Name</Label>
                      <Input placeholder="John Doe" className="mt-1.5" />
                    </div>
                    <div>
                      <Label>Card Number</Label>
                      <Input placeholder="0000 0000 0000 0000" className="mt-1.5" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Expiry</Label>
                        <Input placeholder="MM/YY" className="mt-1.5" />
                      </div>
                      <div>
                        <Label>CVV</Label>
                        <Input placeholder="123" className="mt-1.5" />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "upi" && (
                  <div className="space-y-4 max-w-md">
                    <div className="bg-secondary/50 p-4 rounded-lg text-sm text-muted-foreground mb-4">
                      <p>Currently supporting Google Pay, PhonePe, and Paytm.</p>
                    </div>
                    <div>
                      <Label>UPI ID</Label>
                      <Input placeholder="username@upi" className="mt-1.5" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      You will receive a payment request on your UPI app.
                    </p>
                  </div>
                )}

                {paymentMethod === "invoice" && (
                  <div className="space-y-6">
                    <div className="bg-secondary/50 p-4 rounded-lg text-sm text-muted-foreground">
                      <p>Please upload your Purchase Order (PO) or provide billing details for the invoice.</p>
                    </div>
                    <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:bg-secondary/10 transition-colors cursor-pointer">
                      <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                      <h4 className="font-medium mb-1">Upload Purchase Order</h4>
                      <p className="text-sm text-muted-foreground mb-4">PDF, JPG up to 10MB</p>
                      <Input type="file" className="hidden" id="po-upload" />
                      <Button variant="outline" asChild>
                        <label htmlFor="po-upload" className="cursor-pointer">Select File</label>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === "contract" && (
            <div className="dashboard-card animate-slide-up">
              <h2 className="section-title mb-2">Contract & Agreement</h2>
              <p className="text-muted-foreground mb-6">Please sign the agreement to finalize your subscription.</p>

              <div className={cn(
                "border-2 border-dashed rounded-xl p-8 text-center transition-all mb-6",
                contractSigned ? "border-success bg-success/5" : "border-border hover:bg-secondary/10"
              )}>
                {contractSigned ? (
                  <div className="flex flex-col items-center animate-scale-in">
                    <div className="w-12 h-12 rounded-full bg-success text-success-foreground flex items-center justify-center mb-3">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-lg text-success">Contract Signed Digitally</h3>
                    <p className="text-sm text-muted-foreground mt-1">Signed by {signatureName}</p>
                    <Button variant="link" onClick={() => setContractSigned(false)} className="mt-2 h-auto p-0 text-muted-foreground">Change</Button>
                  </div>
                ) : contractUploaded ? (
                  <div className="flex flex-col items-center animate-scale-in">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-3">
                      <FileText className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-lg">Contract Uploaded</h3>
                    <Button variant="link" onClick={() => setContractUploaded(false)} className="mt-2 h-auto p-0 text-muted-foreground">Remove</Button>
                  </div>
                ) : (
                  <>
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Service Agreement Required</h3>
                    <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                      You can either sign our standard digital contract or upload a signed copy.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button variant="outline" className="relative">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Signed PDF
                        <input type="file" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" accept=".pdf" />
                      </Button>
                      <Button onClick={() => setShowSignatureModal(true)}>
                        <Pen className="mr-2 h-4 w-4" />
                        Sign Digitally
                      </Button>
                    </div>
                  </>
                )}
              </div>

              <div className="bg-secondary/30 rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="terms"
                    className="mt-1"
                    checked={agreedToTerms}
                    onCheckedChange={(c) => setAgreedToTerms(c as boolean)}
                  />
                  <label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer select-none">
                    I agree to the{" "}
                    <a href="#" className="text-primary font-medium hover:underline">
                      Master Services Agreement
                    </a>
                    ,{" "}
                    <a href="#" className="text-primary font-medium hover:underline">
                      Terms of Service
                    </a>
                    , and{" "}
                    <a href="#" className="text-primary font-medium hover:underline">
                      Data Processing Agreement
                    </a>
                    . I understand that my subscription will start on the effective date.
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary (Desktop) */}
        <div className="hidden lg:block">
          <div className="dashboard-card sticky top-24">
            <SummaryContent />

            <div className="mt-6 flex flex-col gap-3">
              <Button
                size="lg"
                className="w-full font-semibold shadow-lg hover:shadow-xl transition-all"
                onClick={handleNext}
                disabled={!canProceed()}
              >
                {step === "cart" && "Proceed to Payment"}
                {step === "payment" && "Continue to Contract"}
                {step === "contract" && (contractSigned || contractUploaded ? "Complete Purchase" : "Sign Contract to Complete")}
              </Button>

              {step !== "cart" && (
                <Button variant="ghost" className="w-full" onClick={() => {
                  if (step === "contract") setStep("payment");
                  if (step === "payment") setStep("cart");
                }}>
                  Back
                </Button>
              )}
            </div>
          </div>

          {/* Security/Trust Badges could go here */}
          <div className="mt-6 flex justify-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all">
            {/* Mock icons for trust */}
            <div className="h-6 w-10 bg-current rounded" />
            <div className="h-6 w-10 bg-current rounded" />
            <div className="h-6 w-10 bg-current rounded" />
          </div>
        </div>
      </div>

      {/* Mobile Sticky Footer & Drawer */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 lg:hidden z-40 safe-area-bottom">
        <div className="flex items-center gap-4">
          <div className="flex-1 cursor-pointer" onClick={() => setIsDrawerOpen(true)}>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              Total <ChevronUp className="h-3 w-3" />
            </div>
            <div className="font-bold text-lg">{formatPrice(total, currency)}</div>
          </div>
          <Button
            size="lg"
            className="px-8"
            onClick={handleNext}
            disabled={!canProceed()}
          >
            {step === "cart" && "Checkout"}
            {step === "payment" && "Next"}
            {step === "contract" && "Complete"}
          </Button>
        </div>
      </div>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Order Summary</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 pt-0">
            <SummaryContent />
          </div>
          <DrawerFooter>
            <Button onClick={() => setIsDrawerOpen(false)} variant="outline">Close</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Digital Signature Modal */}
      <Dialog open={showSignatureModal} onOpenChange={setShowSignatureModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Digital Signature</DialogTitle>
            <DialogDescription>
              By typing your name below, you agree to be bound by the terms of the service agreement.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="signature" className="mb-2 block">Full Legal Name</Label>
            <Input
              id="signature"
              value={signatureName}
              onChange={(e) => setSignatureName(e.target.value)}
              placeholder="Type your full name"
              className="font-serif text-xl italic"
            />
            <p className="text-xs text-muted-foreground mt-2">
              This digital signature carries the same legal weight as a handwritten signature.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSignatureModal(false)}>Cancel</Button>
            <Button onClick={handleDigitalSign} disabled={signatureName.trim().length < 3}>Sign & Agree</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
