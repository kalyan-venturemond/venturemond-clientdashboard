import { API } from "@/api";

export interface Subscription {
    _id: string;
    planName: string;
    status: 'active' | 'cancelled' | 'past_due' | 'trial';
    startDate: string;
    nextBillingDate: string;
    billingPeriod: 'monthly' | 'yearly';
    userId: string;
}

export const subscriptionsService = {
    getSubscriptions: async (): Promise<Subscription[]> => {
        const response = await API.get('/subscriptions');
        return response.data;
    }
};
