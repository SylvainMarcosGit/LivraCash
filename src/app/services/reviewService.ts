import { api, getErrorMessage } from "./api";

export interface Review {
    id: number;
    user_id: number;
    product_id: number;
    rating: number; // 1-5
    comment?: string;
    created_at: string;
    user?: {
        id: number;
        name?: string;
        first_name?: string;
        last_name?: string;
        avatar?: string;
    };
    is_anonymous?: boolean;
    reviewer_name?: string;
}

export const reviewService = {
    async addReview(productId: string, rating: number, comment: string, isAnonymous: boolean = false, reviewerName?: string): Promise<{ status: string; message: string; data: Review }> {
        try {
            const response = await api.post(`/products/${productId}/reviews`, { rating, comment, is_anonymous: isAnonymous, reviewer_name: reviewerName });
            return response.data;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    async getReviews(productId: string): Promise<Review[]> {
        try {
            const response = await api.get(`/products/${productId}/reviews`);
            return response.data.data;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    }
};
