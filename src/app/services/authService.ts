
import { api, getErrorMessage } from "./api";

import { User } from "../contexts/AuthContext"; // Assuming User type is exported from AuthContext or we will define it

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    password: string;
    password_confirmation: string;
    plan?: string;
    billing_cycle?: string;
}

export interface AuthResponse {
    success: boolean;
    data: {
        user: User;
        token: string;
        expires_at?: string;
    };
    message: string;
}

export const authService = {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        try {
            // Get CSRF cookie first (Sanctum)
            await api.get("/sanctum/csrf-cookie");

            const response = await api.post<AuthResponse>("/auth/login", credentials);
            return response.data;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    async register(data: RegisterData): Promise<AuthResponse> {
        try {
            // Get CSRF cookie first (Sanctum)
            await api.get("/sanctum/csrf-cookie");

            const response = await api.post<AuthResponse>("/auth/register", data);
            return response.data;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    async logout(): Promise<void> {
        try {
            await api.post("/auth/logout");
        } catch (error) {
            console.error("Logout error:", error);
        }
    },

    async me(): Promise<User> {
        try {
            const response = await api.get<{ data: User }>("/auth/me");
            return response.data.data;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    },

    async updateProfile(data: Partial<User> & { avatar?: File }): Promise<User> {
        try {
            let response;
            if (data.avatar) {
                const formData = new FormData();
                Object.keys(data).forEach(key => {
                    const value = data[key as keyof typeof data];
                    if (value !== undefined && value !== null) {
                        formData.append(key, value as string | Blob);
                    }
                });

                response = await api.post<{ data: User, message: string }>("/auth/profile", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
            } else {
                response = await api.post<{ data: User, message: string }>("/auth/profile", data);
            }

            return response.data.data;
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    }
};
