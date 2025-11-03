import { useCartStore } from './cartStore';
import type { CartItem } from '@/types/Cart';

// Cart Service for accessing store outside React components
export class CartService {
  static getCartData() {
    const store = useCartStore.getState();
    return {
      items: store.items,
      totalItems: store.getTotalItems(),
      totalPrice: store.getTotalPrice(),
    };
  }

  static addItemToCart(item: Omit<CartItem, 'id'>) {
    useCartStore.getState().addItem(item);
  }

  static clearCart() {
    useCartStore.getState().clearCart();
  }

  static getItemById(id: string): CartItem | undefined {
    const store = useCartStore.getState();
    return store.items.find(item => item.id === id);
  }

  static hasItem(name: string, size: string, options: string[]): boolean {
    const store = useCartStore.getState();
    return store.items.some(item =>
      item.name === name &&
      item.size === size &&
      JSON.stringify([...item.options].sort()) === JSON.stringify([...options].sort())
    );
  }

  static updateItemQuantity(id: string, quantity: number) {
    useCartStore.getState().updateQuantity(id, quantity);
  }

  static removeItem(id: string) {
    useCartStore.getState().removeItem(id);
  }

  static addMultipleItems(items: Omit<CartItem, 'id'>[]) {
    const store = useCartStore.getState();
    items.forEach(item => store.addItem(item));
  }
}

// Custom hook for advanced cart operations
export function useCartOperations() {
  const store = useCartStore();

  const addMultipleItems = (items: Omit<CartItem, 'id'>[]) => {
    items.forEach(item => store.addItem(item));
  };

  const getItemById = (id: string) => {
    return store.items.find(item => item.id === id);
  };

  const hasItem = (name: string, size: string, options: string[]) => {
    return store.items.some(item =>
      item.name === name &&
      item.size === size &&
      JSON.stringify([...item.options].sort()) === JSON.stringify([...options].sort())
    );
  };

  const getItemsWithSameName = (name: string) => {
    return store.items.filter(item => item.name === name);
  };

  const getCartByCategory = () => {
    return store.items.reduce((acc, item) => {
      const category = item.options.includes('hot') ? 'Hot Drinks' : 'Cold Drinks';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {} as Record<string, CartItem[]>);
  };

  return {
    ...store,
    addMultipleItems,
    getItemById,
    hasItem,
    getItemsWithSameName,
    getCartByCategory,
  };
}

// Utility functions for cart calculations
export const cartCalculations = {
  calculateSubtotal: (items: CartItem[]): number => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  },

  calculateTax: (subtotal: number, taxRate: number = 0.1): number => {
    return subtotal * taxRate;
  },

  calculateTotal: (subtotal: number, tax: number, discount: number = 0): number => {
    return subtotal + tax - discount;
  },

  formatCurrency: (amount: number): string => {
    return `Rp ${amount.toLocaleString('id-ID')}`;
  },

  getUniqueItemCount: (items: CartItem[]): number => {
    return items.length;
  },

  getTotalItemCount: (items: CartItem[]): number => {
    return items.reduce((total, item) => total + item.quantity, 0);
  },
};

// Cart validation utilities
export const cartValidation = {
  isValidCartItem: (item: Partial<CartItem>): boolean => {
    return !!(
      item.name &&
      item.price &&
      item.price > 0 &&
      item.quantity &&
      item.quantity > 0 &&
      item.size &&
      item.ice &&
      item.options &&
      Array.isArray(item.options)
    );
  },

  hasMinimumOrderValue: (items: CartItem[], minimumValue: number): boolean => {
    const total = cartCalculations.calculateSubtotal(items);
    return total >= minimumValue;
  },

  hasMaximumItemLimit: (items: CartItem[], maxItems: number): boolean => {
    const totalItems = cartCalculations.getTotalItemCount(items);
    return totalItems <= maxItems;
  },
};
