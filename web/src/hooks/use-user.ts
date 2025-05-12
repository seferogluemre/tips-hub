import { UpdateProfileParams, userService } from "@/services/user.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Hook for fetching user profile
export const useUserProfile = (id: string) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => userService.getUserById(id),
  });
};

// Hook for fetching user by ID
export const useUserById = (id: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      if (!id) {
        console.log("No user ID provided, skipping API call");
        return null;
      }

      try {
        const data = await userService.getUserById(id);
        return data;
      } catch (error) {
        console.error("Error fetching user:", error);
        throw error;
      }
    },
    enabled: options?.enabled !== undefined ? options.enabled : !!id,
    retry: 1, // Only retry once if there's an error
  });
};

// Hook for updating user profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileParams) => userService.updateProfile(data),
    onSuccess: () => {
      // Invalidate user profile query to refetch
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
  });
};

// Hook for fetching user activity
export const useUserActivity = () => {
  return useQuery({
    queryKey: ["user-activity"],
    queryFn: () => userService.getUserActivity(),
  });
};

// Hook for logging out
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => userService.logout(),
    onSuccess: () => {
      queryClient.clear();
    },
  });
};
