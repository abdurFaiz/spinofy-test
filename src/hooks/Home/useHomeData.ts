import { useDynamicProducts } from "@/hooks/Product/useDynamicProducts";
import type { UserData } from "@/types/User";
import { useMemo } from "react";
import { useAuth } from "@/hooks/Auth/auth.hooks";
import { useQuery } from "@tanstack/react-query";
import { RewardAPI } from "@/api/reward.api";

export const useHomeData = () => {
  // Get authenticated user data from auth context
  const { user, isLoadingProfile } = useAuth();

  // Use the new dynamic products hook
  const {
    products,
    categories,
    outlets,
    currentOutlet,
    isLoading: isLoadingProducts,
    error: queryError,
    refetch,
  } = useDynamicProducts();

  // Get the outlet slug for reward API
  const outletSlug = currentOutlet?.slug;

  // Fetch user's reward points
  const {
    data: rewardData,
    isLoading: isLoadingRewards,
    error: rewardError,
  } = useQuery({
    queryKey: ['user-rewards', outletSlug],
    queryFn: () => {
      if (!outletSlug) {
        throw new Error('No outlet available to fetch rewards');
      }
      return RewardAPI.getListRewardPoint(outletSlug);
    },
    enabled: !!outletSlug && !!user, // Only run when we have outlet slug and user is authenticated
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Transform user data to UserData format
  const userData: UserData | null = useMemo(() => {
    if (!user) return null;
    
    return {
      name: user.name || "User",
      vouchers: rewardData?.data?.vouchers?.length || 0,
      points: rewardData?.data?.point_balance || 0,
    };
  }, [user, rewardData]);

  // Combine loading states
  const isLoading = isLoadingProfile || isLoadingProducts || isLoadingRewards;

  // Transform error to string for consistency
  let error: string | null = null;
  if (queryError) {
    error = queryError instanceof Error ? queryError.message : "Failed to load data";
  } else if (rewardError) {
    error = rewardError instanceof Error ? rewardError.message : "Failed to load rewards";
  }

  return {
    userData,
    products,
    categories,
    outlets,
    currentOutlet,
    isLoading,
    error,
    refreshData: refetch,
  };
};
