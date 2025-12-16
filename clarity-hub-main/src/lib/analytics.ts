import { API } from "@/api";

export interface AnalyticsData {
    totalOrders: number;
    totalProjects: number;
    totalRevenue: number;
    revenueGrowth?: number;
    ordersGrowth?: number;
}

export const analyticsService = {
    getAnalytics: async (): Promise<AnalyticsData> => {
        const response = await API.get('/analytics');
        return response.data;
    }
};
