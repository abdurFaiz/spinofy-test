export interface OrderResponse {
  status: string;
  message: string;
  data: {
    outlet?: Outlet;
    order?: Order[];
    payment_methods?: PaymentMethod[];
    message?: string;
    data?: {
      id: number;
      uuid: string;
      code: string;
      sub_total: number;
      tax: number;
      fee_service: number;
      total: number;
      status: number;
      user_id: number;
      outlet_id: number;
      created_at: string;
      updated_at: string;
      table_number_id?: number;
      status_label: string;
      order_products: OrderProduct[];
    };
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
  fee_tax: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: number;
  uuid: string;
  code: string;
  sub_total: number;
  tax: number;
  fee_service: number;
  total: number;
  status: number;
  status_label: string;
  user_id: number;
  outlet_id: number;
  payment_method_id?: number;
  created_at: string;
  updated_at: string;
  order_products: OrderProduct[];
  customer_point: CustomerPoint;
  outlet: Outlet;
}

export interface PaymentMethod {
  id: number;
  name: string;
  fee: number;
  logo: string;
}

export interface OrderProduct {
  id: number;
  price: number;
  quantity: number;
  extra_price: number;
  total: number;
  note: string;
  order_id: number;
  user_id: number;
  product_id: number;
  created_at: string;
  updated_at: string;
  product: Product;
  order_product_variant: OrderProductVariant[];
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
  image_url?: string;
  product_category_id: number;
  outlet_id: number;
  created_at: string;
  updated_at: string;
}

export interface OrderProductVariant {
  id: number;
  price: number;
  order_product_id: number;
  product_attribute_value_id: number;
  created_at: string;
  updated_at: string;
  product_attribute_value: ProductAttributeValue;
}

export interface ProductAttributeValue {
  id: number;
  name: string;
  extra_price: number;
  product_attribute_id: number;
  outlet_id: number;
  created_at: string;
  updated_at: string;
}

export interface StoreOrderPayload {
  product_id: number;
  variant_id: number[];
  quantity: number;
  note: string;
}

export interface CustomerPoint {
  id: number;
  point: number;
  type: number;
  info: string | null;
  user_id: number;
  outlet_id: number;
  pointable_type: string;
  pointable_id: number;
  created_at: string;
  updated_at: string;
}

// Response interface specifically for storeProduct API
export interface StoreProductResponse {
  status: string;
  message: string;
  data: {
    message: string;
    data: Order;
  };
}

// Enhanced Order interface to include all possible fields
export interface EnhancedOrder extends Omit<Order, 'customer_point'> {
  table_number_id?: number;
  delivery_fee?: number;
  packaging_fee?: number;
  platform_fee?: number;
  discount?: number;
  points_used?: number;
  points_value?: number;
  voucher_discount?: number;
  customer_point?: CustomerPoint;
  barcode?: string;
}