import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem } from "@/types/Cart";

// Re-export for convenience
export type { CartItem } from "@/types/Cart";

interface CartStore {
  items: CartItem[];
  isCheckoutProcessing: boolean;
  syncCart: (items: CartItem[]) => void;
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  deleteItem: (id: string, outletSlug: string, orderCode: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => void;
  updateItem: (id: string, updates: Partial<Omit<CartItem, "id">>) => void;
  clearCart: () => void;
  setCheckoutProcessing: (processing: boolean) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isCheckoutProcessing: false,

      syncCart: (items) => set({ items }),

      addItem: (newItem) => {
        const id = `${Date.now()}-${Math.random()}`; // More unique ID
        const itemWithId = { ...newItem, id };

        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) =>
              item.productUuid === newItem.productUuid &&
              item.name === newItem.name &&
              JSON.stringify([...(item.options || [])].sort((a, b) => a.localeCompare(b))) ===
              JSON.stringify([...(newItem.options || [])].sort((a, b) => a.localeCompare(b))) &&
              item.size === newItem.size &&
              item.ice === newItem.ice &&
              item.notes === newItem.notes,
          );

          if (existingItemIndex > -1) {
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += newItem.quantity;
            return { items: updatedItems };
          } else {
            return { items: [...state.items, itemWithId] };
          }
        });
      },

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      deleteItem: async (id, outletSlug, orderCode) => {
        const { items } = get();
        const item = items.find((item) => item.id === id);

        if (!item) {
          throw new Error('Item not found in cart');
        }



        try {
          // Import PaymentAPI dynamically to avoid circular dependency
          const { default: PaymentAPI } = await import('@/api/payment.api');

          // Check if there's only one item left in the cart
          if (items.length === 1) {

            // If this is the last item, delete the entire order
            await PaymentAPI.deleteOrder(outletSlug, orderCode);
            // Clear the entire cart
            set({ items: [] });

          } else {

            // If there are multiple items, delete this specific item by setting quantity to 0
            if (item.orderProductId) {

              // Use the quantity update endpoint to set quantity to 0 (effectively deletes the item)
              await PaymentAPI.updateQuantityPaymentProduct(outletSlug, item.orderProductId, {
                quantity: 0
              });

            } else {
              console.warn('⚠️ CartStore: Item has no orderProductId, cannot delete from backend');
            }

            // Remove item from frontend cart
            set((state) => ({
              items: state.items.filter((cartItem) => cartItem.id !== id),
            }));
          }
        } catch (error) {
          throw error;
        }
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item,
          ),
        }));
      },

      updateItem: (id, updates) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...updates } : item,
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      setCheckoutProcessing: (processing: boolean) =>
        set({ isCheckoutProcessing: processing }),

      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        const { items } = get();
        return items.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        );
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
