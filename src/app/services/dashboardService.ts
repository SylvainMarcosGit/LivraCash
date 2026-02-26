
import { api, getErrorMessage } from "./api";

export interface AnalyticsData {
    total_revenue: number;
    total_commissions: number;
    total_transactions: number;
    success_rate: number;
    revenue_trend: {
        date: string;
        revenue: number;
        transactions: number;
    }[];
    payment_methods: {
        mobile_money: number;
        card: number;
    };
}

export const dashboardService = {
    async getAnalytics(): Promise<AnalyticsData> {
        try {
            const response = await api.get<{ success: boolean; data: AnalyticsData }>("/dashboard/analytics");
            return response.data.data;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    }
};
