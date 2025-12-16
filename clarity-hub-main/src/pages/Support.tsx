import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Clock,
  MessageSquare,
  Book,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  CheckCircle2,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { CreateTicketDialog } from "@/components/support/CreateTicketDialog";

// Mock Data
// Mock Data removed
const tickets: any[] = [];

const faqs = [
  {
    question: "How do I invite team members?",
    answer:
      "Go to Team & Users page, click 'Invite Member', enter their email and select a role. They'll receive an invitation email to join your workspace.",
  },
  {
    question: "How do I change my subscription plan?",
    answer:
      "Navigate to Billing, click on your current plan, and select 'Upgrade' or 'Downgrade'. Changes take effect at your next billing cycle.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept major credit/debit cards (Visa, Mastercard, Amex), UPI for Indian customers, and bank transfers for enterprise accounts.",
  },
  {
    question: "How do I export my data?",
    answer:
      "Go to Account settings, find the 'Export Data' section, and click 'Request Export'. You'll receive a download link within 24 hours.",
  },
  {
    question: "What's your SLA for support tickets?",
    answer:
      "High priority: 8 hours, Medium priority: 24 hours, Low priority: 72 hours. Priority support add-on reduces these by 50%.",
  },
];

const statusConfig = {
  open: { label: "Open", color: "bg-destructive/10 text-destructive", icon: AlertCircle },
  "in-progress": { label: "In Progress", color: "bg-info/10 text-info", icon: Clock },
  pending: { label: "Pending", color: "bg-warning/10 text-warning", icon: Clock },
  resolved: { label: "Resolved", color: "bg-success/10 text-success", icon: CheckCircle2 },
};

const priorityConfig = {
  high: { label: "High", color: "text-destructive bg-destructive/10" },
  medium: { label: "Medium", color: "text-warning bg-warning/10" },
  low: { label: "Low", color: "text-muted-foreground bg-secondary" },
};

import { ticketsService } from "@/lib/tickets";

export default function Support() {
  const [createOpen, setCreateOpen] = useState(false);
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<any[]>([]);

  useState(() => {
    ticketsService.listMine().then(setTickets).catch(console.error);
  });

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Support</h1>
          <p className="text-muted-foreground mt-1">
            Get help and manage support tickets
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="shadow-lg shadow-primary/20">
          <Plus className="h-4 w-4 mr-2" />
          Create Ticket
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="dashboard-card group cursor-pointer hover:border-accent/40 transition-all hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-accent/10 text-accent group-hover:scale-110 transition-transform">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold text-lg">Live Chat</p>
              <p className="text-sm text-muted-foreground">Chat with our team</p>
            </div>
          </div>
        </div>
        <div className="dashboard-card group cursor-pointer hover:border-info/40 transition-all hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-info/10 text-info group-hover:scale-110 transition-transform">
              <Book className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold text-lg">Documentation</p>
              <p className="text-sm text-muted-foreground">Browse knowledge base</p>
            </div>
          </div>
        </div>
        <div className="dashboard-card group cursor-pointer hover:border-success/40 transition-all hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-success/10 text-success group-hover:scale-110 transition-transform">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold text-lg">System Status</p>
              <p className="text-sm text-success font-medium">All systems operational</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Management Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="section-title">Ticket History</h2>
          {/* Search Bar */}
          <div className="relative w-full max-w-xs md:max-w-sm hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search tickets..." className="pl-9 bg-background/50" />
          </div>
        </div>

        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
          {/* Mobile Search - Visible only on mobile */}
          <div className="p-4 sm:hidden border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search tickets..." className="pl-9 bg-secondary/20" />
            </div>
          </div>

          {/* Ticket List Header (Desktop) */}
          <div className="hidden sm:grid grid-cols-12 gap-4 p-4 border-b bg-muted/30 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <div className="col-span-6 md:col-span-5">Ticket</div>
            <div className="col-span-3 md:col-span-2">Priority</div>
            <div className="col-span-3 md:col-span-2">Status</div>
            <div className="hidden md:block col-span-2">SLA / Created</div>
            <div className="hidden md:flex col-span-1 justify-end">Actions</div>
          </div>

          {/* Tickets */}
          <div className="divide-y">
            {tickets.map((ticket: any) => (
              <div
                key={ticket._id}
                className="group flex flex-col sm:grid sm:grid-cols-12 gap-3 sm:gap-4 p-4 hover:bg-muted/30 transition-colors cursor-pointer"
                onClick={() => navigate(`/support/${ticket._id}`)}
              >
                {/* Subject & ID */}
                <div className="sm:col-span-6 md:col-span-5">
                  <div className="flex items-start gap-3">
                    <div className={cn("mt-1 p-1.5 rounded-full flex-shrink-0", (statusConfig[ticket.status as keyof typeof statusConfig] || statusConfig.open).color.replace('text-', 'bg-opacity-10 '))} >
                      {(() => {
                        const Icon = (statusConfig[ticket.status as keyof typeof statusConfig] || statusConfig.open).icon;
                        return <Icon className="h-4 w-4" />;
                      })()}
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {ticket.subject}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <span className="font-mono">{(ticket._id || "").substring(0, 8)}</span>
                        <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                        <span>Support Ticket</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Priority (Desktop) / Badges Row (Mobile) */}
                <div className="sm:col-span-3 md:col-span-2 flex items-center mt-1 sm:mt-0 pl-[3.25rem] sm:pl-0">
                  <Badge variant="secondary" className={cn("font-normal text-xs capitalize", priorityConfig.medium.color)}>
                    Medium Priority
                  </Badge>
                </div>

                {/* Status (Desktop) */}
                <div className="hidden sm:flex sm:col-span-3 md:col-span-2 items-center">
                  <Badge className={cn("font-medium capitalize", (statusConfig[ticket.status as keyof typeof statusConfig] || statusConfig.open).color)}>
                    {(statusConfig[ticket.status as keyof typeof statusConfig] || statusConfig.open).label}
                  </Badge>
                </div>

                {/* Metadata / SLA */}
                <div className="hidden md:flex col-span-2 flex-col justify-center text-sm">
                  <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-1 opacity-50">
                    <Clock className="h-3 w-3" />
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </div>
                  <span className="text-xs text-muted-foreground">{new Date(ticket.createdAt).toLocaleTimeString()}</span>
                </div>

                {/* Mobile Footer Info */}
                <div className="flex sm:hidden items-center justify-between text-xs text-muted-foreground mt-2 pl-[3.25rem] border-t pt-3">
                  <div className="flex items-center gap-2">
                    <Badge className={cn("font-medium capitalize", (statusConfig[ticket.status as keyof typeof statusConfig] || statusConfig.open).color)}>
                      {(statusConfig[ticket.status as keyof typeof statusConfig] || statusConfig.open).label}
                    </Badge>
                    <span>• {new Date(ticket.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Action Arrow (Desktop) */}
                <div className="hidden md:flex col-span-1 items-center justify-end text-muted-foreground">
                  <ChevronRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="dashboard-card">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <HelpCircle className="h-5 w-5" />
          </div>
          <h2 className="section-title mb-0">Frequently Asked Questions</h2>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-b-muted/50 last:border-0">
              <AccordionTrigger className="text-left font-medium hover:text-primary transition-colors py-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Create Ticket Modal */}
      <CreateTicketDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
