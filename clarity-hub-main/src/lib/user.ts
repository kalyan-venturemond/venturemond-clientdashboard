import { API } from "@/api";
import { User } from "./auth"; // Assuming User type is exported from here, or we define it

export const userService = {
    getMe: async () => {
        const response = await API.get('/users/me');
        return response.data.user;
    },

    updateMe: async (profile: {
        companyName?: string;
        companySize?: string;
        phone?: string;
        address?: string;
        website?: string;
        industry?: string;
        timezone?: string;
    }) => {
        const token = localStorage.getItem('token');
        console.log("userService.updateMe calling...", { tokenExists: !!token, tokenPreview: token ? token.substring(0, 10) : 'N/A' });

        try {
            const response = await API.patch('/users/me', { profile });
            return response.data.user;
        } catch (error) {
            console.error("userService.updateMe failed", error);
            throw error;
        }
    }
};
