import { AlertCircle, Calendar, FileCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const notifications = [
  {
    id: 1,
    type: "urgent",
    title: "Invoice Overdue",
    description: "INV-2024-001 is 3 days past due. Please settle to avoid service interruption.",
    action: "Pay Now",
    icon: AlertCircle,
  },
  {
    id: 2,
    type: "reminder",
    title: "Upcoming Meeting",
    description: "Sprint Review with Venturemond team at 3:00 PM today",
    action: "Join Call",
    icon: Calendar,
  },
  {
    id: 3,
    type: "approval",
    title: "Approval Required",
    description: "2 deliverables awaiting your sign-off in Project Alpha",
    action: "Review",
    icon: FileCheck,
  },
];

export function NotificationsPanel() {
  return (
    <div className="dashboard-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title">Notifications</h2>
        <Badge variant="secondary" className="text-xs">
          {notifications.length} new
        </Badge>
      </div>
      <div className="space-y-3">
        {notifications.map((notification, index) => (
          <div
            key={notification.id}
            className={cn(
              "p-4 rounded-lg border",
              notification.type === "urgent" && "border-destructive/30 bg-destructive/5",
              notification.type === "reminder" && "border-info/30 bg-info/5",
              notification.type === "approval" && "border-warning/30 bg-warning/5",
              "animate-slide-up",
              `stagger-${index + 1}`
            )}
            style={{ opacity: 0 }}
          >
            <div className="flex items-start gap-3">
              <div className={cn(
                "p-2 rounded-lg flex-shrink-0",
                notification.type === "urgent" && "bg-destructive/10 text-destructive",
                notification.type === "reminder" && "bg-info/10 text-info",
                notification.type === "approval" && "bg-warning/10 text-warning",
              )}>
                <notification.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{notification.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{notification.description}</p>
                <Button size="sm" variant="link" className="px-0 h-auto mt-2 text-xs">
                  {notification.action} →
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
