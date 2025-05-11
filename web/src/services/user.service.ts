import { ApiResponse, User } from "@/types";
import api from "./instance";

export interface UpdateProfileParams {
  name?: string;
  email?: string;
  password?: string;
  currentPassword?: string;
}

export const userService = {
  // Get current user profile
  getProfile: async (): Promise<User> => {
    const response = await api.get("/users/me");
    return response.data;
  },

  // Update user profile
  updateProfile: async (
    data: UpdateProfileParams
  ): Promise<ApiResponse<User>> => {
    const response = await api.patch("/users/me", data);
    return response.data;
  },

  // Get user activity (tips, comments, likes)
  getUserActivity: async (): Promise<any> => {
    const response = await api.get("/users/me/activity");
    return response.data;
  },

  // Logout user
  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },
};
