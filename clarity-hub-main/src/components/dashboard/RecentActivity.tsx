import { FileUp, CheckCircle2, MessageSquare, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const activities = [
  {
    id: 1,
    type: "file",
    title: "Design mockups uploaded",
    description: "Project Alpha - 5 files",
    time: "10 minutes ago",
    icon: FileUp,
  },
  {
    id: 2,
    type: "milestone",
    title: "Milestone completed",
    description: "Project Beta - Phase 1 Approved",
    time: "2 hours ago",
    icon: CheckCircle2,
  },
  {
    id: 3,
    type: "comment",
    title: "New comment on deliverable",
    description: "Sarah mentioned you in API Docs",
    time: "4 hours ago",
    icon: MessageSquare,
  },
  {
    id: 4,
    type: "update",
    title: "Project timeline updated",
    description: "Project Gamma - Sprint 3 extended",
    time: "Yesterday",
    icon: Clock,
  },
];

export function RecentActivity() {
  return (
    <div className="dashboard-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title">Recent Activity</h2>
        <button className="text-sm text-accent hover:underline">View all</button>
      </div>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className={cn(
              "flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer",
              "animate-slide-up",
              `stagger-${index + 1}`
            )}
            style={{ opacity: 0 }}
          >
            <div className={cn(
              "p-2 rounded-lg flex-shrink-0",
              activity.type === "file" && "bg-info/10 text-info",
              activity.type === "milestone" && "bg-success/10 text-success",
              activity.type === "comment" && "bg-accent/10 text-accent",
              activity.type === "update" && "bg-warning/10 text-warning",
            )}>
              <activity.icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{activity.title}</p>
              <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {activity.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
