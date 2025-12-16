import React from "react";
import {
  FolderKanban,
  Clock,
  LifeBuoy,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Trend = "up" | "down" | "neutral";

// Mock Data for Charts
const projectData = [
  { name: "Mon", value: 2 },
  { name: "Tue", value: 3 },
  { name: "Wed", value: 2 },
  { name: "Thu", value: 4 },
  { name: "Fri", value: 3 },
  { name: "Sat", value: 5 },
  { name: "Sun", value: 4 },
];

const actionData = [
  { name: "Mon", value: 4 },
  { name: "Tue", value: 3 },
  { name: "Wed", value: 6 },
  { name: "Thu", value: 4 },
  { name: "Fri", value: 7 },
  { name: "Sat", value: 5 },
  { name: "Sun", value: 8 },
];

const ticketData = [
  { name: "Mon", value: 1 },
  { name: "Tue", value: 2 },
  { name: "Wed", value: 0 },
  { name: "Thu", value: 2 },
  { name: "Fri", value: 1 },
  { name: "Sat", value: 0 },
  { name: "Sun", value: 2 },
];

const mrrData = [
  { name: "Jan", value: 2000 },
  { name: "Feb", value: 2500 },
  { name: "Mar", value: 2400 },
  { name: "Apr", value: 3000 },
  { name: "May", value: 3500 },
  { name: "Jun", value: 4250 },
];

const kpis = [
  {
    id: "active-projects",
    title: "Active Projects",
    value: 3,
    change: "+1 this month",
    trend: "up" as Trend,
    icon: FolderKanban,
    variant: "accent" as const,
    data: projectData,
    chartType: "area",
    chartColor: "#3b82f6", // Blue
  },
  {
    id: "pending-actions",
    title: "Pending Actions",
    value: 7,
    change: "Requires attention",
    trend: "neutral" as Trend,
    icon: Clock,
    variant: "warning" as const,
    hasUrgent: true,
    urgentLabel: "2 urgent",
    data: actionData,
    chartType: "bar",
    chartColor: "#f59e0b", // Amber
  },
  {
    id: "open-tickets",
    title: "Open Tickets",
    value: 2,
    change: "3 new this week",
    trend: "up" as Trend,
    icon: LifeBuoy,
    variant: "danger" as const,
    urgentCount: 0,
    data: ticketData,
    chartType: "bar",
    chartColor: "#ef4444", // Red
  },
  {
    id: "current-mrr",
    title: "Current MRR",
    value: 4250,
    change: "+12% growth",
    trend: "up" as Trend,
    icon: DollarSign,
    variant: "success" as const,
    isCurrency: true,
    currency: "INR",
    data: mrrData,
    chartType: "area",
    chartColor: "#10b981", // Emerald
  },
];

function formatValue(kpi: any) {
  if (kpi.isCurrency) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: kpi.currency || "USD",
      maximumFractionDigits: 0,
    }).format(kpi.value);
  }
  return String(kpi.value);
}

// ... imports ...

export function KPICards({ stats }: { stats?: { activeProjects: number, pendingActions: number, openTickets: number, mrr: number } }) {
  // Use passed stats or defaults
  const values = stats || { activeProjects: 0, pendingActions: 0, openTickets: 0, mrr: 0 };

  const kpis = [
    {
      id: "active-projects",
      title: "Active Projects",
      value: values.activeProjects,
      change: "Updated just now",
      trend: "up" as Trend,
      icon: FolderKanban,
      variant: "accent" as const,
      data: projectData,
      chartType: "area",
      chartColor: "#3b82f6",
    },
    {
      id: "pending-actions",
      title: "Pending Actions",
      value: values.pendingActions,
      change: values.pendingActions > 0 ? "Requires attention" : "All caught up",
      trend: "neutral" as Trend,
      icon: Clock,
      variant: "warning" as const,
      hasUrgent: values.pendingActions > 0,
      urgentLabel: `${values.pendingActions} urgent`,
      data: actionData,
      chartType: "bar",
      chartColor: "#f59e0b",
    },
    {
      id: "open-tickets",
      title: "Open Tickets",
      value: values.openTickets,
      change: "Standard SLA",
      trend: "up" as Trend,
      icon: LifeBuoy,
      variant: "danger" as const,
      urgentCount: 0,
      data: ticketData,
      chartType: "bar",
      chartColor: "#ef4444",
    },
    {
      id: "current-mrr",
      title: "Total Orders Value", // Changed from MRR to Total Value to match logic
      value: values.mrr,
      change: "Cumulative",
      trend: "up" as Trend,
      icon: DollarSign,
      variant: "success" as const,
      isCurrency: true,
      currency: "USD", // Logic in Dashboard sums total which might be mixed, defaulting USD/INR? Dashboard summed raw total. Assuming USD based on mock.
      data: mrrData,
      chartType: "area",
      chartColor: "#10b981",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi, index) => {
        // ... rendering ... (mostly same)

        const Icon = kpi.icon;
        const trendColor =
          kpi.trend === "up" ? "text-emerald-500" : kpi.trend === "down" ? "text-red-500" : "text-muted-foreground";

        return (
          <article
            key={kpi.id}
            className={cn(
              "group relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md",
              "animate-fade-in-up",
              `delay-${index}`
            )}
          >
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
              <div className={cn("rounded-full p-2 bg-secondary/50 group-hover:bg-primary/10 transition-colors")}>
                <Icon className={cn("h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors")} />
              </div>
            </div>

            <div className="flex items-baseline space-x-2">
              <div className="text-3xl font-bold tracking-tight">{formatValue(kpi)}</div>
              <div className={cn("flex items-center text-xs font-medium", trendColor)}>
                {kpi.change}
                {kpi.trend === "up" && <TrendingUp className="ml-1 h-3 w-3" />}
                {kpi.trend === "down" && <TrendingDown className="ml-1 h-3 w-3" />}
              </div>
            </div>

            {/* Chart Section */}
            <div className="h-[80px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                {kpi.chartType === "area" ? (
                  <AreaChart data={kpi.data}>
                    <defs>
                      <linearGradient id={`color-${kpi.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={kpi.chartColor} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={kpi.chartColor} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={kpi.chartColor}
                      fillOpacity={1}
                      fill={`url(#color-${kpi.id})`}
                      strokeWidth={2}
                    />
                  </AreaChart>
                ) : (
                  <BarChart data={kpi.data}>
                    <Bar
                      dataKey="value"
                      fill={kpi.chartColor}
                      radius={[4, 4, 0, 0]}
                      barSize={index === 1 ? 6 : undefined} // Thinner bars for Pending Actions
                    />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Footer Badge for Urgent items */}
            {kpi.hasUrgent && (
              <div className="absolute top-4 left-[50%] translate-x-[-50%] md:translate-x-0 md:static md:mt-2 md:flex justify-start hidden">
                {/* Hidden on mobile default, adjusted layout logic needed? 
                            Actually let's just put it below chart or overlay. 
                            Let's keep it clean. Replacing chart area might crowd it.
                            Let's overlay it or place it next to title?
                        */}
              </div>
            )}
            {kpi.hasUrgent && (
              <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400">
                <AlertCircle className="h-3 w-3" />
                <span>{kpi.urgentLabel}</span>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
