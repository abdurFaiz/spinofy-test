import { useCart } from "@/store";
import CheckoutService from "@/services/checkout";
import {
  useVoucherCalculation,
  type Voucher,
} from "@/hooks/Voucher/useVoucherCalculation";
import { useMemo } from "react";
import type { CheckoutData } from "@/services/checkout";

interface VoucherCalculationResult {
  originalPrice: number;
  discount: number;
  finalPrice: number;
  tax: number;
  subtotalWithTax: number;
  savings: number;
  savingsPercentage: number;
  canApplyVoucher: boolean;
  errorMessage?: string;
}

export interface CheckoutDataReturn {
  checkoutData: CheckoutData;
  appliedVoucher: Voucher | null;
  voucherCalculation: VoucherCalculationResult;
  formattedPrices: {
    subtotal: string;
    tax: string;
    discount: string;
    total: string;
  };
}

export const useCheckoutData = (): CheckoutDataReturn => {
  const { items, getTotalPrice } = useCart();

  // Calculate subtotal from cart items
  const subtotal = useMemo(() => getTotalPrice(), [getTotalPrice]);

  // Use voucher calculation with the calculated subtotal
  const { calculation, appliedVoucher } = useVoucherCalculation(subtotal, 0.1);

  // Generate checkout data with voucher applied
  const checkoutData = useMemo(
    () => CheckoutService.processCheckoutData(items),
    [items, appliedVoucher],
  );

  // Format prices for display
  const formattedPrices = useMemo(
    () => ({
      subtotal: CheckoutService.formatPrice(checkoutData.subtotal),
      tax: CheckoutService.formatPrice(checkoutData.tax),
      discount: CheckoutService.formatPrice(checkoutData.discount),
      total: CheckoutService.formatPrice(checkoutData.total),
    }),
    [checkoutData],
  );

  return {
    checkoutData,
    appliedVoucher,
    voucherCalculation: calculation,
    formattedPrices,
  };
};
