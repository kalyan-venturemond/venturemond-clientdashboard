import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const API = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        console.log(`[API] Request to ${config.url} - Token exists: ${!!token}`);

        if (token) {
            if (!config.headers) {
                config.headers = {} as any;
            }
            // Force header setting
            config.headers['Authorization'] = `Bearer ${token}`;
            // Also try set method if it exists (Axios v1+)
            if (typeof (config.headers as any).set === 'function') {
                (config.headers as any).set('Authorization', `Bearer ${token}`);
            }
        } else {
            console.warn("[API] Request made WITHOUT token");
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle 401
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear storage and redirect if needed, or let AuthContext handle it via state
            // For now, we will just clear the token to ensure next reload is clean
            // localStorage.removeItem('token');
            // localStorage.removeItem('venturemond_user');
            console.warn("API 401 Error: Validating token...", { url: error.config?.url });

            // Optional: Dispatch a custom event or let the UI handle the redirect
            // window.location.href = '/auth/login'; // Hard redirect can be jarring, better to handle in Context
        }
        return Promise.reject(error);
    }
);
