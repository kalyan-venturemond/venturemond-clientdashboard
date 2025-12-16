import { useState, useEffect } from "react";
import { Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConfiguratorModal, QuoteModal, CompareModal } from "@/components/dashboard/services/Modals";
import { cartService } from "@/lib/cart";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Pricing, ServiceItem, USD_TO_INR } from "@/components/dashboard/services/constants";
import { API } from "@/api";

export default function Services() {
  const [compareOpen, setCompareOpen] = useState(false);
  const [quoteService, setQuoteService] = useState<string | null>(null);
  const [configPlan, setConfigPlan] = useState<ServiceItem | null>(null);
  const [currency, setCurrency] = useState<"INR" | "USD">("USD");
  const { toast } = useToast();
  const navigate = useNavigate();

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await API.get('/services');
        // Normalize API data to prevent crashes (handle missing features, primitive price)
        const normalized = (response.data || []).map((s: any): ServiceItem => ({
          id: s._id || s.id,
          title: s.title || "Untitled Service",
          description: s.description || "",
          // Handle price: API might return number, Frontend expects Pricing object
          price: typeof s.price === 'number'
            ? { usd: s.price, inr: Math.round(s.price * USD_TO_INR), period: "one-time" }
            : (s.price || { usd: 0, inr: 0, period: "one-time" }),
          // Handle missing features array to prevent map() crash
          features: Array.isArray(s.features) ? s.features : [],
          badge: s.badge,
          tier: s.tier,
          category: s.category || 'studio', // Default to studio if missing
          sla: s.sla,
          deliverables: s.deliverables
        }));
        setServices(normalized);
      } catch (error) {
        console.error("Failed to fetch services", error);
        toast({
          title: "Error",
          description: "Failed to load services.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, [toast]);

  // CATEGORIZE SERVICES - Now using explicit 'category' field from backend
  const studioServices = services.filter(s => s.category === 'studio');
  const workspacePlans = services.filter(s => s.category === 'plan');
  const addons = services.filter(s => s.category === 'addon');

  const handleAddToCart = (item: ServiceItem) => {
    const price = currency === "INR" ? item.price.inr : item.price.usd;

    cartService.addToCart({
      id: item.id,
      title: item.title,
      price: price,
      currency: currency,
      quantity: 1,
      period: item.price.period
    });

    toast({
      title: "Added to Cart",
      description: `${item.title} added to your cart.`
    });
    // navigate("/checkout"); // Optional: stay on page to add more? User just said "update with add to cart", usually implies adding. 
    // But previous behavior was navigate. Let's keep navigation for now unless requested otherwise, or maybe better to just show toast?
    // Let's stick to adding to cart and showing toast, maybe navigation is too aggressive if they want to build a bundle.
    // Actually, for "Start Trial" -> "Add to Cart", usually you want to go to checkout?
    // Let's Comment out navigate for now to allow adding multiple items (like addons + plan).
    // navigate("/checkout"); 
  };

  const formatPrice = (price: Pricing, curr: "INR" | "USD") => {
    if (price.usd === 0 && price.inr === 0) return "Custom";
    const amount = curr === "INR" ? price.inr : price.usd;
    const formatted = new Intl.NumberFormat(curr === "INR" ? 'en-IN' : 'en-US', {
      style: 'currency',
      currency: curr,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
    return `${formatted}${price.period && price.period !== "one-time" ? ` ${price.period}` : ''}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-muted-foreground">Loading services...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in text-left">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">Services & Pricing </h1>
          <p className="text-muted-foreground mt-1">
            Choose from our range of services and plans
          </p>
        </div>
        <div className="flex items-center gap-2 bg-secondary p-1 rounded-lg">
          <Button
            variant={currency === "INR" ? "default" : "ghost"}
            size="sm"
            onClick={() => setCurrency("INR")}
            className="text-xs"
          >
            INR (₹)
          </Button>
          <Button
            variant={currency === "USD" ? "default" : "ghost"}
            size="sm"
            onClick={() => setCurrency("USD")}
            className="text-xs"
          >
            USD ($)
          </Button>
        </div>
      </div>

      <Tabs defaultValue="services" className="space-y-8">
        <TabsList className="bg-secondary/50 p-1">
          <TabsTrigger value="services">Studio Services</TabsTrigger>
          <TabsTrigger value="plans">Workspace Plans</TabsTrigger>
          <TabsTrigger value="addons">Add-ons</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-semibold">Studio Services</h2>
              <p className="text-muted-foreground text-sm">
                End-to-end development and consulting services
              </p>
            </div>
            {studioServices.length > 0 && (
              <Button variant="outline" size="sm" onClick={() => setCompareOpen(true)}>
                Compare Services
              </Button>
            )}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studioServices.map((service) => (
              <div
                key={service.id}
                className="dashboard-card relative overflow-hidden group hover:border-primary/50 transition-all duration-300"
              >
                {service.badge && (
                  <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                    {service.badge}
                  </Badge>
                )}
                <div className="mb-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                    <Zap className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg">{service.title}</h3>
                  <div className="text-2xl font-bold mt-2">
                    {formatPrice(service.price, currency)}
                  </div>
                  {service.tier && (
                    <Badge variant="outline" className="mt-2 text-xs">{service.tier}</Badge>
                  )}
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{service.description}</p>
                </div>

                <div className="space-y-3 mb-6">
                  {service.features.length > 0 ? (
                    service.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-success mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground/50 italic">No features listed</div>
                  )}
                </div>

                <div className="mt-auto pt-6 border-t border-border/50">
                  <div className="grid grid-cols-2 gap-3">
                    <Button className="w-full" onClick={() => handleAddToCart(service)}>
                      Add to Cart
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => setQuoteService(service.title)}>
                      Request Quote
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {studioServices.length === 0 && (
              <div className="col-span-3 text-center py-12 border rounded-lg border-dashed bg-secondary/5">
                <p className="text-muted-foreground">No studio services found in the catalog.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="plans" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            {workspacePlans.map((plan) => (
              <div
                key={plan.id}
                className={cn(
                  "dashboard-card relative transition-all duration-300",
                  plan.badge ? "border-primary shadow-lg scale-105" : "hover:border-primary/50"
                )}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      {plan.badge}
                    </Badge>
                  </div>
                )}
                <div className="text-center mb-6 pt-4">
                  <h3 className="font-bold text-lg">{plan.title}</h3>
                  <div className="text-3xl font-bold mt-2">
                    {formatPrice(plan.price, currency)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{plan.price.period || "per user/month"}</p>
                </div>

                <div className="space-y-3 mb-8">
                  {plan.features.length > 0 ? (
                    plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-success shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground/50 italic">Includes standard features</div>
                  )}
                </div>

                <Button
                  className="w-full"
                  variant={plan.badge ? "default" : "outline"}
                  onClick={() => {
                    if (plan.id === "enterprise") {
                      setQuoteService(plan.title);
                    } else {
                      // setConfigPlan(plan); // Old behavior
                      handleAddToCart(plan); // New behavior: Add to cart directly
                    }
                  }}
                >
                  {plan.id === "enterprise" ? "Contact Sales" : "Add to Cart"}
                </Button>
              </div>
            ))}
            {workspacePlans.length === 0 && (
              <div className="col-span-3 text-center py-12 text-muted-foreground">No workspace plans available.</div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="addons" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {addons.map((addon) => (
              <div key={addon.id} className="dashboard-card hover:border-primary/50 transition-all">
                <div className="mb-4">
                  <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center mb-3">
                    <Zap className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium">{addon.title}</h3>
                  <div className="text-lg font-bold mt-1">
                    {formatPrice(addon.price, currency)}
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  {addon.features.slice(0, 3).map((f, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Check className="h-3 w-3 text-success mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
                <Button className="w-full" variant="secondary" onClick={() => handleAddToCart(addon)}>
                  Add to Cart
                </Button>
              </div>
            ))}
            {addons.length === 0 && <div className="col-span-4 text-center text-muted-foreground">No add-ons available.</div>}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      {configPlan && (
        <ConfiguratorModal
          isOpen={!!configPlan}
          onClose={() => setConfigPlan(null)}
          plan={configPlan}
          currency={currency}
        />
      )}

      <QuoteModal
        isOpen={!!quoteService}
        onClose={() => setQuoteService(null)}
        serviceName={quoteService || ""}
      />

      <CompareModal
        isOpen={compareOpen}
        onClose={() => setCompareOpen(false)}
        currency={currency}
        services={studioServices}
      />
    </div>
  );
}
