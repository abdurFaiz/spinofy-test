// import type { Voucher } from "@/hooks/Voucher";

export interface CheckoutItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  ice: string;
  options: string[];
  image?: string;
  notes?: string;
}

export interface CheckoutData {
  items: CheckoutItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  appliedVoucher: Voucher | null;
}

export interface CheckoutSummary {
  total: number;
  originalTotal: number;
  savings: number;
}

export interface PaymentDetail {
  id: string;
  label: string;
  value: string;
  isDiscount?: boolean;
  dashed?: boolean;
  highlight?: boolean;
}

export interface SpecialOffer {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface Voucher {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  isActive: boolean;
  minTransaction?: number;
  maxDiscount?: number;
  description?: string;
}

export interface CheckoutValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface VoucherValidationResult {
  canApply: boolean;
  reason?: string;
}

export interface CheckoutConfig {
  taxRate: number;
  currency: string;
  locale: string;
}

export interface CheckoutCalculationResult {
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
}

export interface CheckoutItemUpdate {
  itemId: string;
  quantity: number;
}

export type NavigationAction = "home" | "payment" | "voucher";

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}
