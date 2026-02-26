import { api } from "./api";

export interface Vendor {
    id: string;
    name: string;
    description: string;
    category: string;
    rating: number;
    reviews: number;
    location: string;
    phone: string;
    email: string;
    products: number;
    image: string | null;
    banner: string | null;
    website: string | null;
    facebook_url: string | null;
    youtube_url: string | null;
    tiktok_url: string | null;
    verified: boolean;
    plan: string;
    joinedDate: string;
    responseTime: string;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string | null;
    category: string;
    stock_quantity: number;
    in_stock: boolean;
    user_id: string;
}

export const marketplaceService = {
    async getVendors(): Promise<{ data: Vendor[] }> {
        try {
            const response = await api.get("/marketplace/vendors");
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async getVendor(id: string): Promise<Vendor> {
        try {
            const response = await api.get(`/marketplace/vendors/${id}`);
            return response.data.data;
        } catch (error) {
            throw error;
        }
    },

    async getVendorProducts(id: string): Promise<Product[]> {
        try {
            const response = await api.get(`/marketplace/vendors/${id}/products`);
            return response.data.data;
        } catch (error) {
            throw error;
        }
    },

    async getVendorReviews(id: string): Promise<any[]> {
        try {
            const response = await api.get(`/marketplace/vendors/${id}/reviews`);
            return response.data.data;
        } catch (error) {
            throw error;
        }
    }
};
