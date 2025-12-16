import { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  HardDrive,
  Activity,
  Download,
  Calendar,
  Clock,
  Layout,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { AnalyticsDrillDown } from "@/components/analytics/AnalyticsDrillDown";
import { useToast } from "@/hooks/use-toast";

// Mock Data
const storageData = [
  { month: "Jan", used: 35 },
  { month: "Feb", used: 38 },
  { month: "Mar", used: 42 },
  { month: "Apr", used: 45 },
  { month: "May", used: 48 },
  { month: "Jun", used: 52 },
];

const activeUsersData = [
  { day: "Mon", users: 18 },
  { day: "Tue", users: 22 },
  { day: "Wed", users: 20 },
  { day: "Thu", users: 24 },
  { day: "Fri", users: 19 },
  { day: "Sat", users: 8 },
  { day: "Sun", users: 5 },
];

const fileActivityData = [
  { month: "Jan", uploads: 145, downloads: 230 },
  { month: "Feb", uploads: 180, downloads: 290 },
  { month: "Mar", uploads: 165, downloads: 310 },
  { month: "Apr", uploads: 210, downloads: 340 },
  { month: "May", uploads: 195, downloads: 320 },
  { month: "Jun", uploads: 240, downloads: 380 },
];

const projectStatusData = [
  { name: "Completed", value: 8, color: "hsl(142, 71%, 45%)" },
  { name: "In Progress", value: 3, color: "hsl(199, 89%, 48%)" },
  { name: "Planning", value: 2, color: "hsl(38, 92%, 50%)" },
];

const slaData = [
  { month: "Jan", response: 2.1, target: 2 },
  { month: "Feb", response: 1.8, target: 2 },
  { month: "Mar", response: 2.3, target: 2 },
  { month: "Apr", response: 1.9, target: 2 },
  { month: "May", response: 1.5, target: 2 },
  { month: "Jun", response: 1.4, target: 2 },
];

const taskThroughputData = [
  { month: "Jan", started: 12, completed: 10 },
  { month: "Feb", started: 15, completed: 13 },
  { month: "Mar", started: 18, completed: 14 },
  { month: "Apr", started: 14, completed: 16 },
  { month: "May", started: 20, completed: 18 },
  { month: "Jun", started: 22, completed: 21 },
];

import { analyticsService, AnalyticsData } from "@/lib/analytics";

// Stats are now fetched, but we keep mock data ONLY for charts that don't have backend support yet
// ... (keep chart mocks down below)

export default function Analytics() {
  const [period, setPeriod] = useState("30d");
  const [loading, setLoading] = useState(false);
  const [drillDownType, setDrillDownType] = useState<"storage" | "files" | "users" | "sla" | null>(null);
  const { toast } = useToast();
  const [stats, setStats] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const data = await analyticsService.getAnalytics();
        setStats(data);
      } catch (err) {
        console.error("Failed to load analytics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [period]);

  const handleExport = () => {
    toast({
      title: "Exporting Data",
      description: "Your CSV export has started. Check downloads shortly.",
    });
  };

  const kpis = [
    {
      title: "Total Revenue",
      value: stats ? `₹${stats.totalRevenue.toLocaleString()}` : "...",
      subLabel: "Gross Volume",
      change: "+12%", // Mock trend
      trend: "up",
      icon: HardDrive, // Replace with appropriate icon if needed, e.g. Dollar/Rupee
      color: "accent",
      action: () => setDrillDownType("storage"), // reusing storage drilldown for now or disable
    },
    {
      title: "Active Projects",
      value: stats ? stats.totalProjects.toString() : "...",
      subLabel: "In Progress",
      change: "+5%",
      trend: "up",
      icon: Activity,
      color: "info",
      action: null,
    },
    {
      title: "Total Orders",
      value: stats ? stats.totalOrders.toString() : "...",
      subLabel: "Lifetime",
      change: "+8%",
      trend: "up",
      icon: Users, // Placeholder
      color: "success",
      action: () => setDrillDownType("users"),
    },
    {
      title: "Seats Used (Mock)",
      value: "12 / 25",
      subLabel: "48% Utilization",
      change: "+1",
      trend: "up",
      icon: Layout,
      color: "warning",
      action: () => setDrillDownType("users"),
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Analytics & Usage</h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-muted-foreground">
              Track your workspace usage and performance
            </p>
            <span className="text-xs text-muted-foreground/60">• Last updated: Just now</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-36">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, index) => (
          <div
            key={kpi.title}
            className={cn(
              "dashboard-card animate-slide-up group cursor-pointer transition-all hover:scale-[1.02] hover:shadow-md",
              `stagger-${index + 1}`,
              loading && "opacity-60"
            )}
            style={{ opacity: loading ? 0.6 : 1 }}
            onClick={kpi.action}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">{kpi.title}</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-2xl font-bold">{kpi.value}</p>
                  <span
                    className={cn(
                      "text-xs font-medium flex items-center",
                      kpi.trend === "up" && kpi.color !== "warning" ? "text-success" : kpi.trend === "down" && kpi.color === "warning" ? "text-success" : "text-warning"
                    )}
                  >
                    {kpi.change}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{kpi.subLabel}</p>
              </div>
              <div
                className={cn(
                  "p-2.5 rounded-xl transition-colors group-hover:bg-opacity-20",
                  kpi.color === "accent" && "bg-accent/10 text-accent",
                  kpi.color === "success" && "bg-success/10 text-success",
                  kpi.color === "info" && "bg-info/10 text-info",
                  kpi.color === "warning" && "bg-warning/10 text-warning"
                )}
              >
                <kpi.icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={cn("grid gap-8 lg:grid-cols-3", loading && "opacity-60 pointer-events-none")}>
        {/* Left Column (Larger) */}
        <div className="space-y-8 lg:col-span-2">
          {/* Storage Usage Chart */}
          <div className="dashboard-card h-[340px] flex flex-col cursor-pointer hover:border-primary/20 transition-colors" onClick={() => setDrillDownType("storage")}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="section-title">Storage Usage</h3>
              <Button variant="ghost" size="icon-sm" className="hidden group-hover:flex"><Activity className="h-4 w-4 text-muted-foreground" /></Button>
            </div>
            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={storageData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} unit=" GB" tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1, strokeDasharray: '4 4' }}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="used"
                    stroke="hsl(var(--accent))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--background))", stroke: "hsl(var(--accent))", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* File Activity Chart */}
          <div className="dashboard-card h-[340px] flex flex-col cursor-pointer hover:border-primary/20 transition-colors" onClick={() => setDrillDownType("files")}>
            <h3 className="section-title mb-4">File Activity</h3>
            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fileActivityData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: 'hsl(var(--muted)/0.3)' }}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="uploads" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} name="Uploads" />
                  <Bar dataKey="downloads" fill="hsl(var(--info))" radius={[4, 4, 0, 0]} name="Downloads" />
                  <Legend iconType="circle" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Task Throughput (Optional from requirements) */}
          <div className="dashboard-card h-[300px] flex flex-col">
            <h3 className="section-title mb-4">Task Throughput</h3>
            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={taskThroughputData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: "8px" }} />
                  <Bar dataKey="completed" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} name="Completed" stackId="a" />
                  <Bar dataKey="started" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} name="New Started" stackId="a" />
                  <Legend iconType="circle" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column (Smaller) */}
        <div className="space-y-8">
          {/* Active Users Weekly */}
          <div className="dashboard-card h-[300px] flex flex-col">
            <h3 className="section-title mb-4">User Activity (Weekly)</h3>
            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activeUsersData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: "8px" }} />
                  <Bar dataKey="users" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Project Status */}
          <div className="dashboard-card h-[300px] flex flex-col">
            <h3 className="section-title mb-4">Project Status</h3>
            <div className="flex-1 w-full min-h-0 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={projectStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {projectStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: "8px" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <span className="text-2xl font-bold block">{projectStatusData.reduce((a, b) => a + b.value, 0)}</span>
                  <span className="text-xs text-muted-foreground">Projects</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-4 text-xs mt-2">
              {projectStatusData.map(item => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </div>
              ))}
            </div>
          </div>

          {/* SLA Timeline */}
          <div className="dashboard-card h-[300px] flex flex-col cursor-pointer hover:border-warning/50 transition-colors" onClick={() => setDrillDownType("sla")}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="section-title">SLA Trends</h3>
              {slaData.some(d => d.response > d.target) && (
                <div className="flex items-center gap-1 text-[10px] bg-destructive/10 text-destructive px-2 py-1 rounded-full animate-pulse">
                  <AlertCircle className="h-3 w-3" />
                  Breach Detected
                </div>
              )}
            </div>
            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={slaData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} unit="h" tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: "8px" }} />
                  <Line
                    type="step"
                    dataKey="label"
                    stroke="transparent" // hidden line for target logic if needed
                  />
                  {/* Target Line Simulation using RefLine or just compare in rendering. For simple line chart: */}
                  <Line
                    type="monotone"
                    dataKey="response"
                    stroke="hsl(var(--warning))"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Avg Response"
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="hsl(var(--muted-foreground))"
                    strokeWidth={1}
                    strokeDasharray="4 4"
                    dot={false}
                    name="Target (2h)"
                  />
                  <Legend />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <AnalyticsDrillDown open={!!drillDownType} onOpenChange={(val) => !val && setDrillDownType(null)} type={drillDownType} />
    </div>
  );
}

