// Main store exports
export { useCartStore } from './cartStore';
export type { CartItem } from './cartStore';

// Utility exports
export { CartService, useCartOperations, cartCalculations, cartValidation } from './cartUtils';

// Hook exports (for backwards compatibility)
export { useCart } from '@/hooks/useCart';
