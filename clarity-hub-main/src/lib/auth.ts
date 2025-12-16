import { API } from '@/api';

export interface User {
    id: string;
    name: string;
    email: string;
    // Add role or other fields if backend sends them
    role?: string;
    profile?: {
        companyName?: string;
        companySize?: string;
        phone?: string;
        address?: string;
        website?: string;
        industry?: string;
        timezone?: string;
    };
}

// Deprecated: Logic moved to AuthContext. These are kept for type compatibility
// or if imported elsewhere, but they should ideally be removed.
export const login = async (email: string, password: string): Promise<User> => {
    const response = await API.post('/auth/login', { email, password });
    return response.data.user;
};

export const signup = async (name: string, email: string, password: string): Promise<User> => {
    const response = await API.post('/auth/register', { name, email, password });
    return response.data.user;
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('venturemond_user');
};

export const getCurrentUser = (): User | null => {
    const userStr = localStorage.getItem('venturemond_user');
    if (userStr) {
        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    }
    return null;
};
