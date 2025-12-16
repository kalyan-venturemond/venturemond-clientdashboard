import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AuthProvider } from "@/context/AuthContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";


import Landing from "./pages/Landing";
import Catalog from "./pages/Catalog";
import About from "./pages/company/About";
import Contact from "./pages/company/Contact";
import Careers from "./pages/company/Careers";
import Terms from "./pages/legal/Terms";
import Privacy from "./pages/legal/Privacy";

import Dashboard from "./pages/Dashboard";
import Services from "./pages/Services";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Files from "./pages/Files";
import Team from "./pages/Team";
import Billing from "./pages/Billing";
import InvoiceDetail from "./pages/InvoiceDetail";
import Analytics from "./pages/Analytics";
import Support from "./pages/Support";
import TicketDetail from "./pages/TicketDetail";
import Integrations from "./pages/Integrations";
import Account from "./pages/Account";
import Onboarding from "./pages/auth/Onboarding";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";

const queryClient = new QueryClient();

// Protected Route Component (Optional/Simple implementation)
// const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
//   // In a real app, check auth state here
//   return <>{children}</>;
// };

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <CurrencyProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/signup" element={<Signup />} />
              <Route path="/auth/forgot-password" element={<ForgotPassword />} />

              {/* Public Catalog/Pricing */}
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/pricing" element={<Catalog />} />

              {/* Company & Legal */}
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              {/* Reuse Support for public or creates separate? User asked for footer link "Support Center".
                  Existing Support page is in Dashboard. I'll create a public redirect or simple page if needed,
                  but for now let's map /support to Contact or a new PublicSupport if critical.
                  Wait, /support is already a dashboard route.
                  I will make /support-center public or just use Contact for now to avoid conflicts if /support is protected below.
                  Actually, let's check DashboardLayout. It likely protects /support.
                  I will add /status as a placeholder too. */}
              <Route path="/status" element={<Contact />} /> {/* Placeholder */}

              <Route path="/onboarding" element={<Onboarding />} />

              {/* Dashboard Routes - Protected */}
              <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/overview" element={<Navigate to="/dashboard" replace />} />

                  <Route path="/services" element={<Services />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/projects/:id" element={<ProjectDetail />} />
                  <Route path="/files" element={<Files />} />
                  <Route path="/team" element={<Team />} />
                  <Route path="/billing" element={<Billing />} />
                  <Route path="/billing/invoices/:id" element={<InvoiceDetail />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/support" element={<Support />} />
                  <Route path="/support/:id" element={<TicketDetail />} />
                  <Route path="/integrations" element={<Integrations />} />
                  <Route path="/account" element={<Account />} />
                </Route>
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </CurrencyProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
