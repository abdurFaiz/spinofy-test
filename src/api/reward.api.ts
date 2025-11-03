import { axiosInstance } from "@/lib/axios";
import type { RewardResponse } from "@/types/Reward";

export class RewardAPI {
    static async getListRewardPoint(outletSlug: string): Promise<RewardResponse> {
        try {
            const response = await axiosInstance.get(`/outlet/${outletSlug}/reward`)
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch reward points');
        }
    }

    static async getHistoryRewardPoint(outletSlug: string): Promise<RewardResponse> {
        try {
            const response = await axiosInstance.get(`/outlet/${outletSlug}/reward/history`)
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch reward points history');
        }
    }
}