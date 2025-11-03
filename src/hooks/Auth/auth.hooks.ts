import { useAuthStore } from '@/store/auth.store';
import { useProfile } from '@/services/auth/auth.queries';

/**
 * Custom hook for auth state and user data
 * Combines Zustand store state with TanStack Query profile data
 */
export const useAuth = () => {
  const {
    isAuthenticated,
    user: storeUser,
    access_token,
    refresh_token,
    logout,
    updateUser,
    updateTokens,
    clearAuth,
  } = useAuthStore();

  // Get fresh profile data when authenticated
  const { data: profileUser, isLoading: isLoadingProfile, error: profileError } = useProfile();

  // Use profile data if available, fallback to store user
  const user = profileUser || storeUser;

  return {
    // Auth state
    isAuthenticated,
    user,
    access_token,
    refresh_token,

    // Loading states
    isLoadingProfile,
    profileError,

    // Actions
    logout,
    updateUser,
    updateTokens,
    clearAuth,

    // Computed states
    isLoggedIn: isAuthenticated && !!user,
    hasProfile: !!user?.customer_profile,
  };
};

/**
 * Hook to check if user is authenticated (simple boolean check)
 */
export const useIsAuthenticated = () => {
  return useAuthStore((state) => state.isAuthenticated);
};

/**
 * Hook to get current user data only
 */
export const useCurrentUser = () => {
  const storeUser = useAuthStore((state) => state.user);
  const { data: profileUser } = useProfile();

  return profileUser || storeUser;
};

/**
 * Hook to get auth tokens
 */
export const useAuthTokens = () => {
  const access_token = useAuthStore((state) => state.access_token);
  const refresh_token = useAuthStore((state) => state.refresh_token);

  return {
    access_token,
    refresh_token,
    hasTokens: !!(access_token && refresh_token),
  };
};

/**
 * Hook for auth actions only (no state)
 */
export const useAuthActions = () => {
  const logout = useAuthStore((state) => state.logout);
  const updateUser = useAuthStore((state) => state.updateUser);
  const updateTokens = useAuthStore((state) => state.updateTokens);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return {
    logout,
    updateUser,
    updateTokens,
    clearAuth,
  };
};
