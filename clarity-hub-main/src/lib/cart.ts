export interface CartItem {
    id: string;
    title: string;
    price: number;
    currency: "INR" | "USD";
    quantity: number;
    period?: string;
}

export type CartStore = {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    clearCart: () => void;
    startTrial: (planId: string) => Promise<{ success: boolean; trialId?: string }>;
}

// Simple in-memory mock store
// In a real app, this would use a state management library (Zustand, Redux) or Context
let cartItems: CartItem[] = [];

export const cartService = {
    getCart: () => cartItems,

    addToCart: (item: CartItem) => {
        // Check if item exists
        const existing = cartItems.find(i => i.id === item.id);
        if (existing) {
            existing.quantity += item.quantity;
        } else {
            cartItems.push(item);
        }
        console.log("Added to cart:", item);
        // You could dispatch an event here to update UI if needed
    },

    removeItem: (id: string) => {
        cartItems = cartItems.filter(i => i.id !== id);
    },

    clearCart: () => {
        cartItems = [];
    },

    startTrial: async (planId: string) => {
        console.log(`Starting trial for plan: ${planId}`);
        // Simulate API call
        return new Promise<{ success: boolean; trialId?: string }>((resolve) => {
            setTimeout(() => {
                resolve({ success: true, trialId: `trial-${Date.now()}` });
            }, 1000);
        });
    }
};
