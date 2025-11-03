import { useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { CartMigrationService } from '@/services/cart/cartMigrationService';

/**
 * Hook to handle cart migration on app startup
 * Removes legacy cart items that don't have productUuid
 */
export const useCartMigration = () => {
    const { items, clearCart } = useCartStore();

    useEffect(() => {
        if (items.length > 0) {
            const legacyCount = CartMigrationService.getLegacyItemsCount(items);

            if (legacyCount > 0) {
                console.log(`Found ${legacyCount} legacy cart items, clearing cart for compatibility`);
                clearCart();

                // You could show a notification to the user here
                // Example: toast.info(`Cleared ${legacyCount} outdated items from your cart. Please re-add them.`);
            }
        }
    }, [items, clearCart]);
};

export default useCartMigration;