import { axiosInstance } from "@/lib/axios";
import type { OrderResponse } from "@/types/Order";

export class OrderAPI {
    static async getListOrders(outletSlug: string): Promise<OrderResponse> {
        try {
            const response = await axiosInstance.get<OrderResponse>(`/outlet/${outletSlug}/order`);
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch order data');
        }
    }

    static async getOrderDetails(outletSlug: string, codeOrder: number): Promise<OrderResponse> {
        try {
            const response = await axiosInstance.get<OrderResponse>(`/outlet/${outletSlug}/order/${codeOrder}`);
            return response.data;
        } catch (error) {
            throw new Error(`Failed to fetch order details for: ${outletSlug}`);
        }
    }

    static async storeDuplicateOrder(outletSlug: string, payload: { code: string }): Promise<OrderResponse> {
        try {
            const response = await axiosInstance.post<OrderResponse>(`/outlet/${outletSlug}/order`, payload);
            return response.data;
        } catch (error) {
            throw new Error(`Failed to duplicate order for: ${outletSlug}`);
        }
    }
}