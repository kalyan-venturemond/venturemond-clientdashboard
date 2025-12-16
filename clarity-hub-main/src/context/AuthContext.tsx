// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/lib/auth';
import { API } from '@/api';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<{ ok: boolean; msg?: string }>;
    signup: (name: string, email: string, password: string) => Promise<{ ok: boolean; msg?: string }>;
    logout: () => void;
    updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const parseApiError = (err: any) => {
    // Try to return a friendly message from the backend, otherwise fallback
    try {
        if (err?.response?.data?.msg) return err.response.data.msg;
        if (err?.response?.data?.errors && Array.isArray(err.response.data.errors)) {
            return err.response.data.errors.map((e: any) => e.msg).join(', ');
        }
        if (err?.message) return err.message;
    } catch (e) {
        // ignore
    }
    return 'An unexpected error occurred';
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('venturemond_user');

            if (token && storedUser) {
                try {
                    // Use stored user for instant UI. Optionally verify token with backend:
                    setUser(JSON.parse(storedUser));
                    setIsAuthenticated(true);

                    // Optional verification:
                    // const res = await API.get('/api/auth/me');
                    // setUser(res.data.user);
                } catch (error) {
                    console.error('Auth init error', error);
                    logout();
                }
            }
            setIsLoading(false);
        };
        initAuth();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            // NOTE: include /api prefix so the request goes to the backend (not the dev server)
            const response = await API.post('/auth/login', { email, password });
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('venturemond_user', JSON.stringify(user));

            setUser(user);
            setIsAuthenticated(true);

            return { ok: true };
        } catch (error: any) {
            console.error('Login failed', error);
            return { ok: false, msg: parseApiError(error) };
        }
    };

    const signup = async (name: string, email: string, password: string) => {
        try {
            const response = await API.post('/auth/register', { name, email, password });
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('venturemond_user', JSON.stringify(user));

            setUser(user);
            setIsAuthenticated(true);

            return { ok: true };
        } catch (error: any) {
            console.error('Signup failed', error);
            return { ok: false, msg: parseApiError(error) };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('venturemond_user');
        setUser(null);
        setIsAuthenticated(false);
    };

    const updateUser = (updatedUser: User) => {
        localStorage.setItem('venturemond_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, signup, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
