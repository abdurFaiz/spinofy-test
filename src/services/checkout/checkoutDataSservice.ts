import type { CheckoutItem, CheckoutData, CheckoutSummary, PaymentDetail, Voucher } from '@/types/Checkout';
import type { CartItem } from '@/types/Cart';
import { CheckoutCalculationService } from './checkoutCalculationSservice';
import {
  CHECKOUT_CONFIG,
  PAYMENT_DETAIL_IDS,
  PAYMENT_DETAIL_LABELS
} from '@/constants/checkout';

export class CheckoutDataService {
  /**
   * Process complete checkout data from cart items
   */
  static processCheckoutData(
    items: CartItem[],
    appliedVoucher: Voucher | null = null
  ): CheckoutData {
    try {
      const formattedItems = this.formatCartItemsForCheckout(items);
      const calculations = CheckoutCalculationService.calculateAll(formattedItems, appliedVoucher);

      return {
        items: formattedItems,
        subtotal: calculations.subtotal,
        tax: calculations.tax,
        discount: calculations.discount,
        total: calculations.total,
        appliedVoucher,
      };
    } catch (error) {
      console.error('Error processing checkout data:', error);
      // Return safe default checkout data
      return this.getEmptyCheckoutData();
    }
  }

  /**
   * Format cart items for checkout display
   */
  static formatCartItemsForCheckout(items: CartItem[]): CheckoutItem[] {
    if (!items || !Array.isArray(items)) {
      return [];
    }

    return items
      .filter(item => item && item.quantity > 0) // Filter out invalid items
      .map(item => this.formatSingleCartItem(item))
      .filter(item => item !== null) as CheckoutItem[];
  }

  /**
   * Format a single cart item for checkout
   */
  private static formatSingleCartItem(item: CartItem): CheckoutItem | null {
    try {
      if (!item || !item.name || item.price <= 0 || item.quantity <= 0) {
        return null;
      }

      return {
        id: item.id || `item_${Date.now()}_${Math.random()}`,
        name: item.name.trim(),
        notes: item.notes ? item.notes.trim() : undefined,
        price: Math.max(0, item.price),
        image: item.image,
        quantity: Math.max(1, Math.floor(item.quantity)),
        size: item.size || 'Regular',
        ice: item.ice || 'Normal',
        options: Array.isArray(item.options) ? [...item.options] : [],
      };
    } catch (error) {
      console.error('Error formatting cart item:', error, item);
      return null;
    }
  }

  /**
   * Generate payment details breakdown
   */
  static generatePaymentDetails(checkoutData: CheckoutData): PaymentDetail[] {
    const { subtotal, tax, discount, total, appliedVoucher } = checkoutData;

    try {
      const details: PaymentDetail[] = [];

      // Add subtotal
      details.push({
        id: PAYMENT_DETAIL_IDS.SUBTOTAL,
        label: PAYMENT_DETAIL_LABELS.SUBTOTAL,
        value: this.formatCurrency(subtotal),
      });

      // Add tax
      if (tax > 0) {
        details.push({
          id: PAYMENT_DETAIL_IDS.TAX,
          label: PAYMENT_DETAIL_LABELS.TAX,
          value: this.formatCurrency(tax),
        });
      }

      // Add discount if voucher is applied
      if (appliedVoucher && discount > 0) {
        details.push({
          id: PAYMENT_DETAIL_IDS.DISCOUNT,
          label: PAYMENT_DETAIL_LABELS.DISCOUNT,
          value: `- ${this.formatCurrency(discount)}`,
          isDiscount: true,
          dashed: true,
        });
      }

      // Add total
      details.push({
        id: PAYMENT_DETAIL_IDS.TOTAL,
        label: PAYMENT_DETAIL_LABELS.TOTAL,
        value: this.formatCurrency(total),
        highlight: true,
      });

      return details;
    } catch (error) {
      console.error('Error generating payment details:', error);
      return this.getDefaultPaymentDetails(total);
    }
  }

  /**
   * Generate checkout summary
   */
  static generateCheckoutSummary(checkoutData: CheckoutData): CheckoutSummary {
    const { subtotal, tax, discount, total } = checkoutData;

    try {
      const originalTotal = subtotal + tax;
      const savings = CheckoutCalculationService.calculateSavings(subtotal, tax, discount);

      return {
        total,
        originalTotal,
        savings,
      };
    } catch (error) {
      console.error('Error generating checkout summary:', error);
      return {
        total: checkoutData.total || 0,
        originalTotal: checkoutData.total || 0,
        savings: 0,
      };
    }
  }

  /**
   * Update item quantity in checkout data
   */
  static updateItemQuantity(
    checkoutData: CheckoutData,
    itemId: string,
    newQuantity: number,
    voucher?: Voucher | null
  ): CheckoutData {
    try {
      const updatedItems = checkoutData.items.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity: Math.max(1, Math.floor(newQuantity))
          };
        }
        return item;
      });

      return this.processCheckoutData(
        this.convertToCartItems(updatedItems),
        voucher || checkoutData.appliedVoucher
      );
    } catch (error) {
      console.error('Error updating item quantity:', error);
      return checkoutData;
    }
  }

  /**
   * Remove item from checkout data
   */
  static removeItem(
    checkoutData: CheckoutData,
    itemId: string,
    voucher?: Voucher | null
  ): CheckoutData {
    try {
      const updatedItems = checkoutData.items.filter(item => item.id !== itemId);

      if (updatedItems.length === 0) {
        return this.getEmptyCheckoutData();
      }

      return this.processCheckoutData(
        this.convertToCartItems(updatedItems),
        voucher || checkoutData.appliedVoucher
      );
    } catch (error) {
      console.error('Error removing item:', error);
      return checkoutData;
    }
  }

  /**
   * Apply or remove voucher from checkout data
   */
  static applyVoucher(
    checkoutData: CheckoutData,
    voucher: Voucher | null
  ): CheckoutData {
    try {
      return this.processCheckoutData(
        this.convertToCartItems(checkoutData.items),
        voucher
      );
    } catch (error) {
      console.error('Error applying voucher:', error);
      return checkoutData;
    }
  }

  /**
   * Format currency amount
   */
  private static formatCurrency(amount: number): string {
    return `${CHECKOUT_CONFIG.currency} ${amount.toLocaleString(CHECKOUT_CONFIG.locale)}`;
  }

  /**
   * Convert checkout items back to cart items
   */
  private static convertToCartItems(items: CheckoutItem[]): CartItem[] {
    return items.map(item => ({
      id: item.id,
      productUuid: item.id, // Use item id as productUuid since CheckoutItem doesn't track product UUID
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      size: item.size,
      ice: item.ice,
      options: [...item.options],
      image: item.image,
      notes: item.notes,
    } as CartItem));
  }

  /**
   * Get empty checkout data
   */
  private static getEmptyCheckoutData(): CheckoutData {
    return {
      items: [],
      subtotal: 0,
      tax: 0,
      discount: 0,
      total: 0,
      appliedVoucher: null,
    };
  }

  /**
   * Get default payment details for error cases
   */
  private static getDefaultPaymentDetails(total: number): PaymentDetail[] {
    return [
      {
        id: PAYMENT_DETAIL_IDS.TOTAL,
        label: PAYMENT_DETAIL_LABELS.TOTAL,
        value: this.formatCurrency(total),
        highlight: true,
      },
    ];
  }

  /**
   * Calculate item total with options
   */
  static calculateItemTotalWithOptions(item: CheckoutItem, optionPrices?: Record<string, number>): number {
    let baseTotal = item.price * item.quantity;

    if (optionPrices && item.options.length > 0) {
      const optionsTotal = item.options.reduce((total, option) => {
        return total + (optionPrices[option] || 0);
      }, 0);
      baseTotal += optionsTotal * item.quantity;
    }

    return Math.round(baseTotal);
  }

  /**
   * Get item display name with options
   */
  static getItemDisplayName(item: CheckoutItem): string {
    let displayName = item.name;

    const details: string[] = [];

    if (item.size && item.size !== 'Regular') {
      details.push(item.size);
    }

    if (item.ice && item.ice !== 'Normal') {
      details.push(item.ice);
    }

    if (item.options && item.options.length > 0) {
      details.push(...item.options);
    }

    if (details.length > 0) {
      displayName += ` (${details.join(', ')})`;
    }

    return displayName;
  }

  /**
   * Validate checkout data integrity
   */
  static validateCheckoutData(checkoutData: CheckoutData): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    try {
      if (!checkoutData) {
        errors.push('Checkout data is missing');
        return { isValid: false, errors };
      }

      // Validate items
      if (!Array.isArray(checkoutData.items)) {
        errors.push('Items must be an array');
      } else if (checkoutData.items.length === 0) {
        errors.push('No items in checkout');
      }

      // Validate calculations
      const recalculated = CheckoutCalculationService.calculateAll(
        checkoutData.items,
        checkoutData.appliedVoucher
      );

      const tolerance = 1; // Allow 1 rupiah tolerance for rounding

      if (Math.abs(checkoutData.subtotal - recalculated.subtotal) > tolerance) {
        errors.push('Subtotal calculation mismatch');
      }

      if (Math.abs(checkoutData.tax - recalculated.tax) > tolerance) {
        errors.push('Tax calculation mismatch');
      }

      if (Math.abs(checkoutData.discount - recalculated.discount) > tolerance) {
        errors.push('Discount calculation mismatch');
      }

      if (Math.abs(checkoutData.total - recalculated.total) > tolerance) {
        errors.push('Total calculation mismatch');
      }

    } catch (error) {
      errors.push(`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
