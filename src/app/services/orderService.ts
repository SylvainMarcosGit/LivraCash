import { api } from "./api";

export interface OrderItem {
    id: string; // Product ID
    quantity: number;
    vendorId: string;
    price: number;
}

export interface OrderPayload {
    shipping_address: any;
    payment_method: string;
    items: OrderItem[];
}

export const orderService = {
    async createOrder(payload: OrderPayload): Promise<any> {
        try {
            const response = await api.post("/orders", payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async getOrders(): Promise<any> {
        try {
            const response = await api.get("/orders");
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async getOrder(id: string): Promise<any> {
        try {
            const response = await api.get(`/orders/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async updateOrderStatus(id: string, status: string): Promise<any> {
        try {
            const response = await api.patch(`/orders/${id}/status`, { status });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};
