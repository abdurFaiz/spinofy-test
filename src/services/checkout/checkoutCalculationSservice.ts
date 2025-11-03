import type {
  CheckoutItem,
  Voucher,
  CheckoutCalculationResult,
} from "@/types/Checkout";
import { CHECKOUT_CONFIG } from "@/constants/checkout";

export class CheckoutCalculationService {
  /**
   * Calculate subtotal from cart items
   */
  static calculateSubtotal(items: CheckoutItem[]): number {
    if (!items || items.length === 0) return 0;

    return items.reduce((total, item) => {
      const itemTotal = this.calculateItemTotal(item);
      return total + itemTotal;
    }, 0);
  }

  /**
   * Calculate total for a single item
   */
  static calculateItemTotal(item: CheckoutItem): number {
    if (!item || item.price <= 0 || item.quantity <= 0) return 0;
    return Math.round(item.price * item.quantity);
  }

  /**
   * Calculate tax amount based on subtotal
   */
  static calculateTax(subtotal: number): number {
    if (subtotal <= 0) return 0;
    return Math.round(subtotal * CHECKOUT_CONFIG.taxRate);
  }

  /**
   * Calculate discount amount based on voucher
   */
  static calculateDiscount(subtotal: number, voucher: Voucher | null): number {
    if (!voucher || !voucher.isActive || subtotal <= 0) return 0;

    // Check minimum transaction requirement
    if (voucher.minTransaction && subtotal < voucher.minTransaction) {
      return 0;
    }

    let discount = 0;

    try {
      if (voucher.type === "percentage") {
        discount = Math.round(subtotal * (voucher.value / 100));

        // Apply maximum discount if specified
        if (voucher.maxDiscount && discount > voucher.maxDiscount) {
          discount = voucher.maxDiscount;
        }
      } else if (voucher.type === "fixed") {
        discount = Math.min(voucher.value, subtotal);
      }
    } catch (error) {
      console.error("Error calculating discount:", error);
      return 0;
    }

    return Math.max(0, discount);
  }

  /**
   * Calculate final total after tax and discount
   */
  static calculateTotal(
    subtotal: number,
    tax: number,
    discount: number,
  ): number {
    const total = subtotal + tax - discount;
    return Math.max(0, Math.round(total));
  }

  /**
   * Calculate all checkout amounts in one operation
   */
  static calculateAll(
    items: CheckoutItem[],
    voucher: Voucher | null = null,
  ): CheckoutCalculationResult {
    try {
      const subtotal = this.calculateSubtotal(items);
      const tax = this.calculateTax(subtotal);
      const discount = this.calculateDiscount(subtotal, voucher);
      const total = this.calculateTotal(subtotal, tax, discount);

      return {
        subtotal,
        tax,
        discount,
        total,
      };
    } catch (error) {
      console.error("Error in checkout calculation:", error);
      // Return safe default values
      return {
        subtotal: 0,
        tax: 0,
        discount: 0,
        total: 0,
      };
    }
  }

  /**
   * Calculate savings compared to original price
   */
  static calculateSavings(
    _subtotal: number,
    _tax: number,
    discount: number,
  ): number {
    return Math.max(0, discount);
  }

  /**
   * Calculate percentage savings
   */
  static calculateSavingsPercentage(
    subtotal: number,
    tax: number,
    discount: number,
  ): number {
    const originalTotal = subtotal + tax;
    if (originalTotal <= 0 || discount <= 0) return 0;

    return Math.round((discount / originalTotal) * 100);
  }

  /**
   * Validate calculation inputs
   */
  static validateCalculationInputs(
    items: CheckoutItem[],
    voucher?: Voucher | null,
  ): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Validate items
    if (!items || !Array.isArray(items)) {
      errors.push("Items must be a valid array");
    } else if (items.length === 0) {
      errors.push("Items array cannot be empty");
    } else {
      items.forEach((item, index) => {
        if (!item) {
          errors.push(`Item at index ${index} is null or undefined`);
          return;
        }

        if (typeof item.price !== "number" || item.price < 0) {
          errors.push(`Item at index ${index} has invalid price`);
        }

        if (typeof item.quantity !== "number" || item.quantity <= 0) {
          errors.push(`Item at index ${index} has invalid quantity`);
        }
      });
    }

    // Validate voucher if provided
    if (voucher) {
      if (typeof voucher.value !== "number" || voucher.value <= 0) {
        errors.push("Voucher has invalid value");
      }

      if (!["percentage", "fixed"].includes(voucher.type)) {
        errors.push("Voucher has invalid type");
      }

      if (voucher.type === "percentage" && voucher.value > 100) {
        errors.push("Percentage voucher cannot exceed 100%");
      }

      if (
        voucher.minTransaction &&
        (typeof voucher.minTransaction !== "number" ||
          voucher.minTransaction < 0)
      ) {
        errors.push("Voucher has invalid minimum transaction amount");
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Round to nearest currency unit (useful for different currencies)
   */
  static roundToCurrency(amount: number, precision: number = 0): number {
    const factor = Math.pow(10, precision);
    return Math.round(amount * factor) / factor;
  }

  /**
   * Apply bulk discount rules (e.g., buy 3 get 1 free)
   */
  static applyBulkDiscount(
    items: CheckoutItem[],
    rules?: { minQuantity: number; discountPercentage: number }[],
  ): number {
    if (!rules || rules.length === 0) return 0;

    let bulkDiscount = 0;

    items.forEach((item) => {
      const applicableRule = rules
        .filter((rule) => item.quantity >= rule.minQuantity)
        .sort((a, b) => b.discountPercentage - a.discountPercentage)[0]; // Get best discount

      if (applicableRule) {
        const itemSubtotal = item.price * item.quantity;
        bulkDiscount += Math.round(
          itemSubtotal * (applicableRule.discountPercentage / 100),
        );
      }
    });

    return bulkDiscount;
  }

  /**
   * Calculate loyalty points earned
   */
  static calculateLoyaltyPoints(
    total: number,
    pointsPerRupiah: number = 0.01,
  ): number {
    if (total <= 0 || pointsPerRupiah <= 0) return 0;
    return Math.floor(total * pointsPerRupiah);
  }
}
