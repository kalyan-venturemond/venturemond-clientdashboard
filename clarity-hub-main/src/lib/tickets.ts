// src/lib/tickets.ts
import { API } from '../api';

export interface TicketPayload {
    subject: string;
    message: string;
}

export interface Ticket {
    _id: string;
    userId: string;
    subject: string;
    message: string;
    status: string;
    createdAt: string;
}

export const ticketsService = {
    create: async (payload: TicketPayload): Promise<Ticket> => {
        const response = await API.post('/tickets', payload);
        return response.data.ticket;
    },
    listMine: async (): Promise<Ticket[]> => {
        const response = await API.get('/tickets');
        return response.data.tickets;
    },
};
