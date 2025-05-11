import { ApiResponse, CreateTipParams, GetTipsParams, Tip } from "@/types";
import api from "./instance";

export const tipService = {
  // Get all tips with optional filtering
  getTips: async (params?: GetTipsParams): Promise<ApiResponse<Tip[]>> => {
    const response = await api.get("/tips", { params });
    return response.data;
  },

  // Get a single tip by ID
  getTipById: async (id: string): Promise<Tip> => {
    const response = await api.get(`/tips/${id}`);
    return response.data;
  },

  // Create a new tip
  createTip: async (tipData: CreateTipParams): Promise<ApiResponse<Tip>> => {
    // Make sure authorId exists in the request
    if (!tipData.authorId) {
      const userId = localStorage.getItem("userId");
      if (userId) {
        tipData.authorId = userId;
      }
    }

    // Log the request payload for debugging
    console.log("Creating tip with data:", tipData);

    const response = await api.post("/tips", tipData);
    return response.data;
  },

  // Delete a tip
  deleteTip: async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/tips/${id}`);
    return response.data;
  },

  // Like a tip
  likeTip: async (id: string): Promise<ApiResponse<Tip>> => {
    const response = await api.post(`/tips/${id}/like`);
    return response.data;
  },

  commentOnTip: async (
    id: string,
    content: string
  ): Promise<ApiResponse<Tip>> => {
    const response = await api.post(`/tips/${id}/comments`, { content });
    return response.data;
  },

  // Get all tags
  getTags: async (): Promise<string[]> => {
    const response = await api.get("/tips/tags");
    return response.data;
  },
};
