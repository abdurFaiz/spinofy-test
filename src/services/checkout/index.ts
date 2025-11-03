// Main Checkout Service (Facade/Orchestrator)
export { CheckoutService as default } from './checkoutService';
export { CheckoutService } from './checkoutService';

// Individual Services
export { CheckoutCalculationService } from './checkoutCalculationSservice';
export { CheckoutDataService } from './checkoutDataSservice';
export { CheckoutValidationService } from './checkoutValidationService';
export { CheckoutNavigationService } from './checkoutNavigationService';

// Re-export types for convenience
export type {
  CheckoutItem,
  CheckoutData,
  CheckoutSummary,
  PaymentDetail,
  SpecialOffer,
  Voucher,
  CheckoutValidationResult,
  VoucherValidationResult,
  CheckoutConfig,
  CheckoutCalculationResult,
  CheckoutItemUpdate,
  NavigationAction,
  ApiResponse
} from '@/types/Checkout';

// Re-export constants
export {
  CHECKOUT_CONFIG,
  NAVIGATION_ROUTES,
  CHECKOUT_ERRORS,
  PAYMENT_DETAIL_IDS,
  PAYMENT_DETAIL_LABELS,
  DEFAULT_ITEM_CONFIG,
  API_CONFIG
} from '@/constants/checkout';