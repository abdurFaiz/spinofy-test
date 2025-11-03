export interface RewardResponse {
    status: string;
    message: string;
    data: {
        point_balance: number;
        vouchers: Voucher[];
        customer_points: CustomerPoint[];
    };
}

export interface Voucher {
    id: number;
    outlet_id: number;
    name: string;
    description: string;
    discount_amount: number;
    discount_type: string;
    valid_from: string;
    valid_until: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface CustomerPoint {
    id: number;
    outlet_id: number;
    user_id: number;
    point: number;
    type: number;
    pointable_type: string;
    pointable_id: number;
    info: string | null;
    created_at: string;
    updated_at: string;
}
