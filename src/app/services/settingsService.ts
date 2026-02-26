
import { api, getErrorMessage } from "./api";

export interface ShopSettings {
    id: number;
    user_id: number;
    language: string;
    timezone: string;
    currency: string;
    email_notifications: boolean;
    sms_notifications: boolean;
    transaction_alerts: boolean;
    marketing_emails: boolean;
    two_factor_enabled: boolean;
}

export const settingsService = {
    async getSettings(): Promise<ShopSettings> {
        try {
            const response = await api.get("/settings");
            return response.data.data;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    async updateSettings(data: Partial<ShopSettings>): Promise<ShopSettings> {
        try {
            const response = await api.post("/settings", data);
            return response.data.data;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    }
};
