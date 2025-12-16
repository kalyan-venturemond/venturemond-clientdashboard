import { CheckCircle2, Activity } from "lucide-react";

export function HealthStatus() {
  return (
    <div className="dashboard-card bg-success/5 border-success/20">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-success/10">
          <CheckCircle2 className="h-5 w-5 text-success" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">All Systems Operational</span>
            <span className="flex items-center gap-1 text-xs text-success">
              <Activity className="h-3 w-3" />
              99.9% uptime
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Your workspace instances are running smoothly
          </p>
        </div>
      </div>
    </div>
  );
}
