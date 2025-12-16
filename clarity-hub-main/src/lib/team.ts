import { API } from "@/api";

export interface TeamMember {
    _id: string;
    email: string;
    role: 'Admin' | 'Editor' | 'Viewer';
    status: 'pending' | 'active' | 'inactive';
    invitedAt: string;
    // mapped for UI
    name?: string;
    avatar?: string;
}

export const teamService = {
    getTeam: async (): Promise<TeamMember[]> => {
        const response = await API.get('/team');
        return response.data;
    },

    addMember: async (email: string, role: string): Promise<TeamMember> => {
        const response = await API.post('/team', { email, role });
        return response.data;
    }
};
