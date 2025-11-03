import { axiosInstance } from '@/lib/axios';
import type { OutletResponse, SingleOutletResponse } from '@/types/Outlet';

export class OutletAPI {
    static async getListOutlets(): Promise<OutletResponse> {
        try {
            const response = await axiosInstance.get<OutletResponse>(`/outlet`);
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch outlets');
        }
    }
    static async getOutlet(outletSlug: string): Promise<SingleOutletResponse> {
        try {
            const response = await axiosInstance.get<SingleOutletResponse>(`/outlet/${outletSlug}`);
            return response.data;
        } catch (error) {
            throw new Error(`Failed to fetch outlet information for: ${outletSlug}`);
        }
    }
}

export default OutletAPI;
