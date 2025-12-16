import { API } from "@/api";

export interface Project {
    _id: string;
    name: string;
    description: string;
    status: 'planning' | 'in-progress' | 'review' | 'completed' | 'cancelled';
    progress: number;
    userId: string;
    createdAt: string;
}

export const projectsService = {
    getProjects: async (): Promise<Project[]> => {
        const response = await API.get('/projects');
        return response.data;
    }
};
