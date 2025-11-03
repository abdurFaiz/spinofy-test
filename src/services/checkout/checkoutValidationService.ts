import type { CheckoutItem, Voucher, CheckoutValidationResult, VoucherValidationResult } from '@/types/Checkout';
import { CHECKOUT_ERRORS, CHECKOUT_CONFIG } from '@/constants/checkout';

export class CheckoutValidationService {
  /**
   * Validate checkout items before processing
   */
  static validateCheckout(items: CheckoutItem[]): CheckoutValidationResult {
    const errors: string[] = [];

    try {
      // Check if cart is empty
      if (!items || !Array.isArray(items) || items.length === 0) {
        errors.push(CHECKOUT_ERRORS.EMPTY_CART);
        return { isValid: false, errors };
      }

      // Validate each item
      items.forEach((item, index) => {
        const itemErrors = this.validateSingleItem(item, index);
        errors.push(...itemErrors);
      });

    } catch (error) {
      console.error('Error validating checkout:', error);
      errors.push('Validation error occurred');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate a single checkout item
   */
  private static validateSingleItem(item: CheckoutItem, index: number): string[] {
    const errors: string[] = [];

    if (!item) {
      errors.push(`Item ${index + 1}: Item is null or undefined`);
      return errors;
    }

    // Validate name
    if (!item.name || typeof item.name !== 'string' || item.name.trim() === '') {
      errors.push(CHECKOUT_ERRORS.INVALID_ITEM_NAME(index));
    }

    // Validate price
    if (typeof item.price !== 'number' || item.price <= 0 || !isFinite(item.price)) {
      errors.push(CHECKOUT_ERRORS.INVALID_ITEM_PRICE(index));
    }

    // Validate quantity
    if (typeof item.quantity !== 'number' || item.quantity <= 0 || !Number.isInteger(item.quantity)) {
      errors.push(CHECKOUT_ERRORS.INVALID_ITEM_QUANTITY(index));
    }

    // Validate ID
    if (!item.id || typeof item.id !== 'string' || item.id.trim() === '') {
      errors.push(`Item ${index + 1}: ID is required`);
    }

    // Validate size
    if (item.size && typeof item.size !== 'string') {
      errors.push(`Item ${index + 1}: Size must be a string`);
    }

    // Validate ice level
    if (item.ice && typeof item.ice !== 'string') {
      errors.push(`Item ${index + 1}: Ice level must be a string`);
    }

    // Validate options
    if (item.options && !Array.isArray(item.options)) {
      errors.push(`Item ${index + 1}: Options must be an array`);
    }

    return errors;
  }

  /**
   * Validate if voucher can be applied
   */
  static canApplyVoucher(subtotal: number, voucher: Voucher | null): VoucherValidationResult {
    try {
      if (!voucher) {
        return {
          canApply: false,
          reason: CHECKOUT_ERRORS.VOUCHER_NOT_AVAILABLE
        };
      }

      // Check if voucher is active
      if (!voucher.isActive) {
        return {
          canApply: false,
          reason: CHECKOUT_ERRORS.VOUCHER_INACTIVE
        };
      }

      // Validate subtotal
      if (typeof subtotal !== 'number' || subtotal < 0) {
        return {
          canApply: false,
          reason: 'Invalid transaction amount'
        };
      }

      // Check minimum transaction requirement
      if (voucher.minTransaction && subtotal < voucher.minTransaction) {
        return {
          canApply: false,
          reason: CHECKOUT_ERRORS.MIN_TRANSACTION_NOT_MET(voucher.minTransaction)
        };
      }

      // Additional voucher validations
      const voucherValidation = this.validateVoucherDetails(voucher);
      if (!voucherValidation.isValid) {
        return {
          canApply: false,
          reason: voucherValidation.errors[0] || 'Invalid voucher'
        };
      }

      return { canApply: true };

    } catch (error) {
      console.error('Error validating voucher application:', error);
      return {
        canApply: false,
        reason: 'Voucher validation failed'
      };
    }
  }

  /**
   * Validate voucher details
   */
  static validateVoucherDetails(voucher: Voucher): CheckoutValidationResult {
    const errors: string[] = [];

    try {
      if (!voucher) {
        errors.push('Voucher is required');
        return { isValid: false, errors };
      }

      // Validate ID
      if (!voucher.id || typeof voucher.id !== 'string' || voucher.id.trim() === '') {
        errors.push('Voucher ID is required');
      }

      // Validate code
      if (!voucher.code || typeof voucher.code !== 'string' || voucher.code.trim() === '') {
        errors.push('Voucher code is required');
      }

      // Validate type
      if (!['percentage', 'fixed'].includes(voucher.type)) {
        errors.push('Voucher type must be "percentage" or "fixed"');
      }

      // Validate value
      if (typeof voucher.value !== 'number' || voucher.value <= 0 || !isFinite(voucher.value)) {
        errors.push('Voucher value must be a positive number');
      }

      // Validate percentage constraints
      if (voucher.type === 'percentage' && voucher.value > 100) {
        errors.push('Percentage voucher cannot exceed 100%');
      }

      // Validate minimum transaction
      if (voucher.minTransaction !== undefined) {
        if (typeof voucher.minTransaction !== 'number' || voucher.minTransaction < 0) {
          errors.push('Minimum transaction must be a non-negative number');
        }
      }

      // Validate maximum discount for percentage vouchers
      if (voucher.type === 'percentage' && voucher.maxDiscount !== undefined) {
        if (typeof voucher.maxDiscount !== 'number' || voucher.maxDiscount <= 0) {
          errors.push('Maximum discount must be a positive number');
        }
      }

    } catch (error) {
      console.error('Error validating voucher details:', error);
      errors.push('Voucher validation error occurred');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate item quantity update
   */
  static validateQuantityUpdate(currentQuantity: number, newQuantity: number): CheckoutValidationResult {
    const errors: string[] = [];

    try {
      // Check if new quantity is valid
      if (typeof newQuantity !== 'number' || newQuantity <= 0 || !Number.isInteger(newQuantity)) {
        errors.push('Quantity must be a positive integer');
      }

      // Check reasonable limits (prevent abuse)
      if (newQuantity > 99) {
        errors.push('Quantity cannot exceed 99 items');
      }

      // Check current quantity validity
      if (typeof currentQuantity !== 'number' || currentQuantity < 0) {
        errors.push('Current quantity is invalid');
      }

    } catch (error) {
      console.error('Error validating quantity update:', error);
      errors.push('Quantity validation error');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate checkout totals
   */
  static validateCheckoutTotals(
    subtotal: number,
    tax: number,
    discount: number,
    total: number
  ): CheckoutValidationResult {
    const errors: string[] = [];

    try {
      // Validate all amounts are numbers
      const amounts = { subtotal, tax, discount, total };
      for (const [key, value] of Object.entries(amounts)) {
        if (typeof value !== 'number' || !isFinite(value)) {
          errors.push(`${key} must be a valid number`);
        }
      }

      // Validate non-negative amounts
      if (subtotal < 0) errors.push('Subtotal cannot be negative');
      if (tax < 0) errors.push('Tax cannot be negative');
      if (discount < 0) errors.push('Discount cannot be negative');
      if (total < 0) errors.push('Total cannot be negative');

      // Validate relationships
      const calculatedTotal = subtotal + tax - discount;
      const tolerance = 1; // Allow 1 rupiah tolerance for rounding

      if (Math.abs(total - calculatedTotal) > tolerance) {
        errors.push('Total calculation is incorrect');
      }

      // Validate tax calculation
      const expectedTax = Math.round(subtotal * CHECKOUT_CONFIG.taxRate);
      if (Math.abs(tax - expectedTax) > tolerance) {
        errors.push('Tax calculation is incorrect');
      }

      // Validate discount doesn't exceed subtotal + tax
      if (discount > subtotal + tax) {
        errors.push('Discount cannot exceed subtotal + tax');
      }

    } catch (error) {
      console.error('Error validating checkout totals:', error);
      errors.push('Total validation error occurred');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate item options
   */
  static validateItemOptions(options: string[], availableOptions?: string[]): CheckoutValidationResult {
    const errors: string[] = [];

    try {
      if (!Array.isArray(options)) {
        errors.push('Options must be an array');
        return { isValid: false, errors };
      }

      // Check for duplicate options
      const uniqueOptions = new Set(options);
      if (uniqueOptions.size !== options.length) {
        errors.push('Duplicate options are not allowed');
      }

      // Validate against available options if provided
      if (availableOptions && Array.isArray(availableOptions)) {
        const invalidOptions = options.filter(option => !availableOptions.includes(option));
        if (invalidOptions.length > 0) {
          errors.push(`Invalid options: ${invalidOptions.join(', ')}`);
        }
      }

      // Validate option strings
      options.forEach((option, index) => {
        if (typeof option !== 'string' || option.trim() === '') {
          errors.push(`Option ${index + 1} must be a non-empty string`);
        }
      });

    } catch (error) {
      console.error('Error validating item options:', error);
      errors.push('Options validation error');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate checkout data completeness for payment
   */
  static validateForPayment(items: CheckoutItem[], total: number): CheckoutValidationResult {
    const errors: string[] = [];

    try {
      // Basic checkout validation
      const checkoutValidation = this.validateCheckout(items);
      if (!checkoutValidation.isValid) {
        errors.push(...checkoutValidation.errors);
      }

      // Validate total for payment
      if (typeof total !== 'number' || total <= 0) {
        errors.push('Total amount must be greater than zero for payment');
      }

      // Validate minimum payment amount (e.g., Rp 1,000)
      const minPaymentAmount = 1000;
      if (total < minPaymentAmount) {
        errors.push(`Minimum payment amount is ${CHECKOUT_CONFIG.currency} ${minPaymentAmount.toLocaleString(CHECKOUT_CONFIG.locale)}`);
      }

      // Additional payment-specific validations can be added here

    } catch (error) {
      console.error('Error validating for payment:', error);
      errors.push('Payment validation error');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
