export interface CartItem {
  
  id: string;
  productUuid: string; // Added for API integration
  name: string;
  price: number;
  quantity: number;
  options: string[];
  size: string;
  ice: string;
  notes?: string;
  image?: string;
  // Additional fields for edit functionality
  orderProductId?: number; // For editing existing order product
  productId?: number; // Numeric product ID for API
  variantIds?: number[]; // Selected product_attribute_value_id
}
