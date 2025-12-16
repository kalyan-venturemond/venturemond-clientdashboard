import { useState, useEffect } from "react";
import { KPICards } from "@/components/dashboard/KPICards";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { NotificationsPanel } from "@/components/dashboard/NotificationsPanel";
import { HealthStatus } from "@/components/dashboard/HealthStatus";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { ordersService, Order } from "@/lib/orders";

export default function Dashboard() {
  const [stats, setStats] = useState({
    activeProjects: 0,
    pendingActions: 0,
    openTickets: 0, // Mock
    mrr: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orders = await ordersService.getOrders();

        const activeProjects = orders.filter(o => o.subscription && (o.status === 'paid' || o.status === 'active')).length;
        const pendingActions = orders.filter(o => o.status === 'pending').length; // Unpaid invoices

        // Calculate MRR (simple sum of active subscriptions)
        // Assuming subscription items have price in USD or converted. 
        // For now, simple sum of totals of subscription orders
        const mrr = orders
          .filter(o => o.subscription && (o.status === 'paid' || o.status === 'active'))
          .reduce((sum, o) => sum + o.total, 0);

        setStats({
          activeProjects,
          pendingActions,
          openTickets: 2, // Mock
          mrr
        });
      } catch (e) {
        console.error("Failed to fetch dashboard data", e);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <WelcomeBanner />

      {/* Health Status */}
      <HealthStatus />

      {/* KPI Cards */}
      <KPICards stats={stats} />

      {/* Quick Actions */}
      <QuickActions />

      {/* Activity & Notifications */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentActivity />
        <NotificationsPanel />
      </div>
    </div>
  );
}
