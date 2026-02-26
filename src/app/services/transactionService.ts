
import { api, getErrorMessage } from "./api";

export interface Transaction {
    id: number;
    reference: string;
    customer_name: string;
    customer_phone: string;
    amount: number;
    currency: string;
    commission: number;
    net_amount: number;
    payment_method: string;
    provider: string;
    status: "success" | "pending" | "failed";
    description: string;
    created_at: string;
    completed_at: string | null;
}

export const transactionService = {
    async getTransactions(params?: any): Promise<{ data: Transaction[], total: number }> {
        try {
            const response = await api.get("/transactions", { params });
            return response.data.data; // Returns the Laravel Paginator object { data: [], total: ... }
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    }
};
