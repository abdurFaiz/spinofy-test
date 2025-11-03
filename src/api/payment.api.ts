import { axiosInstance } from '@/lib/axios';
import type { OrderResponse, StoreOrderPayload, StoreProductResponse } from '@/types/Order';

export class PaymentAPI {
    static async getListPayment(outletSlug: string): Promise<OrderResponse> {
        try {
            const response = await axiosInstance.get<OrderResponse>(`/outlet/${outletSlug}/payment`);
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch outlets');
        }
    }
    static async updateStatusPayment(outletSlug: string, codeOrder: string, payload: { method_id: number }): Promise<OrderResponse> {
        try {
            const response = await axiosInstance.put<OrderResponse>(`/outlet/${outletSlug}/payment/${codeOrder}`, payload);
            return response.data;
        } catch (error) {
            throw new Error(`Failed to update order status for: ${outletSlug}`);
        }
    }

    static async storeProduct(outletSlug: string, payload: StoreOrderPayload): Promise<StoreProductResponse> {
        try {
            const response = await axiosInstance.post<StoreProductResponse>(`/outlet/${outletSlug}/payment/product`, payload);
            return response.data;
        } catch (error) {
            throw new Error(`Failed to post order product for: ${outletSlug}`);
        }
    }

    static async updateOrderProduct(outletSlug: string, orderProductId: number, payload: StoreOrderPayload): Promise<OrderResponse> {
        try {
            const response = await axiosInstance.put<OrderResponse>(`/outlet/${outletSlug}/order/payment/${orderProductId}`, payload);
            return response.data;
        } catch (error) {
            throw new Error(`Failed to update payment for: ${outletSlug}`);
        }
    }
    
    static async updateQuantityPaymentProduct(outletSlug: string, orderProductId: number, payload: {
        "quantity": number,
    }): Promise<OrderResponse> {
        try {
            const response = await axiosInstance.put<OrderResponse>(`/outlet/${outletSlug}/payment/product/${orderProductId}/quantity`, payload);
            return response.data;
        } catch (error) {
            throw new Error(`Failed to update quantity item for: ${outletSlug}`);
        }
    }

    static async deleteOrder(outletSlug: string, codeOrder: string): Promise<OrderResponse> {
        try {
            const response = await axiosInstance.delete<OrderResponse>(`/outlet/${outletSlug}/order/${codeOrder}}`);
            return response.data;
        } catch (error) {
            throw new Error(`Failed to delete order for: ${outletSlug}`);
        }
    }
}

export default PaymentAPI;
