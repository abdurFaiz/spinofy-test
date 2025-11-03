export interface OutletResponse {
    status: string;
    message: string;
    data: {
        outlets: Outlet[];
    };
}

// Single outlet response (for /outlet/{slug} endpoint)
export interface SingleOutletResponse {
    status: string;
    message: string;
    data: {
        outlet: Outlet;
    };
}

export interface Outlet {
    id: number;
    uuid: string;
    name: string;
    slug: string;
    phone: string | null;
    address: string | null;
    map: string | null;
    is_active: number;
    created_at: string;
    updated_at: string;
    fee_tax: number;
    products_count: number;
    logo_url: string;
    products: Product[];
    media: Media[];
}

export interface Product {
    id: number;
    uuid: string;
    name: string;
    price: string;
    description: string;
    is_available: number;
    is_recommended: number;
    image: string;
    product_category_id: number;
    outlet_id: number;
    created_at: string;
    updated_at: string;
}

export interface Media {
   
}
