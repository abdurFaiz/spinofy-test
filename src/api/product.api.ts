import { axiosInstance } from '@/lib/axios';
import type { ProductDetailResponse } from '@/types/DetailProduct';
import type { ProductResponse } from '@/types/Product';

export class ProductAPI {
    static async getAllProduct(outletSlug: string): Promise<ProductResponse> {
        try {
            const response = await axiosInstance.get<ProductResponse>(`/outlet/${outletSlug}/products`);
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch products');
        }
    }

    static async getProduct(outletSlug: string, productUuid: string): Promise<ProductDetailResponse> {
        try {
            const response = await axiosInstance.get(`/outlet/${outletSlug}/products/${productUuid}`);
            return response.data;
        } catch (error) {
            throw new Error(`Failed to fetch product ${productUuid}`);
        }
    }
}

export default ProductAPI;
