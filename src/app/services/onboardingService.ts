
import { api, getErrorMessage } from "./api";

export interface OnboardingData {
    user_id?: number;
    business_name?: string;
    business_type?: string;
    tax_id?: string;
    address?: string;
    owner_first_name?: string;
    owner_last_name?: string;
    owner_dob?: string;
    id_type?: string;
    id_number?: string;
    bank_name?: string;
    account_number?: string;
    account_holder?: string;
    status?: "draft" | "submitted" | "approved" | "rejected" | "under_review";
    current_step: number;
}

export const onboardingService = {
    async getProgress(): Promise<OnboardingData> {
        try {
            const response = await api.get<{ success: boolean; data: OnboardingData }>("/onboarding");
            return response.data.data;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    async updateProgress(data: Partial<OnboardingData>): Promise<OnboardingData> {
        try {
            const response = await api.post<{ success: boolean; data: OnboardingData }>("/onboarding", data);
            return response.data.data;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    }
};
