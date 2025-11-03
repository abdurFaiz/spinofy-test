import { axiosInstance } from "@/lib/axios";
import type { OrderResponse } from "@/types/Order";

export class WebhookAPI {
    static async sendWebhookNotification(payload: { code: string }): Promise<OrderResponse> {
        try {
            const response = await axiosInstance.post(`/webhook/payment/handler`, payload);
            return response.data;
        } catch (error) {
            throw new Error('Failed to send webhook status order');
        }
    }
}