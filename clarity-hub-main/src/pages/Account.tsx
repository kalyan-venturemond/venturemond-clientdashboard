import { useState, useEffect } from "react";
import {
  Building2,
  Shield,
  FileText,
  Lock,
  User,
  Trash2,
  Mail,
  CreditCard,
  Download,
  Eye,
  EyeOff,
  AlertTriangle,
  History,
  Globe,
  Clock,
  CheckCircle2,
  Smartphone,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

import { useAuth } from "@/context/AuthContext";
import { userService } from "@/lib/user";


const SECTIONS = [
  { id: "company", label: "Company", icon: Building2 },
  { id: "compliance", label: "Data & Compliance", icon: Shield },
  { id: "audit", label: "Audit & Logs", icon: History },
  { id: "security", label: "Security & MFA", icon: Lock },
  { id: "profile", label: "Profile & Preferences", icon: User },
];

// Types
interface CompanyInfo {
  name: string;
  legalName: string;
  taxId: string;
  address: string;
  country: string;
  adminContact: string;
  phone: string;
}

export default function Account() {
  const { toast } = useToast();
  const { user, updateUser } = useAuth();

  const [activeSection, setActiveSection] = useState("company");

  // --- Company State ---
  const [showTaxId, setShowTaxId] = useState(false);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: "Acme Corporation",
    legalName: "Acme Corp Pvt Ltd",
    taxId: "GSTIN-12AB34C",
    address: "123 Business Park, Tech City",
    country: "India",
    adminContact: user?.email || "hello@acme.com",
    phone: "+91 98765 43210",
  });
  const [editCompanyOpen, setEditCompanyOpen] = useState(false);
  const [tempCompanyInfo, setTempCompanyInfo] = useState<CompanyInfo>(companyInfo);

  // --- Data & Compliance State ---
  const [exportStatus, setExportStatus] = useState<"idle" | "preparing" | "ready">("idle");
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false); // Reusing for "Contact Support"

  // --- Audit State ---
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>();
  const [auditLogs] = useState([
    { id: 1, action: "User Login", user: user?.email || "admin@acme.com", details: "Successful login", timestamp: "Today, 10:23 AM", ip: "192.168.1.1" },
    { id: 2, action: "Update Profile", user: user?.email || "admin@acme.com", details: "Updated settings", timestamp: "Yesterday, 4:45 PM", ip: "192.168.1.1" },
  ]);

  // --- Security State ---
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [mfaModalOpen, setMfaModalOpen] = useState(false);
  const [mfaStep, setMfaStep] = useState<1 | 2 | 3>(1); // 1: QR, 2: Verify, 3: Backup Codes

  // --- Profile State ---
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    jobTitle: "Administrator",
    language: "en",
    theme: "system"
  });

  useEffect(() => {
    if (user) {
      const parts = (user.name || "").split(" ");
      const profileData = (user as any).profile || {};

      setProfile({
        firstName: parts[0] || "",
        lastName: parts.slice(1).join(" ") || "",
        email: user.email,
        phone: profileData.phone || "+1 555 0123",
        jobTitle: "Administrator",
        language: "en",
        theme: "system"
      });

      setCompanyInfo({
        name: profileData.companyName || "Acme Corporation",
        legalName: profileData.companyName ? `${profileData.companyName} Ltd` : "Acme Corp Pvt Ltd",
        taxId: "GSTIN-12AB34C", // Not yet in profile
        address: profileData.address || "123 Business Park, Tech City",
        country: "India",
        adminContact: user.email,
        phone: profileData.phone || "+91 98765 43210",
      });
    }
  }, [user]);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleted, setIsDeleted] = useState(false);

  // --- Handlers ---
  const handleMfaSetup = () => {
    if (mfaStep === 1) setMfaStep(2);
    else if (mfaStep === 2) setMfaStep(3);
    else {
      setMfaEnabled(true);
      setMfaModalOpen(false);
      setMfaStep(1); // Reset
      toast({ title: "MFA Enabled", description: "Two-factor authentication is now active." });
    }
  };

  const handleRequestExport = () => {
    setExportModalOpen(false);
    setExportStatus("preparing");
    toast({
      title: "Export started",
      description: "We're preparing your data. You'll be notified when it's ready.",
    });
    // Simulate async job
    setTimeout(() => {
      setExportStatus("ready");
      toast({
        title: "Export Ready",
        description: "Your data export is ready to download.",
      });
    }, 3000);
  };

  const handleSaveCompany = async () => {
    try {
      const updatedUser = await userService.updateMe({
        companyName: tempCompanyInfo.name,
        address: tempCompanyInfo.address,
        phone: tempCompanyInfo.phone
      });
      updateUser(updatedUser);
      setCompanyInfo(tempCompanyInfo);
      setEditCompanyOpen(false);
      toast({
        title: "Changes saved",
        description: "Company information has been updated.",
      });
    } catch (error: any) {
      console.error("Failed to update profile", error);
      const msg = error?.response?.data?.msg || error?.response?.data?.message || "Failed to save changes.";
      toast({
        title: "Error",
        description: msg,
        variant: "destructive"
      });
    }
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmText === "DELETE") {
      setIsDeleted(true);
      setDeleteOpen(false);
      setDeleteConfirmText("");
      window.scrollTo({ top: 0, behavior: "smooth" });
      toast({
        title: "Account Scheduled for Deletion",
        description: "You will receive an email confirmation shortly.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Deletion Failed",
        description: "Please type 'DELETE' to confirm.",
        variant: "destructive",
      });
    }
  };

  // --- Scroll Spy for Active Section ---
  useEffect(() => {
    const handleScroll = () => {
      const sections = SECTIONS.map((s) => document.getElementById(s.id));
      const scrollPosition = window.scrollY + 150; // Offset

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(SECTIONS[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: "smooth",
      });
      setActiveSection(id);
    }
  };

  return (
    <div className="animate-fade-in space-y-8 pb-20 relative">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground text-lg">
          Manage company information and compliance settings
        </p>
        {isDeleted && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-lg border border-destructive/20 mt-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertTriangle className="h-5 w-5" />
            <div>
              <p className="font-semibold">Account Pending Deletion</p>
              <p className="text-sm opacity-90">Your account is scheduled for deletion in 30 days. Contact support to cancel.</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (Main Content) */}
        <div className="lg:col-span-8 space-y-10">

          {/* Sticky Nav (Mobile/Desktop mix logic, mainly Desktop here) */}
          <div className="sticky top-20 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2 -mx-4 px-4 lg:-mx-0 lg:px-0 border-b lg:border-none lg:hidden overflow-x-auto selection-nav">
          </div>


          {/* 1. COMPANY SECTION */}
          <div id="company" className="scroll-mt-28 space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" /> Company Information
            </h2>
            <div className="dashboard-card overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-bold text-lg">{companyInfo.name}</h3>
                  <p className="text-muted-foreground">{companyInfo.legalName}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => {
                  setTempCompanyInfo(companyInfo);
                  setEditCompanyOpen(true);
                }}>
                  Edit
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Tax ID / GST</Label>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-medium">
                      {showTaxId ? companyInfo.taxId : "•".repeat(companyInfo.taxId.length)}
                    </span>
                    <button
                      onClick={() => setShowTaxId(!showTaxId)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showTaxId ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Location</Label>
                  <p className="font-medium">{companyInfo.address}, {companyInfo.country}</p>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Contact</Label>
                  <div className="flex flex-col">
                    <span className="font-medium">{companyInfo.adminContact}</span>
                    <span className="text-sm text-muted-foreground">{companyInfo.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. DATA & COMPLIANCE SECTION */}
          <div id="compliance" className="scroll-mt-28 space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" /> Data & Compliance
            </h2>
            <div className="grid gap-6">

              {/* Data Residency */}
              <div className="dashboard-card">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-info/10 text-info mt-1 sm:mt-0">
                      <Globe className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Data Residency</h3>
                      <p className="text-muted-foreground text-sm">
                        Your data is currently stored in <span className="font-medium text-foreground">India (Mumbai)</span>.
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setSupportModalOpen(true)}>
                    Contact Support
                  </Button>
                </div>
                <div className="mt-4 p-3 bg-muted/40 rounded-lg text-xs text-muted-foreground">
                  To change your data region, please contact our support team. Enterprise plans include multi-region support.
                </div>
              </div>

              {/* Export Data */}
              <div className="dashboard-card">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-accent/10 text-accent mt-1 sm:mt-0">
                      <Download className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Export Data (GDPR)</h3>
                      <p className="text-muted-foreground text-sm">
                        Download a copy of your personal and company data.
                      </p>
                    </div>
                  </div>
                  <div>
                    {exportStatus === "idle" && (
                      <Button variant="outline" onClick={() => setExportModalOpen(true)}>Request Export</Button>
                    )}
                    {exportStatus === "preparing" && (
                      <Button disabled variant="outline">
                        <Clock className="mr-2 h-4 w-4 animate-spin" /> Preparing...
                      </Button>
                    )}
                    {exportStatus === "ready" && (
                      <Button className="bg-success hover:bg-success/90 text-white">
                        <Download className="mr-2 h-4 w-4" /> Download Zip
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* DPA / Agreements */}
              <div className="dashboard-card">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-warning/10 text-warning mt-1 sm:mt-0">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">DPA & Agreements</h3>
                      <p className="text-muted-foreground text-sm">
                        Review and manage your Data Processing Agreements.
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => toast({ title: "Request Sent", description: "Our legal team will contact you." })}>
                    Request DPA
                  </Button>
                </div>
              </div>

            </div>
          </div>

          {/* 3. AUDIT & Logs SECTION */}
          <div id="audit" className="scroll-mt-28 space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <History className="h-5 w-5 text-primary" /> Audit & Logs
            </h2>
            <div className="dashboard-card">
              <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Input type="date" className="w-[150px]" />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <Button variant="outline" size="sm" onClick={() => toast({ title: "Exporting CSV", description: "Audit logs are being downloaded." })}>
                    <Download className="h-4 w-4 mr-2" /> Export CSV
                  </Button>
                </div>
              </div>

              <div className="rounded-md border">
                <div className="grid grid-cols-12 bg-muted/50 p-3 text-xs font-medium text-muted-foreground uppercase tracking-wider border-b">
                  <div className="col-span-3">Action</div>
                  <div className="col-span-3">User</div>
                  <div className="col-span-3">Details</div>
                  <div className="col-span-3 text-right">Time</div>
                </div>
                <div className="divide-y max-h-[400px] overflow-y-auto">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="grid grid-cols-12 p-3 text-sm hover:bg-muted/30 transition-colors">
                      <div className="col-span-3 font-medium">{log.action}</div>
                      <div className="col-span-3 text-muted-foreground truncate">{log.user}</div>
                      <div className="col-span-3 text-muted-foreground truncate">{log.details}</div>
                      <div className="col-span-3 text-right text-muted-foreground font-mono text-xs">{log.timestamp}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 4. SECURITY & MFA SECTION */}
          <div id="security" className="scroll-mt-28 space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" /> Security & MFA
            </h2>
            <div className="dashboard-card space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${mfaEnabled ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'} mt-1 sm:mt-0`}>
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Multi-Factor Authentication</h3>
                    <p className="text-muted-foreground text-sm">
                      Add an extra layer of security to your account.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {mfaEnabled ? (
                    <>
                      <Badge variant="secondary" className="bg-success/10 text-success hover:bg-success/20">Enabled</Badge>
                      <Button variant="outline" size="sm" onClick={() => {
                        if (confirm("Disable MFA?")) { setMfaEnabled(false); toast({ title: "MFA Disabled" }); }
                      }}>Disable</Button>
                    </>
                  ) : (
                    <Button onClick={() => { setMfaStep(1); setMfaModalOpen(true); }}>Configure MFA</Button>
                  )}
                </div>
              </div>

              <div className="h-px bg-border" />

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Session Timeout (minutes)</Label>
                  <div className="flex gap-2">
                    <Input type="number" defaultValue="30" className="w-[100px]" />
                    <Button variant="outline" size="sm" onClick={() => toast({ title: "Saved", description: "Session policy updated." })}>Save</Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label className="base">Remember Trusted Devices</Label>
                    <p className="text-xs text-muted-foreground">Skip MFA on known devices for 30 days</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </div>

          {/* 5. PROFILE & PREFERENCES SECTION */}
          <div id="profile" className="scroll-mt-28 space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <User className="h-5 w-5 text-primary" /> Profile & Preferences
            </h2>
            <div className="dashboard-card space-y-8">

              {/* Avatar & Basics */}
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-background shadow-sm">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" className="h-full w-full object-cover" />
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <Upload className="h-3 w-3 mr-2" /> Change
                  </Button>
                </div>
                <div className="flex-1 grid gap-4 sm:grid-cols-2 w-full">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input
                      value={profile.firstName}
                      onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input
                      value={profile.lastName}
                      onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={profile.email} disabled className="bg-muted/50" />
                  </div>
                  <div className="space-y-2">
                    <Label>Job Title</Label>
                    <Input
                      value={profile.jobTitle}
                      onChange={(e) => setProfile({ ...profile, jobTitle: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="h-px bg-border" />

              {/* Notifications & Language */}
              <div className="grid gap-8 sm:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Notifications</h3>
                  <div className="space-y-3">
                    {["Billing Alerts", "Security Alerts", "Product Updates", "Weekly Reports"].map((item) => (
                      <div key={item} className="flex items-center justify-between">
                        <span className="text-sm">{item}</span>
                        <Switch defaultChecked={item !== "Weekly Reports"} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Appearance</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Theme</span>
                      <Select defaultValue="system">
                        <SelectTrigger className="w-[140px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Language</span>
                      <Select defaultValue="en">
                        <SelectTrigger className="w-[140px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English (US)</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="fr">Français</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={async () => {
                  try {
                    const fullName = `${profile.firstName} ${profile.lastName}`.trim();
                    const updatedUser = await userService.updateMe({
                      name: fullName
                      // Add other fields if backend supports them in root or profile object
                    });
                    updateUser(updatedUser);
                    toast({ title: "Profile Updated", description: "Your profile information has been saved." });
                  } catch (err) {
                    toast({ title: "Error", description: "Failed to save profile.", variant: "destructive" });
                  }
                }}>Save Changes</Button>
              </div>
            </div>
          </div>

          {/* 6. DELETE ACCOUNT SECTION */}
          <div className="space-y-4">
            <div className="dashboard-card border-destructive/30 bg-destructive/5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-destructive/10 text-destructive mt-1 sm:mt-0">
                    <Trash2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-destructive">Delete Account</h3>
                    <p className="text-destructive/80 text-sm">
                      Permanently delete your account and all data. This action cannot be undone.
                    </p>
                  </div>
                </div>
                <Button variant="destructive" onClick={() => setDeleteOpen(true)} disabled={isDeleted}>
                  {isDeleted ? "Deletion Scheduled" : "Delete Account"}
                </Button>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (Sidebar) */}
        <div className="lg:col-span-4 space-y-6 sticky top-24">

          {/* Navigation Menu (Desktop) */}
          <div className="hidden lg:block dashboard-card p-4">
            <div className="space-y-1">
              {SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    activeSection === section.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  <section.icon className="h-4 w-4" />
                  {section.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="dashboard-card space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Quick Actions</h3>
            <div className="flex flex-col gap-2">
              <Button variant="ghost" className="justify-start h-auto py-2 px-2" onClick={() => window.open('#support', '_self')}>
                <div className="p-2 rounded-lg bg-accent/10 text-accent mr-3">
                  <Mail className="h-4 w-4" />
                </div>
                Contact Support
              </Button>
              <Button variant="ghost" className="justify-start h-auto py-2 px-2">
                <div className="p-2 rounded-lg bg-info/10 text-info mr-3">
                  <CreditCard className="h-4 w-4" />
                </div>
                Billing Settings
              </Button>
              <Button variant="ghost" className="justify-start h-auto py-2 px-2">
                <div className="p-2 rounded-lg bg-success/10 text-success mr-3">
                  <FileText className="h-4 w-4" />
                </div>
                View Contracts
              </Button>
            </div>
          </div>

          {/* Account Status Widget */}
          <div className="dashboard-card bg-gradient-to-br from-primary/5 to-transparent border-primary/10">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className="bg-background">Pro Plan</Badge>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Seats Used</span>
                  <span className="font-medium">8 / 10</span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full bg-primary w-[80%]" />
                </div>
              </div>
              <div className="text-xs text-muted-foreground flex justify-between">
                <span>Next invoice: Dec 20, 2024</span>
                <a href="#" className="text-primary hover:underline">Manage</a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Edit Company Modal */}
      <Dialog open={editCompanyOpen} onOpenChange={setEditCompanyOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Company Information</DialogTitle>
            <DialogDescription>
              Update your company details. Legal changes may require verification.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Company Name</Label>
              <Input
                id="name"
                value={tempCompanyInfo.name}
                onChange={(e) => setTempCompanyInfo({ ...tempCompanyInfo, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="legalName">Legal Name</Label>
              <Input
                id="legalName"
                value={tempCompanyInfo.legalName}
                onChange={(e) => setTempCompanyInfo({ ...tempCompanyInfo, legalName: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="taxId">Tax ID / GST</Label>
              <Input
                id="taxId"
                value={tempCompanyInfo.taxId}
                onChange={(e) => setTempCompanyInfo({ ...tempCompanyInfo, taxId: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={tempCompanyInfo.address}
                onChange={(e) => setTempCompanyInfo({ ...tempCompanyInfo, address: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contact">Admin Contact</Label>
              <Input
                id="contact"
                value={tempCompanyInfo.adminContact}
                onChange={(e) => setTempCompanyInfo({ ...tempCompanyInfo, adminContact: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditCompanyOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveCompany}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Confirmation Modal */}
      <Dialog open={exportModalOpen} onOpenChange={setExportModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Data</DialogTitle>
            <DialogDescription>
              We will prepare an export of your account data. This may take up to 24 hours. You will receive a download link here.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setExportModalOpen(false)}>Cancel</Button>
            <Button onClick={handleRequestExport}>Request Export</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Support Ticket Modal */}
      <Dialog open={supportModalOpen} onOpenChange={setSupportModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Support</DialogTitle>
            <DialogDescription>
              Need help with data residency or compliance?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Label>Message</Label>
            <Textarea placeholder="Describe your request..." className="min-h-[100px]" defaultValue="Requesting data region change..." />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSupportModalOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              setSupportModalOpen(false);
              toast({ title: "Request Sent", description: "Support ticket created #TKT-492" });
            }}>Send Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MFA Configuration Modal */}
      <Dialog open={mfaModalOpen} onOpenChange={setMfaModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configure Two-Factor Authentication</DialogTitle>
            <DialogDescription>
              {mfaStep === 1 && "Scan the QR code with your authenticator app."}
              {mfaStep === 2 && "Enter the 6-digit code from your app."}
              {mfaStep === 3 && "Save these backup codes in a safe place."}
            </DialogDescription>
          </DialogHeader>

          <div className="py-6 flex flex-col items-center justify-center space-y-6">
            {mfaStep === 1 && (
              <>
                <div className="h-48 w-48 bg-white border-4 border-white p-2 shadow-sm rounded-lg">
                  {/* Mock QR */}
                  <div className="w-full h-full bg-black/80 flex items-center justify-center text-white text-xs">
                    [Mock QR Code]
                  </div>
                </div>
                <p className="text-sm text-muted-foreground text-center max-w-xs">
                  Open Google Authenticator or Authy and scan this code.
                </p>
              </>
            )}

            {mfaStep === 2 && (
              <div className="w-full max-w-xs space-y-4">
                <Input className="text-center text-2xl tracking-widest" placeholder="000 000" maxLength={6} />
              </div>
            )}

            {mfaStep === 3 && (
              <div className="w-full bg-muted p-4 rounded-lg grid grid-cols-2 gap-2 font-mono text-sm text-center">
                <span>8273-9182</span>
                <span>1928-3746</span>
                <span>9182-7364</span>
                <span>1029-3847</span>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setMfaModalOpen(false)}>Cancel</Button>
            <Button onClick={handleMfaSetup}>
              {mfaStep === 1 && "Start Setup"}
              {mfaStep === 2 && "Verify Code"}
              {mfaStep === 3 && "Enable MFA"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Delete Account
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your account,
              all projects, files, and data associated with your workspace.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2 space-y-4">
            <div className="bg-destructive/10 p-3 rounded-md text-sm text-destructive font-medium border border-destructive/20">
              Warning: All data will be wiped immediately.
            </div>
            <div className="space-y-2">
              <Label>Type <span className="font-mono font-bold">DELETE</span> to confirm</Label>
              <Input
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE"
                className="font-mono"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button
              variant="destructive"
              disabled={deleteConfirmText !== "DELETE"}
              onClick={handleDeleteAccount}
            >
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
