import { API } from "../api";

export interface FileItem {
    _id: string;
    originalName: string;
    filename: string;
    size: number;
    mimeType: string;
    createdAt: string;
    path: string;
}

export const filesService = {
    uploadFile: async (file: File): Promise<FileItem> => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await API.post('/files/upload', formData);
        return response.data;
    },

    getFiles: async (): Promise<FileItem[]> => {
        const response = await API.get('/files');
        return response.data;
    },

    deleteFile: async (fileId: string): Promise<void> => {
        await API.delete(`/files/${fileId}`);
    }
};
