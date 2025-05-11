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

  // Get user by ID
  getUserById: async (id: string): Promise<User | null> => {
    if (!id) {
      console.error("Invalid or empty user ID");
      return null;
    }

    try {
      console.log("Making API request to /users/", id);
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      return null;
    }
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
