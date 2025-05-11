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

    // Token'ın nerede olduğunu bulmak için debug
    console.log(
      "Login response structure:",
      JSON.stringify(response.data, null, 2)
    );

    // Farklı API yanıt formatlarına uygun token bulma ve saklama
    let token = null;

    // 1. Düz token
    if (response.data?.token) {
      token = response.data.token;
    }
    // 2. Data içinde token
    else if (response.data?.data?.token) {
      token = response.data.data.token;
    }
    // 3. Accesstoken olarak
    else if (response.data?.accessToken) {
      token = response.data.accessToken;
    }
    // 4. data içinde accessToken
    else if (response.data?.data?.accessToken) {
      token = response.data.data.accessToken;
    }

    if (token) {
      console.log(
        "Token bulundu ve kaydediliyor:",
        token.substring(0, 15) + "..."
      );
      localStorage.setItem("auth_token", token);
    } else {
      console.error("Token bulunamadı! API yanıtı:", response.data);
    }

    return response.data;
  },

  // Yeni kullanıcı kaydı
  register: async (
    data: RegisterParams
  ): Promise<ApiResponse<LoginResponse>> => {
    const response = await api.post("/auth/register", data);

    // Token'ın nerede olduğunu bulmak için debug
    console.log(
      "Register response structure:",
      JSON.stringify(response.data, null, 2)
    );

    // Farklı API yanıt formatlarına uygun token bulma ve saklama
    let token = null;

    // 1. Düz token
    if (response.data?.token) {
      token = response.data.token;
    }
    // 2. Data içinde token
    else if (response.data?.data?.token) {
      token = response.data.data.token;
    }
    // 3. Accesstoken olarak
    else if (response.data?.accessToken) {
      token = response.data.accessToken;
    }
    // 4. data içinde accessToken
    else if (response.data?.data?.accessToken) {
      token = response.data.data.accessToken;
    }

    if (token) {
      console.log(
        "Token bulundu ve kaydediliyor:",
        token.substring(0, 15) + "..."
      );
      localStorage.setItem("auth_token", token);
    } else {
      console.error("Token bulunamadı! API yanıtı:", response.data);
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
      console.log("Token temizlendi");
    }
  },

  // Kullanıcının giriş yapmış olup olmadığını kontrol et
  isAuthenticated: (): boolean => {
    if (typeof window === "undefined") return false;
    const token = localStorage.getItem("auth_token");
    return !!token;
  },

  // Token'ı getir
  getToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("auth_token");
  },
};
