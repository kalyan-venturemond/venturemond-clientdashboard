import { useState } from "react";
import { Check, Building2, CreditCard, Package, Users, Shield, FileText, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const steps = [
  { id: 1, title: "Company", icon: Building2 },
  { id: 2, title: "Billing", icon: CreditCard },
  { id: 3, title: "Service", icon: Package },
  { id: 4, title: "Team", icon: Users },
  { id: 5, title: "Security", icon: Shield },
  { id: 6, title: "Agreement", icon: FileText },
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate("/dashboard");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar Progress */}
      <div className="hidden lg:flex w-80 bg-card border-r flex-col p-8">
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">V</span>
            </div>
            <span className="font-semibold">Venturemond</span>
          </div>
        </div>
        <div className="space-y-1">
          {steps.map((step) => (
            <div
              key={step.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg transition-colors",
                currentStep === step.id && "bg-secondary",
                currentStep > step.id && "text-success"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center",
                  currentStep > step.id && "bg-success text-success-foreground",
                  currentStep === step.id && "bg-primary text-primary-foreground",
                  currentStep < step.id && "bg-secondary text-muted-foreground"
                )}
              >
                {currentStep > step.id ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <step.icon className="h-4 w-4" />
                )}
              </div>
              <span className={cn(
                "font-medium",
                currentStep < step.id && "text-muted-foreground"
              )}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-auto">
          <p className="text-sm text-muted-foreground">
            Need help? <a href="#" className="text-accent hover:underline">Contact support</a>
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Progress */}
        <div className="lg:hidden p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">V</span>
              </div>
              <span className="font-semibold">Venturemond</span>
            </div>
            <span className="text-sm text-muted-foreground">Step {currentStep} of 6</span>
          </div>
          <div className="flex gap-1">
            {steps.map((step) => (
              <div
                key={step.id}
                className={cn(
                  "flex-1 h-1 rounded-full",
                  currentStep >= step.id ? "bg-primary" : "bg-secondary"
                )}
              />
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 flex items-center justify-center p-4 md:p-8">
          <div className="w-full max-w-lg animate-fade-in">
            {/* Step 1: Company Details */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold">Company Details</h1>
                  <p className="text-muted-foreground mt-1">
                    Tell us about your organization
                  </p>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label>Company Name</Label>
                    <Input placeholder="Acme Corporation" className="mt-1" />
                  </div>
                  <div>
                    <Label>Legal Name</Label>
                    <Input placeholder="Acme Corp Pvt Ltd" className="mt-1" />
                  </div>
                  <div>
                    <Label>Tax ID / GST Number</Label>
                    <Input placeholder="GSTIN123456789" className="mt-1" />
                  </div>
                  <div>
                    <Label>Business Address</Label>
                    <Input placeholder="123 Business Park" className="mt-1" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Billing */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold">Billing & Payment</h1>
                  <p className="text-muted-foreground mt-1">
                    Set up your payment method
                  </p>
                </div>
                <RadioGroup defaultValue="card" className="space-y-3">
                  <div className="flex items-center space-x-3 p-4 rounded-lg border cursor-pointer hover:bg-secondary/50">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex-1 cursor-pointer">
                      <span className="font-medium">Credit / Debit Card</span>
                      <p className="text-sm text-muted-foreground">Visa, Mastercard, Amex</p>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 rounded-lg border cursor-pointer hover:bg-secondary/50">
                    <RadioGroupItem value="upi" id="upi" />
                    <Label htmlFor="upi" className="flex-1 cursor-pointer">
                      <span className="font-medium">UPI</span>
                      <p className="text-sm text-muted-foreground">Pay via UPI apps</p>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 rounded-lg border cursor-pointer hover:bg-secondary/50">
                    <RadioGroupItem value="invoice" id="invoice" />
                    <Label htmlFor="invoice" className="flex-1 cursor-pointer">
                      <span className="font-medium">Invoice / Bank Transfer</span>
                      <p className="text-sm text-muted-foreground">Net 30 payment terms</p>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Step 3: Service */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold">Choose Your Service</h1>
                  <p className="text-muted-foreground mt-1">
                    Select a plan to get started
                  </p>
                </div>
                <RadioGroup defaultValue="pro" className="space-y-3">
                  {[
                    { id: "starter", name: "Workspace Starter", price: "$49/mo", features: "5 users, 10GB storage" },
                    { id: "pro", name: "Workspace Pro", price: "$149/mo", features: "25 users, 100GB storage", popular: true },
                    { id: "enterprise", name: "Enterprise", price: "Custom", features: "Unlimited users & storage" },
                  ].map((plan) => (
                    <div
                      key={plan.id}
                      className={cn(
                        "flex items-center space-x-3 p-4 rounded-lg border cursor-pointer hover:bg-secondary/50",
                        plan.popular && "ring-2 ring-accent"
                      )}
                    >
                      <RadioGroupItem value={plan.id} id={plan.id} />
                      <Label htmlFor={plan.id} className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{plan.name}</span>
                          {plan.popular && (
                            <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded">
                              Popular
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{plan.features}</p>
                      </Label>
                      <span className="font-medium">{plan.price}</span>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Step 4: Team */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold">Invite Your Team</h1>
                  <p className="text-muted-foreground mt-1">
                    Add team members to your workspace
                  </p>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label>Team Member 1</Label>
                    <Input placeholder="colleague@company.com" className="mt-1" />
                  </div>
                  <div>
                    <Label>Team Member 2</Label>
                    <Input placeholder="colleague@company.com" className="mt-1" />
                  </div>
                  <div>
                    <Label>Team Member 3</Label>
                    <Input placeholder="colleague@company.com" className="mt-1" />
                  </div>
                  <Button variant="outline" className="w-full">
                    + Add Another
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  You can also invite team members later from the Team page.
                </p>
              </div>
            )}

            {/* Step 5: Security */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold">Security Setup</h1>
                  <p className="text-muted-foreground mt-1">
                    Configure security preferences
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <p className="font-medium">Enable SSO</p>
                      <p className="text-sm text-muted-foreground">
                        Use your corporate identity provider
                      </p>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <p className="font-medium">Enforce 2FA</p>
                      <p className="text-sm text-muted-foreground">
                        Require two-factor authentication
                      </p>
                    </div>
                    <Button variant="outline" size="sm">Enable</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <p className="font-medium">Password Policy</p>
                      <p className="text-sm text-muted-foreground">
                        Set minimum password requirements
                      </p>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Agreement */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold">Terms & Agreement</h1>
                  <p className="text-muted-foreground mt-1">
                    Review and accept our terms
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border max-h-48 overflow-y-auto text-sm text-muted-foreground">
                    <p className="font-medium text-foreground mb-2">Terms of Service</p>
                    <p>
                      By using our services, you agree to these terms. Please read them carefully.
                      This is a placeholder for the full terms of service document that would
                      typically include information about user responsibilities, service limitations,
                      intellectual property rights, and more...
                    </p>
                  </div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1" />
                    <span className="text-sm">
                      I agree to the{" "}
                      <a href="#" className="text-accent hover:underline">Terms of Service</a>
                    </span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1" />
                    <span className="text-sm">
                      I agree to the{" "}
                      <a href="#" className="text-accent hover:underline">Data Processing Agreement</a>
                    </span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1" />
                    <span className="text-sm">
                      I agree to the{" "}
                      <a href="#" className="text-accent hover:underline">Privacy Policy</a>
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button onClick={handleNext}>
                {currentStep === 6 ? "Complete Setup" : "Continue"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
