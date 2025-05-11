import { UpdateProfileParams, userService } from "@/services/user.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Hook for fetching user profile
export const useUserProfile = () => {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: () => userService.getProfile(),
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
      // Clear all queries from cache
      queryClient.clear();
    },
  });
};
