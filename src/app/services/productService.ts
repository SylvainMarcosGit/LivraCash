
import { api, getErrorMessage } from "./api";

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    stock_quantity: number;
    in_stock: boolean;
    image: string | null;
    images?: string[];
    is_favorited?: boolean;
    rating?: number;
    reviews_count?: number;
}

export const productService = {
    async getProducts(): Promise<{ data: Product[] }> {
        try {
            const response = await api.get("/products");
            return response.data;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    async createProduct(data: FormData | Omit<Product, "id">): Promise<Product> {
        try {
            const headers = data instanceof FormData ? { "Content-Type": "multipart/form-data" } : {};
            const response = await api.post("/products", data, { headers });
            return response.data.data;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    async updateProduct(id: string, data: FormData | Partial<Product>): Promise<Product> {
        try {
            // Note: PUT requests with FormData can be tricky in Laravel/PHP. Sometimes using POST with _method=PUT is better.
            // But let's try direct first, or check if we need query params.
            // Actually, usually POST with _method=PUT is strict requirement for PHP to parse files in FormData.
            const headers = data instanceof FormData ? { "Content-Type": "multipart/form-data" } : {};

            let method = 'put';
            let url = `/products/${id}`;
            let payload = data;

            if (data instanceof FormData) {
                // Use POST and spoof PUT for file uploads
                method = 'post';
                data.append('_method', 'PUT');
                payload = data;
            }

            const response = await api[method](url, payload, { headers });
            return response.data.data;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    async deleteProduct(id: string): Promise<void> {
        try {
            await api.delete(`/products/${id}`);
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    }
};
