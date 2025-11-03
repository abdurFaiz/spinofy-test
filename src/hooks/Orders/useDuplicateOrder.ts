import { useMutation, useQueryClient } from '@tanstack/react-query';
import { OrderAPI } from '@/api/order.api';
import { OutletAPI } from '@/api/outlet.api';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';

interface DuplicateOrderParams {
    orderCode: string;
}

export const useDuplicateOrder = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { clearCart, addItem } = useCart();

    const duplicateOrderMutation = useMutation({
        mutationFn: async ({ orderCode }: DuplicateOrderParams) => {
           

            // Get outlet slug
            const outletsResponse = await OutletAPI.getListOutlets();
            const outletSlug = outletsResponse?.data?.outlets?.[0]?.slug;

            if (!outletSlug) {
                throw new Error('No outlet available');
            }

            // Call duplicate order API
            const response = await OrderAPI.storeDuplicateOrder(outletSlug, {
                code: orderCode
            });

           

            return { response, outletSlug };
        },
        onSuccess: async ({ response }) => {
           

            // Extract the new order from response
            const newOrder = response?.data?.order;
            const orderData = Array.isArray(newOrder) ? newOrder[0] : newOrder;

            if (orderData) {
               

                // APPROACH BARU: Sync backend order ke frontend cart
                // Sehingga user bisa edit quantity seperti checkout normal

                // Clear frontend cart terlebih dahulu
                clearCart();
              

                if (orderData.order_products && orderData.order_products.length > 0) {
                   

                    // Use for...of loop instead of forEach
                    for (const [index, orderProduct] of orderData.order_products.entries()) {
                     

                        const cartItem = {
                            name: (orderProduct as any).product?.name || 'Product',
                            price: Number((orderProduct as any).price) || 0,
                            quantity: Number((orderProduct as any).quantity) || 1,
                            image: (orderProduct as any).product?.image || '',
                            notes: (orderProduct as any).note || `reorder-${index}`, // Make notes unique
                            size: (orderProduct as any).product_variant?.name || '',
                            ice: '',
                            options: [],
                            orderProductId: (orderProduct as any).id,
                            productId: (orderProduct as any).product?.id,
                            productUuid: (orderProduct as any).product?.uuid || '',
                            variantIds: (orderProduct as any).product_variant?.id ? [(orderProduct as any).product_variant.id] : [],
                        };

                        

                        try {
                            addItem(cartItem);
                          
                        } catch (error) {
                            console.error('❌ Error adding item to cart:', error);
                        }
                    }

                    

                    // Add a small delay to ensure cart is updated before navigation
                    await new Promise(resolve => setTimeout(resolve, 100));

                    

                } else {
                    console.warn('⚠️ Duplicate order has no products:', orderData);
                }

                // Invalidate payment queries untuk refresh data dari backend
                await queryClient.invalidateQueries({ queryKey: ['payment-cart'] });
                await queryClient.invalidateQueries({ queryKey: ['payment-list'] });

                

                // Navigate ke Checkout page untuk review order
                // Sekarang checkout akan menggunakan frontend cart (normal mode)
                // User bisa edit quantity, add items, etc seperti checkout biasa
                navigate('/checkout');
            } else {
                throw new Error('Failed to get duplicated order data');
            }
        },
        onError: (error: any) => {
            console.error('❌ Duplicate order error:', error);

            const errorMessage = error?.message || 'Failed to duplicate order';
            alert(`Gagal menduplikasi pesanan.\n\n${errorMessage}\n\nSilakan coba lagi.`);
        },
    });

    return {
        duplicateOrder: duplicateOrderMutation.mutate,
        isDuplicating: duplicateOrderMutation.isPending,
        isSuccess: duplicateOrderMutation.isSuccess,
        error: duplicateOrderMutation.error,
    };
};

export default useDuplicateOrder;
