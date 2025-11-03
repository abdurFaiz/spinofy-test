import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authAPI } from "@/api/auth.api";
import { useAuthStore } from "@/store/auth.store";
import type { FormValues } from "@/schemas/auth.schemas";
import type { AuthData, AuthResponse } from "@/types/Auth";

// Query keys
export const authKeys = {
  all: ["auth"] as const,
  profile: () => [...authKeys.all, "profile"] as const,
};

// Register mutation
export const useRegister = () => {
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: (data: FormValues) => authAPI.register(data),
    onSuccess: (responseData: AuthResponse) => {
      // Transform API response to match our types
      const authData: AuthData = {
        access_token: responseData.data.access_token,
        refresh_token: responseData.data.refresh_token,
        user: {
          id: responseData.data.user.id,
          uuid: responseData.data.user.uuid,
          name: responseData.data.user.name,
          phone: responseData.data.user.phone,
          created_at: responseData.data.user.created_at,
          updated_at: responseData.data.user.created_at,
          customer_profile: {
            id: responseData.data.user.customer_profile.id,
            uuid: responseData.data.user.customer_profile.uuid,
            job: responseData.data.user.customer_profile.job,
            date_birth: responseData.data.user.customer_profile.date_birth,
            gender: responseData.data.user.customer_profile.gender,
            user_id: responseData.data.user.customer_profile.user_id,
            created_at: responseData.data.user.customer_profile.created_at,
            updated_at: responseData.data.user.customer_profile.updated_at,
          },
        },
      };

      login(authData);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Registrasi gagal";
      console.error("Register error:", message);
    },
  });
};

// Update profile mutation
export const useUpdateProfile = () => {
  const updateUser = useAuthStore((state) => state.updateUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormValues) => authAPI.updateProfile(data),
    onSuccess: (responseData: AuthResponse) => {
      // Transform API response to match our types
      const user = {
        id: responseData.data.user.id,
        uuid: responseData.data.user.uuid,
        name: responseData.data.user.name,
        phone: responseData.data.user.phone,
        created_at: responseData.data.user.created_at,
        updated_at: responseData.data.user.updated_at,
        customer_profile: {
          id: responseData.data.user.customer_profile.id,
          uuid: responseData.data.user.customer_profile.uuid,
          job: responseData.data.user.customer_profile.job,
          date_birth: responseData.data.user.customer_profile.date_birth,
          gender: responseData.data.user.customer_profile.gender,
          user_id: responseData.data.user.customer_profile.user_id,
          created_at: responseData.data.user.customer_profile.created_at,
          updated_at: responseData.data.user.customer_profile.updated_at,
        },
      };

      updateUser(user);

      // Invalidate profile query to refetch
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Update profile gagal";
      console.error("Update profile error:", message);
    },
  });
};

// Logout mutation
export const useLogout = () => {
  const logout = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authAPI.logout(),
    onSuccess: () => {
      logout();
      queryClient.clear(); // Clear all queries

      // Force redirect to onboard with absolute URL and reload
      const frontendUrl = import.meta.env.VITE_APP_URL || 'http://localhost:5174';
      console.log('🚪 Logout successful, redirecting to onboard...');

      // Use replace + reload to ensure clean state
      setTimeout(() => {
        globalThis.location.href = `${frontendUrl}/onboard`;
      }, 100);
    },
    onError: (error: any) => {
      // Even if logout fails on server, we should clear local state
      logout();
      queryClient.clear();

      const message = error.response?.data?.message || "Logout gagal";
      console.error('Logout error:', message);

      // Still redirect to onboard even on error
      const frontendUrl = import.meta.env.VITE_APP_URL || 'http://localhost:5174';
      setTimeout(() => {
        globalThis.location.href = `${frontendUrl}/onboard`;
      }, 100);
    },
  });
};

// Get profile query
export const useProfile = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const updateUser = useAuthStore((state) => state.updateUser);

  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: async () => {
      const response = await authAPI.getProfile();

      // Transform API response to match our types
      const user = {
        id: response.data.user.id,
        uuid: response.data.user.uuid,
        name: response.data.user.name,
        phone: response.data.user.phone,
        created_at: response.data.user.created_at,
        updated_at: response.data.user.updated_at,
        customer_profile: {
          id: response.data.user.customer_profile.id,
          uuid: response.data.user.customer_profile.uuid,
          job: response.data.user.customer_profile.job,
          date_birth: response.data.user.customer_profile.date_birth,
          gender: response.data.user.customer_profile.gender,
          user_id: response.data.user.customer_profile.user_id,
          created_at: response.data.user.customer_profile.created_at,
          updated_at: response.data.user.customer_profile.updated_at,
        },
      };

      updateUser(user);
      return user;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Refresh token mutation (usually called automatically by axios interceptor)
export const useRefreshToken = () => {
  const updateTokens = useAuthStore((state) => state.updateTokens);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: (refreshToken: string) => authAPI.refreshToken(refreshToken),
    onSuccess: (response) => {
      updateTokens(response.data.access_token, response.data.refresh_token);
    },
    onError: () => {
      // If refresh fails, clear auth state
      clearAuth();
    },
  });
};