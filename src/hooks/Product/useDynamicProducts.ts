import { useQuery } from '@tanstack/react-query';
import ProductAPI from '@/api/product.api';
import { DynamicProductOrganizer } from '@/services/product/dynamicProductOrganizer';
import { ProductLookupService } from '@/services/product/productLookupService';
import type { HomeProduct } from '@/services/outlet/outletProductService';
import type { Category } from '@/types/Product';
import { useEffect } from 'react';
import { useOutletSlug } from '@/hooks/useOutletSlug';

export interface DynamicOrganizedProducts {
    recommendations: HomeProduct[];
    [categoryKey: string]: HomeProduct[];
}

/**
 * Hook to fetch and organize products dynamically based on API categories
 */
export const useDynamicProducts = () => {
    // Get outlet slug from URL parameters
    const outletSlug = useOutletSlug();

    // Get the list of outlets to find current outlet info
    const {
        data: outletsResponse,
        isLoading: outletsLoading,
        error: outletsError
    } = useQuery({
        queryKey: ['outlets-list'],
        queryFn: () => import('@/api/outlet.api').then(({ OutletAPI }) => OutletAPI.getListOutlets()),
        staleTime: 10 * 60 * 1000, // 10 minutes
    });

    // Find the current outlet by slug
    const currentOutlet = outletsResponse?.data?.outlets?.find(
        outlet => outlet.slug === outletSlug
    ) || null;

    // Then fetch products for the selected outlet
    const {
        data: productResponse,
        isLoading: productsLoading,
        error: productsError,
        refetch
    } = useQuery({
        queryKey: ['dynamic-products', outletSlug],
        queryFn: () => {
            if (!outletSlug) {
                throw new Error('No outlet available to fetch products');
            }
            return ProductAPI.getAllProduct(outletSlug);
        },
        enabled: !!outletSlug, // Only run when we have an outlet slug
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    const isLoading = outletsLoading || productsLoading;
    const error = outletsError || productsError;

    // Extract data from API response
    const apiData = productResponse?.data?.[0];
    const categories: Category[] = apiData?.categories || [];
    const products = apiData?.products || [];

    // Organize products by categories
    const organizedProducts: DynamicOrganizedProducts = DynamicProductOrganizer.organizeProductsByCategories(
        products,
        categories
    );

    // Update ProductLookupService with all products
    useEffect(() => {
        if (organizedProducts && categories.length > 0) {
            // Create dynamic lookup format based on API categories
            const lookupFormat: any = {
                recommendations: organizedProducts.recommendations,
            };

            // Add all dynamic categories to lookup format
            for (const category of categories) {
                const categoryKey = DynamicProductOrganizer.getCategoryKey(category.name);
                const categoryProducts = organizedProducts[categoryKey] || [];
                lookupFormat[categoryKey] = categoryProducts;
            }

            ProductLookupService.setProducts(lookupFormat);
        }
    }, [organizedProducts, categories]);

    return {
        products: organizedProducts,
        categories,
        outlets: outletsResponse?.data?.outlets || [],
        currentOutlet: currentOutlet,
        isLoading,
        error,
        refetch,
        // Helper functions
        getCategoryDisplayName: (categoryKey: string) =>
            DynamicProductOrganizer.getCategoryDisplayName(categoryKey, categories),
        createSectionId: DynamicProductOrganizer.createSectionId,
    };
};
