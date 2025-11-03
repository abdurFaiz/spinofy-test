import type {
  CheckoutItem,
  CheckoutData,
  CheckoutSummary,
  PaymentDetail,
  Voucher,
  NavigationAction,
} from "@/types/Checkout";
import type { CartItem } from "@/types/Cart";
import { CheckoutCalculationService } from "./checkoutCalculationSservice";
import { CheckoutDataService } from "./checkoutDataSservice";
import { CheckoutValidationService } from "./checkoutValidationService";
import { CheckoutNavigationService } from "./checkoutNavigationService";

/**
 * Main Checkout Service - Orchestrates all checkout-related operations
 * Acts as a facade for all checkout services
 */
export class CheckoutService {
  // Calculation Operations
  static calculateSubtotal(items: CheckoutItem[]): number {
    return CheckoutCalculationService.calculateSubtotal(items);
  }

  static calculateTax(subtotal: number): number {
    return CheckoutCalculationService.calculateTax(subtotal);
  }

  static calculateDiscount(subtotal: number, voucher: Voucher | null): number {
    return CheckoutCalculationService.calculateDiscount(subtotal, voucher);
  }

  static calculateTotal(
    subtotal: number,
    tax: number,
    discount: number,
  ): number {
    return CheckoutCalculationService.calculateTotal(subtotal, tax, discount);
  }

  static calculateAll(items: CheckoutItem[], voucher: Voucher | null = null) {
    return CheckoutCalculationService.calculateAll(items, voucher);
  }

  // Data Processing Operations
  static processCheckoutData(
    items: CartItem[],
    appliedVoucher: Voucher | null = null,
  ): CheckoutData {
    return CheckoutDataService.processCheckoutData(items, appliedVoucher);
  }

  static formatCartItemsForCheckout(items: CartItem[]): CheckoutItem[] {
    return CheckoutDataService.formatCartItemsForCheckout(items);
  }

  static generatePaymentDetails(checkoutData: CheckoutData): PaymentDetail[] {
    return CheckoutDataService.generatePaymentDetails(checkoutData);
  }

  static generateCheckoutSummary(checkoutData: CheckoutData): CheckoutSummary {
    return CheckoutDataService.generateCheckoutSummary(checkoutData);
  }

  static updateItemQuantity(
    checkoutData: CheckoutData,
    itemId: string,
    newQuantity: number,
    voucher?: Voucher | null,
  ): CheckoutData {
    return CheckoutDataService.updateItemQuantity(
      checkoutData,
      itemId,
      newQuantity,
      voucher,
    );
  }

  static removeItem(
    checkoutData: CheckoutData,
    itemId: string,
    voucher?: Voucher | null,
  ): CheckoutData {
    return CheckoutDataService.removeItem(checkoutData, itemId, voucher);
  }

  static applyVoucher(
    checkoutData: CheckoutData,
    voucher: Voucher | null,
  ): CheckoutData {
    return CheckoutDataService.applyVoucher(checkoutData, voucher);
  }

  // Validation Operations
  static validateCheckout(items: CheckoutItem[]) {
    return CheckoutValidationService.validateCheckout(items);
  }

  static canApplyVoucher(subtotal: number, voucher: Voucher | null) {
    return CheckoutValidationService.canApplyVoucher(subtotal, voucher);
  }

  static validateVoucherDetails(voucher: Voucher) {
    return CheckoutValidationService.validateVoucherDetails(voucher);
  }

  static validateQuantityUpdate(currentQuantity: number, newQuantity: number) {
    return CheckoutValidationService.validateQuantityUpdate(
      currentQuantity,
      newQuantity,
    );
  }

  static validateForPayment(items: CheckoutItem[], total: number) {
    return CheckoutValidationService.validateForPayment(items, total);
  }

  static validateCheckoutData(checkoutData: CheckoutData) {
    return CheckoutDataService.validateCheckoutData(checkoutData);
  }

  // Navigation Operations
  static handleCheckoutNavigation(
    action: NavigationAction,
    navigate: (path: string) => void,
    params?: Record<string, string>,
  ): void {
    return CheckoutNavigationService.handleCheckoutNavigation(
      action,
      navigate,
      params,
    );
  }

  static navigateToOrderTracking(
    navigate: (path: string) => void,
    orderId?: string,
  ): void {
    return CheckoutNavigationService.navigateToOrderTracking(navigate, orderId);
  }

  static navigateBack(
    navigate: (path: string) => void,
    fallbackPath?: string,
  ): void {
    return CheckoutNavigationService.navigateBack(navigate, fallbackPath);
  }

  static buildCheckoutUrl(
    baseUrl: string,
    checkoutData?: Record<string, string>,
  ): string {
    return CheckoutNavigationService.buildCheckoutUrl(baseUrl, checkoutData);
  }

  static handlePostCheckoutNavigation(
    navigate: (path: string) => void,
    orderId: string,
    action?: "track" | "home" | "continue_shopping",
  ): void {
    return CheckoutNavigationService.handlePostCheckoutNavigation(
      navigate,
      orderId,
      action,
    );
  }

  // Utility Methods for Components
  static formatPrice(amount: number): string {
    return `Rp ${amount.toLocaleString("id-ID")}`;
  }

  static handleItemQuantityUpdate(
    items: CheckoutItem[],
    itemId: string,
    newQuantity: number,
    updateQuantityFn: (id: string, quantity: number) => void,
  ): void {
    try {
      const item = items.find((i) => i.id === itemId);
      if (item) {
        const validation = CheckoutValidationService.validateQuantityUpdate(
          item.quantity,
          newQuantity,
        );
        if (validation.isValid) {
          const finalQuantity = Math.max(1, newQuantity);
          updateQuantityFn(itemId, finalQuantity);
        } else {
          console.warn("Invalid quantity update:", validation.errors);
        }
      }
    } catch (error) {
      console.error("Error updating item quantity:", error);
    }
  }

  // Helper Methods for Advanced Operations
  static async processCompleteCheckout(
    items: CartItem[],
    voucher: Voucher | null = null,
    validateBeforeProcessing: boolean = true,
  ): Promise<{
    success: boolean;
    checkoutData?: CheckoutData;
    paymentDetails?: PaymentDetail[];
    summary?: CheckoutSummary;
    errors?: string[];
  }> {
    try {
      // Convert cart items to checkout items
      const checkoutItems = this.formatCartItemsForCheckout(items);

      // Validate if requested
      if (validateBeforeProcessing) {
        const validation = this.validateCheckout(checkoutItems);
        if (!validation.isValid) {
          return {
            success: false,
            errors: validation.errors,
          };
        }

        // Validate voucher if provided
        if (voucher) {
          const subtotal = this.calculateSubtotal(checkoutItems);
          const voucherValidation = this.canApplyVoucher(subtotal, voucher);
          if (!voucherValidation.canApply) {
            return {
              success: false,
              errors: [voucherValidation.reason || "Cannot apply voucher"],
            };
          }
        }
      }

      // Process checkout data
      const checkoutData = this.processCheckoutData(items, voucher);
      const paymentDetails = this.generatePaymentDetails(checkoutData);
      const summary = this.generateCheckoutSummary(checkoutData);

      return {
        success: true,
        checkoutData,
        paymentDetails,
        summary,
      };
    } catch (error) {
      console.error("Error processing complete checkout:", error);
      return {
        success: false,
        errors: [
          error instanceof Error ? error.message : "Checkout processing failed",
        ],
      };
    }
  }

  // Advanced Calculation Methods
  static calculateLoyaltyPoints(
    total: number,
    pointsPerRupiah: number = 0.01,
  ): number {
    return CheckoutCalculationService.calculateLoyaltyPoints(
      total,
      pointsPerRupiah,
    );
  }

  static calculateSavings(
    subtotal: number,
    tax: number,
    discount: number,
  ): number {
    return CheckoutCalculationService.calculateSavings(subtotal, tax, discount);
  }

  static calculateSavingsPercentage(
    subtotal: number,
    tax: number,
    discount: number,
  ): number {
    return CheckoutCalculationService.calculateSavingsPercentage(
      subtotal,
      tax,
      discount,
    );
  }

  // Configuration Methods
  static getTaxRate(): number {
    return (
      (
        CheckoutCalculationService as unknown as {
          CHECKOUT_CONFIG?: { taxRate: number };
        }
      ).CHECKOUT_CONFIG?.taxRate || 0.1
    );
  }

  static getCurrency(): string {
    return "Rp";
  }

  static getLocale(): string {
    return "id-ID";
  }

  // Debug Methods (for development)
  static debugCheckoutData(checkoutData: CheckoutData): void {
    if (
      typeof window !== "undefined" &&
      (window as unknown as { __NODE_ENV__?: string }).__NODE_ENV__ ===
        "development"
    ) {
      console.group("🛒 Checkout Debug Info");
      console.log("Items:", checkoutData.items);
      console.log("Calculations:", {
        subtotal: checkoutData.subtotal,
        tax: checkoutData.tax,
        discount: checkoutData.discount,
        total: checkoutData.total,
      });
      console.log("Applied Voucher:", checkoutData.appliedVoucher);
      console.groupEnd();
    }
  }

  // Migration helper for backward compatibility
  static migrateFromLegacyCheckout(legacyData: unknown): CheckoutData {
    try {
      // Handle legacy checkout data format if needed
      if (
        legacyData &&
        typeof legacyData === "object" &&
        legacyData !== null &&
        "items" in legacyData &&
        Array.isArray((legacyData as { items: unknown }).items)
      ) {
        const typedLegacyData = legacyData as {
          items: CartItem[];
          appliedVoucher?: Voucher | null;
        };
        return this.processCheckoutData(
          typedLegacyData.items,
          typedLegacyData.appliedVoucher || null,
        );
      }
      throw new Error("Invalid legacy checkout data");
    } catch (error) {
      console.error("Error migrating legacy checkout data:", error);
      return {
        items: [],
        subtotal: 0,
        tax: 0,
        discount: 0,
        total: 0,
        appliedVoucher: null,
      };
    }
  }
}

export default CheckoutService;
