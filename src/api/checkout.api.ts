import { axiosInstance } from "@/lib/axios";
import type { OrderResponse } from "@/types/Order";

export class CheckoutAPI {
    /**
     * Get checkout order details including barcode and payment info
     * Used in Payment page to display QRIS barcode
     */
    static async getDataCheckoutOrders(outletSlug: string, codeOrder: number): Promise<OrderResponse> {
        try {
            const response = await axiosInstance.get<OrderResponse>(`/outlet/${outletSlug}/checkout/${codeOrder}`);
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch checkout data');
        }
    }
}