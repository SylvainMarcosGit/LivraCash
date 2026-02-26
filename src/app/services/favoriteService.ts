import { api, getErrorMessage } from "./api";

export const favoriteService = {
    async toggleFavorite(productId: string): Promise<{ status: string; message: string; is_favorited: boolean }> {
        try {
            const response = await api.post(`/products/${productId}/favorite`);
            return response.data;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    async getFavorites(): Promise<any[]> {
        try {
            const response = await api.get("/favorites");
            return response.data.data;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    }
};
