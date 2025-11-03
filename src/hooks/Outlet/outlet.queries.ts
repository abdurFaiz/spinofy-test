import { useQuery } from '@tanstack/react-query';
import OutletProductService, { type OrganizedProducts } from '@/services/outlet/outletProductService';
import type { Outlet } from '@/types/Outlet';

/**
 * Query Keys for outlet-related queries
 */
export const outletQueryKeys = {
    all: ['outlets'] as const,
    lists: () => [...outletQueryKeys.all, 'list'] as const,
    list: (filters?: any) => [...outletQueryKeys.lists(), { filters }] as const,
    details: () => [...outletQueryKeys.all, 'detail'] as const,
    detail: (slug: string) => [...outletQueryKeys.details(), slug] as const,
    products: () => [...outletQueryKeys.all, 'products'] as const,
    productsByOutlet: (slug: string) => [...outletQueryKeys.products(), slug] as const,
    allProducts: () => [...outletQueryKeys.products(), 'all'] as const,
};

/**
 * Hook to fetch all outlets with their products
 */
export const useOutletsWithProducts = () => {
    return useQuery({
        queryKey: outletQueryKeys.allProducts(),
        queryFn: () => OutletProductService.getAllOutletsWithProducts(),
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        retry: 2,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    });
};

/**
 * Hook to fetch products from a specific outlet
 */
export const useOutletProducts = (outletSlug: string, enabled: boolean = true) => {
    return useQuery({
        queryKey: outletQueryKeys.productsByOutlet(outletSlug),
        queryFn: () => OutletProductService.getOutletProducts(outletSlug),
        enabled: enabled && !!outletSlug,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        retry: 2,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    });
};

/**
 * Hook to fetch list of outlets (without products)
 */
export const useOutletsList = () => {
    return useQuery({
        queryKey: outletQueryKeys.lists(),
        queryFn: () => OutletProductService.getOutletsList(),
        staleTime: 10 * 60 * 1000, // 10 minutes
        gcTime: 15 * 60 * 1000, // 15 minutes
        retry: 2,
    });
};

/**
 * Hook to get outlet data and products with automatic fallback
 * This is the main hook for the home page
 */
export const useHomeOutletData = (preferredOutletSlug?: string) => {
    // First, try to get data from a specific outlet if slug is provided
    const specificOutletQuery = useOutletProducts(
        preferredOutletSlug || '',
        !!preferredOutletSlug
    );

    // Fallback: get all outlets with products
    const allOutletsQuery = useOutletsWithProducts();

    // Determine which data to use
    const shouldUseSpecific = preferredOutletSlug && !specificOutletQuery.isError;
    const primaryQuery = shouldUseSpecific ? specificOutletQuery : allOutletsQuery;

    // Transform data for consistent interface
    const data = primaryQuery.data ? (() => {
        if (shouldUseSpecific && specificOutletQuery.data) {
            return {
                outlets: [specificOutletQuery.data.outlet],
                products: specificOutletQuery.data.products,
                currentOutlet: specificOutletQuery.data.outlet,
            };
        } else if (allOutletsQuery.data) {
            return {
                outlets: allOutletsQuery.data.outlets,
                products: allOutletsQuery.data.allProducts,
                currentOutlet: allOutletsQuery.data.outlets?.[0] || null,
            };
        }
        return null;
    })() : null;

    return {
        data,
        isLoading: primaryQuery.isLoading,
        isError: primaryQuery.isError,
        error: primaryQuery.error,
        refetch: primaryQuery.refetch,
        isLoadingError: primaryQuery.isLoadingError,
        isFetching: primaryQuery.isFetching,
    };
};

export type HomeOutletData = {
    outlets: Outlet[];
    products: OrganizedProducts;
    currentOutlet: Outlet | null;
};