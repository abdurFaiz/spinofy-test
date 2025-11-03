import { useAuthStore } from '@/store/auth.store';
import type { User } from '@/types/Auth';

/**
 * Check if user is authenticated (can be used outside React components)
 */
export const isAuthenticated = (): boolean => {
  const state = useAuthStore.getState();
  return state.isAuthenticated && !!state.access_token;
};

/**
 * Get current user (can be used outside React components)
 */
export const getCurrentUser = (): User | null => {
  const state = useAuthStore.getState();
  return state.user;
};

/**
 * Get access token (can be used outside React components)
 */
export const getAccess_token = (): string | null => {
  const state = useAuthStore.getState();
  return state.access_token || localStorage.getItem('access_token');
};

/**
 * Get refresh token (can be used outside React components)
 */
export const getRefresh_token = (): string | null => {
  const state = useAuthStore.getState();
  return state.refresh_token || localStorage.getItem('refresh_token');
};

/**
 * Clear all auth data (can be used outside React components)
 */
export const clearAuthData = (): void => {
  const { clearAuth } = useAuthStore.getState();
  clearAuth();
};

/**
 * Check if user has completed profile setup
 */
export const hasCompleteProfile = (user?: User | null): boolean => {
  if (!user || !user.customer_profile) return false;

  const profile = user.customer_profile;
  return !!(
    profile.date_birth &&
    profile.job 
  );
};

/**
 * Validate token expiration (basic check)
 * Note: This is a basic implementation. For production, you might want to decode JWT
 */
export const isTokenExpired = (token?: string | null): boolean => {
  if (!token) return true;

  try {
    // Basic JWT structure check
    const parts = token.split('.');
    if (parts.length !== 3) return true;

    // Decode payload (without verification - just for expiration check)
    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Math.floor(Date.now() / 1000);

    return payload.exp ? payload.exp < currentTime : false;
  } catch {
    return true;
  }
};

/**
 * Check if user needs to refresh token
 */
export const shouldRefresh_token = (): boolean => {
  const access_token = getAccess_token();
  const refresh_token = getRefresh_token();

  return !!(
    refresh_token &&
    !isTokenExpired(refresh_token) &&
    isTokenExpired(access_token)
  );
};

/**
 * Route protection utility
 */
export const canAccessRoute = (
  requiredAuth: boolean = true,
  requireCompleteProfile: boolean = false
): { canAccess: boolean; redirectTo?: string; reason?: string } => {
  const authenticated = isAuthenticated();
  const user = getCurrentUser();

  // If route requires authentication but user is not authenticated
  if (requiredAuth && !authenticated) {
    return {
      canAccess: false,
      redirectTo: 'register',
      reason: 'Authentication required'
    };
  }

  // If route requires no authentication but user is authenticated
  if (!requiredAuth && authenticated) {
    return {
      canAccess: false,
      redirectTo: '/',
      reason: 'Already authenticated'
    };
  }

  // If route requires complete profile but user hasn't completed it
  if (requireCompleteProfile && authenticated && !hasCompleteProfile(user)) {
    return {
      canAccess: false,
      redirectTo: '/auth/complete-profile',
      reason: 'Profile completion required'
    };
  }

  return { canAccess: true };
};

/**
 * Phone number formatter for Indonesian format
 */
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');

  // Convert to international format if starts with 0
  if (cleaned.startsWith('0')) {
    return '62' + cleaned.substring(1);
  }

  // Add 62 prefix if not present
  if (!cleaned.startsWith('62')) {
    return '62' + cleaned;
  }

  return cleaned;
};

/**
 * Display phone number in local format
 */
export const displayPhoneNumber = (phone: string): string => {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');

  // Convert from international to local format
  if (cleaned.startsWith('62')) {
    return '0' + cleaned.substring(2);
  }

  return cleaned;
};

/**
 * Validate phone number format
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');

  // Check if it's a valid Indonesian phone number
  // Should be 8-12 digits after removing country code
  if (cleaned.startsWith('62')) {
    const localPart = cleaned.substring(2);
    return localPart.length >= 8 && localPart.length <= 12;
  }

  if (cleaned.startsWith('0')) {
    const localPart = cleaned.substring(1);
    return localPart.length >= 8 && localPart.length <= 12;
  }

  return cleaned.length >= 8 && cleaned.length <= 12;
};

/**
 * Generate initials from user name
 */
export const getUserInitials = (name?: string): string => {
  if (!name) return 'U';

  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

/**
 * Get user display name
 */
export const getUserDisplayName = (user?: User | null): string => {
  if (!user) return 'User';
  return user.name || 'User';
};

/**
 * Authentication state persistence check
 */
export const syncAuthState = (): void => {
  const { login, clearAuth } = useAuthStore.getState();
  const access_token = localStorage.getItem('access_token');
  const refresh_token = localStorage.getItem('refresh_token');

  if (access_token && refresh_token && !isTokenExpired(refresh_token)) {
    // Try to restore state from localStorage if tokens are valid
    const userDataString = localStorage.getItem('auth-store');
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        if (userData.state?.user) {
          login({
            access_token,
            refresh_token,
            user: userData.state.user
          });
        }
      } catch {
        // If parsing fails, clear invalid data
        clearAuth();
      }
    }
  } else {
    // Clear invalid tokens
    clearAuth();
  }
};
