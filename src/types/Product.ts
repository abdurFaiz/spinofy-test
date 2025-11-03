export interface ProductResponse {
  status: string;
  message: string;
  data: ProductData[];
}

export interface ProductData {
  categories: Category[];
  recommendedProducts: Product[];
  products: Product[];
}

export interface Category {
  id: number;
  position: number;
  name: string;
  outlet_id: number;
  created_at: string;
  updated_at: string;
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
  image_url: string;
}

export interface RecommendedProducts {
  id: number;
  uuid: string;
  name: string;
  price: string;
  description: string;
  is_available: number;
  is_recommended: number;
  image: string;
  image_url: string;
  product_category_id: number;
  outlet_id: number;
  created_at: string;
  updated_at: string;
}

