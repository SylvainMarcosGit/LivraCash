import { api } from "./api";

export interface KYCApplication {
    id: number;
    vendor_id: number;
    business_name: string;
    owner_name: string;
    email: string;
    phone: string;
    status: "pending" | "approved" | "rejected" | "draft" | "submitted" | "under_review";
    business_type: string;
    business_category: string;
    submitted_at: string;
    documents: {
        id_document_front?: string;
        selfie?: string;
        id_expiry_date?: string;
    };
    id_type?: string;
    id_number?: string;
}

export const adminService = {
    getKYCApplications: async () => {
        const response = await api.get<{ success: boolean; data: KYCApplication[] }>(
            "/admin/kyc-applications"
        );
        return response.data.data;
    },

    reviewKYCApplication: async (id: number, action: "approve" | "reject", notes?: string) => {
        const response = await api.post(`/admin/kyc-applications/${id}/review`, {
            action,
            notes,
        });
        return response.data;
    },
};
