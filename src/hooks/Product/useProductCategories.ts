import { useQuery } from '@tanstack/react-query';
import ProductAPI from '@/api/product.api';
import type { Category } from '@/types/Product';

/**
 * Hook to fetch and manage product categories
 */
export const useProductCategories = () => {
  // First, get the list of outlets to get the outlet slug
  const {
    data: outletsResponse,
    isLoading: outletsLoading,
    error: outletsError
  } = useQuery({
    queryKey: ['outlets-list'],
    queryFn: () => import('@/api/outlet.api').then(({ OutletAPI }) => OutletAPI.getListOutlets()),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Get the first outlet's slug
  const firstOutlet = outletsResponse?.data?.outlets?.[0];
  const outletSlug = firstOutlet?.slug;

  const {
    data: productResponse,
    isLoading: productsLoading,
    error: productsError,
    refetch
  } = useQuery({
    queryKey: ['product-categories', outletSlug],
    queryFn: () => {
      if (!outletSlug) {
        throw new Error('No outlet available to fetch categories');
      }
      return ProductAPI.getAllProduct(outletSlug);
    },
    enabled: !!outletSlug,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const isLoading = outletsLoading || productsLoading;
  const error = outletsError || productsError;    // Extract categories from the API response
    const categories: Category[] = productResponse?.data?.[0]?.categories || [];

  // Transform categories to the format expected by the UI
  const sortedCategories = [...categories].sort((a, b) => a.position - b.position);
  const categoryNames: string[] = sortedCategories.map(category => category.name);    return {
        categories: categoryNames,
        categoriesData: categories,
        isLoading,
        error,
        refetch,
    };
};