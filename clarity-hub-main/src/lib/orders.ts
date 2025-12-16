import { API } from "@/api";
import { CartItem } from "./cart";

export interface Order {
    id: string;
    _id?: string; // Backend ID
    date: string;
    createdAt?: string; // Backend date
    items: CartItem[];
    total: number;
    status: "active" | "provisioning" | "pending" | "completed" | "cancelled" | "paid" | "payment_failed";
    currency: "INR" | "USD";
    paymentMethod?: "card" | "upi" | "invoice";
    invoiceNumber?: string;
    contractStatus?: "pending" | "signed" | "uploaded";
    subtotal?: number;
    tax?: number;
    discount?: number;
    billingDetails?: {
        name: string;
        address: string;
        city: string;
        country: string;
        taxId?: string;
    };
    timeline?: {
        status: "created" | "paid" | "provisioning" | "kickoff" | "delivery";
        label: string;
        date: string;
        done: boolean;
        description?: string;
    }[];
    subscription?: {
        planId: string;
        planName: string;
        billingPeriod: "monthly" | "yearly";
        nextBillingDate: string;
        status: "active" | "cancelled" | "past_due" | "trial" | "renewal_failed";
        usage?: {
            seats: { used: number; total: number };
            storage: { used: number; total: number; unit: "GB" };
        };
    };
}

export const ordersService = {
    getOrders: async (): Promise<Order[]> => {
        // GET /orders should return { orders: [...] }
        const response = await API.get('/orders');
        // Normalize: return array
        if (response.data?.orders) return response.data.orders;
        if (Array.isArray(response.data)) return response.data;
        return [];
    },

    addOrder: async (order: Omit<Order, "id" | "date" | "status">): Promise<any> => {
        // `POST /orders/create` returns { order, invoice }
        const response = await API.post('/orders/create', order);
        return response.data;
    },

    listOrders: async (): Promise<Order[]> => {
        return ordersService.getOrders();
    },

    getOrder: async (id: string): Promise<Order | undefined> => {
        const response = await API.get(`/orders/${id}`);
        return response.data;
    },

    // Add missing methods if needed by UI (e.g., pay)
    payOrder: async (id: string): Promise<Order> => {
        const response = await API.patch(`/orders/${id}/status`, { status: 'paid' });
        return response.data;
    }
};
