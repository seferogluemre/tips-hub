import { ApiResponse, User } from "@/types";
import api from "./instance";

interface LoginResponse {
  user: User;
  token: string;
}

export interface LoginParams {
  email: string;
  password: string;
}

export interface RegisterParams {
  name: string;
  email: string;
  password: string;
}

export const authService = {
  // Kullanıcı girişi
  login: async (
    credentials: LoginParams
  ): Promise<ApiResponse<LoginResponse>> => {
    const response = await api.post("/auth/login", credentials);

    // Token'ı localStorage'a kaydet
    if (response.data?.data?.token) {
      localStorage.setItem("auth_token", response.data.data.token);
    }

    return response.data;
  },

  // Yeni kullanıcı kaydı
  register: async (
    data: RegisterParams
  ): Promise<ApiResponse<LoginResponse>> => {
    const response = await api.post("/auth/register", data);

    // Token'ı localStorage'a kaydet
    if (response.data?.data?.token) {
      localStorage.setItem("auth_token", response.data.data.token);
    }

    return response.data;
  },

  // Çıkış yap
  logout: async (): Promise<void> => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Her durumda token'ı temizle
      localStorage.removeItem("auth_token");
    }
  },

  // Kullanıcının giriş yapmış olup olmadığını kontrol et
  isAuthenticated: (): boolean => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("auth_token");
  },

  // Token'ı getir
  getToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("auth_token");
  },
};
