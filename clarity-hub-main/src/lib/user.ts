import { API } from "@/api";
import { User } from "./auth"; // Assuming User type is exported from here, or we define it

export const userService = {
    getMe: async () => {
        const response = await API.get('/users/me');
        return response.data.user;
    },

    updateMe: async (data: {
        name?: string;
        companyName?: string;
        companySize?: string;
        phone?: string;
        address?: string;
        website?: string;
        industry?: string;
        timezone?: string;
    }) => {
        const token = localStorage.getItem('token');
        console.log("userService.updateMe calling...", { tokenExists: !!token });

        try {
            // Split name from profile data
            const { name, ...profileData } = data;
            
            // Construct payload: if name exists, include it at root. Profile data goes into 'profile' object.
            const payload: any = {};
            if (name) payload.name = name;
            if (Object.keys(profileData).length > 0) payload.profile = profileData;

            const response = await API.patch('/users/me', payload);
            return response.data.user;
        } catch (error) {
            console.error("userService.updateMe failed", error);
            throw error;
        }
    }
};
