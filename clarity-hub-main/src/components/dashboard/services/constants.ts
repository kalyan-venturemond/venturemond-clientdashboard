export const USD_TO_INR = 83.5;
export const TAX_RATE = 0.18; // 18% GST/Tax

export type Pricing = {
    inr: number;
    usd: number;
    period?: string; // e.g. "/month", "/user/month", " one-time"
    setupFee?: { inr: number; usd: number };
};

export type ServiceItem = {
    id: string;
    title: string;
    description?: string;
    price: Pricing;
    features: string[];
    badge?: string;
    tier?: string; // For MVP tiers
    category?: 'studio' | 'plan' | 'addon';
    sla?: string;
    deliverables?: string[];
    faqLink?: string;
};

// Service configs have moved to backend.
// These types are kept for frontend type safety.
