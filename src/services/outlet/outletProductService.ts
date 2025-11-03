import OutletAPI from '@/api/outlet.api';
import type { Outlet, OutletResponse, Product as OutletProduct, SingleOutletResponse } from '@/types/Outlet';

export interface HomeProduct {
    id: string;
    name: string;
    price: number;
    description: string;
    image: string;
    isAvailable: boolean;
    isRecommended?: boolean;
    categoryId?: number;
}

export interface OrganizedProducts {
    recommendations: HomeProduct[];
    kopiSusu: HomeProduct[];
    americano: HomeProduct[];
    cruasan: HomeProduct[];
}

/**
 * Outlet Product Service
 * Handles fetching and organizing products from outlets
 */
export class OutletProductService {
    /**
     * Transform outlet API product to HomeProduct format
     */
    private static transformToHomeProduct(apiProduct: OutletProduct): HomeProduct {
        // Convert relative image path to full URL
        const getImageUrl = (imagePath: string): string => {
            if (!imagePath) return '';

            // If already a full URL, return as-is
            if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
                return imagePath;
            }

            // Convert relative path to full Laravel storage URL
            const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000';
            return `${baseUrl}storage/${imagePath}`;
        };

        return {
            id: apiProduct.uuid,
            name: apiProduct.name,
            price: Number.parseInt(apiProduct.price, 10), // Convert string price to number
            description: apiProduct.description,
            image: getImageUrl(apiProduct.image),
            isAvailable: Boolean(apiProduct.is_available),
            isRecommended: Boolean(apiProduct.is_recommended),
            categoryId: apiProduct.product_category_id,
        };
    }

    /**
     * Get all products from all outlets
     */
    static async getAllOutletsWithProducts(): Promise<{
        outlets: Outlet[];
        allProducts: OrganizedProducts;
    }> {
        try {
            
            const response: OutletResponse = await OutletAPI.getListOutlets();

           

            if (!response) {
                throw new Error('No response received from API');
            }

            if (response.status !== 'success') {
                console.error('API returned error status:', response.status, response.message || 'No message');
                throw new Error(`API Error: ${response.message || 'Unknown error'}`);
            }

            if (!response.data) {
                console.error('No data in response:', response);
                throw new Error('No data received from API');
            }

            if (!response.data.outlets) {
                console.error('No outlets in response data:', response.data);
                throw new Error('No outlets found in API response');
            }

            const outlets = response.data.outlets;
           

            // Collect all products from all outlets
            const allProducts: OutletProduct[] = [];
            for (const outlet of outlets) {
                if (outlet.products && outlet.products.length > 0) {
                    console.log(`Outlet "${outlet.name}" has ${outlet.products.length} products`);
                    allProducts.push(...outlet.products);
                } else {
                    console.log(`Outlet "${outlet.name}" has no products`);
                }
            }

          

            // Transform and organize products
            const transformedProducts = allProducts.map(this.transformToHomeProduct);
            const organizedProducts = this.organizeProducts(transformedProducts);

            return {
                outlets,
                allProducts: organizedProducts,
            };
        } catch (error) {
            console.error('Error fetching outlets with products:', error);

            // Return empty data instead of throwing to prevent app crash
            return {
                outlets: [],
                allProducts: {
                    recommendations: [],
                    kopiSusu: [],
                    americano: [],
                    cruasan: [],
                },
            };
        }
    }

    /**
     * Get products from a specific outlet by slug
     */
    static async getOutletProducts(outletSlug: string): Promise<{
        outlet: Outlet;
        products: OrganizedProducts;
    }> {
        try {
           
            const response: SingleOutletResponse = await OutletAPI.getOutlet(outletSlug);

           

            if (!response) {
                throw new Error(`No response received for outlet: ${outletSlug}`);
            }

            if (response.status !== 'success') {
                console.error('Outlet API error:', response.status, response.message);
                throw new Error(`API Error for outlet ${outletSlug}: ${response.message || 'Unknown error'}`);
            }

            if (!response.data.outlet) {
                console.error('No outlet data found:', response.data);
                throw new Error(`Outlet not found: ${outletSlug}`);
            }

            const outlet = response.data.outlet;
            const products = outlet.products || [];

            

            // Transform and organize products
            const transformedProducts = products.map(this.transformToHomeProduct);
            const organizedProducts = this.organizeProducts(transformedProducts);

            return {
                outlet,
                products: organizedProducts,
            };
        } catch (error) {
            console.error(`Error fetching products for outlet ${outletSlug}:`, error);

            // Return a fallback outlet structure to prevent crashes
            throw error; // Re-throw for this method since it's more specific
        }
    }

    /**
     * Organize products by category
     * This is a basic categorization - you may want to improve this based on actual category names
     */
    private static organizeProducts(products: HomeProduct[]): OrganizedProducts {
        const recommendations = products.filter(p => p.isRecommended);

        // Basic categorization - you might want to improve this based on actual category data
        const kopiSusu = products.filter(p =>
            p.name.toLowerCase().includes('kopi') ||
            p.name.toLowerCase().includes('latte') ||
            p.name.toLowerCase().includes('cappuccino')
        );

        const americano = products.filter(p =>
            p.name.toLowerCase().includes('americano') ||
            p.name.toLowerCase().includes('espresso')
        );

        const cruasan = products.filter(p =>
            p.name.toLowerCase().includes('croissant') ||
            p.name.toLowerCase().includes('pastry') ||
            p.name.toLowerCase().includes('bread') ||
            p.name.toLowerCase().includes('cake')
        );

        return {
            recommendations,
            kopiSusu,
            americano,
            cruasan,
        };
    }

    /**
     * Get list of available outlets (without products)
     */
    static async getOutletsList(): Promise<Outlet[]> {
        try {
            const response: OutletResponse = await OutletAPI.getListOutlets();

            if (response.status !== 'success' || !response.data?.outlets) {
                throw new Error('Failed to fetch outlets list');
            }

            return response.data.outlets;
        } catch (error) {
            console.error('Error fetching outlets list:', error);
            throw error;
        }
    }
}

export default OutletProductService;