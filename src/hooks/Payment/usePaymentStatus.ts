import { useMutation, useQuery } from '@tanstack/react-query';
import { CheckoutAPI } from '@/api/checkout.api';
import { OrderAPI } from '@/api/order.api';
import { OutletAPI } from '@/api/outlet.api';
// import { WebhookAPI } from '@/api/webhook.api';

import { useNavigate } from 'react-router-dom';
import { useOutletSlug } from '@/hooks/useOutletSlug';
import { useCart } from '@/hooks/useCart';

export const usePaymentStatus = (orderCode: string | undefined) => {
    const navigate = useNavigate();
    const outletSlug = useOutletSlug();
    const { clearCart } = useCart();

    // Fetch checkout data (includes barcode and order details)
    const { data: checkoutData, isLoading: isLoadingCheckout } = useQuery({
        queryKey: ['checkout', orderCode],
        queryFn: async () => {
            if (!orderCode) throw new Error('Order code is required');

            const outletsResponse = await OutletAPI.getListOutlets();
            const outletSlug = outletsResponse?.data?.outlets?.[0]?.slug;

            if (!outletSlug) {
                throw new Error('No outlet available');
            }

            return await CheckoutAPI.getDataCheckoutOrders(outletSlug, Number(orderCode));
        },
        enabled: !!orderCode,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        refetchInterval: false, // Don't auto-refetch
        refetchOnWindowFocus: false, // Don't refetch on window focus
        refetchOnMount: false, // Don't refetch on mount if cached
    });

    // Check payment status mutation
    const checkStatusMutation = useMutation({
        mutationFn: async () => {
            if (!orderCode) throw new Error('Order code is required');

            

            // Step 1: Call webhook to trigger payment status check
            try {
                // const webhookResponse = await WebhookAPI.sendWebhookNotification({ code: orderCode });
           
            } catch (webhookError) {
                console.warn('⚠️ Webhook call failed (non-blocking):', webhookError);
                // Continue anyway - webhook might be optional
            }

            // Step 2: Fetch updated order details
          
            const outletsResponse = await OutletAPI.getListOutlets();
            const outletSlug = outletsResponse?.data?.outlets?.[0]?.slug;

            if (!outletSlug) {
                throw new Error('No outlet available');
            }

            // Get order details to check if payment is completed
            const orderDetails = await OrderAPI.getOrderDetails(outletSlug, Number(orderCode));
           
            return orderDetails;
        },
        onSuccess: (data) => {
            // Handle both array and object response formats
            const orderData = data?.data?.order;
            const order = (Array.isArray(orderData) ? orderData[0] : orderData) || null;

            if (order) {
              

                // Status codes: 1=pending, 2=waiting_confirmation, 3=success/completed
                // Payment is considered completed when status >= 3
                const isCompleted = order.status >= 3;

                if (isCompleted) {
                    

                    // Clear the cart when payment is completed
                    clearCart();

                    // Payment completed, redirect to payment success page
                    if (outletSlug) {
                        navigate(`/${outletSlug}/payment-success`, {
                            state: {
                                orderCode: order.code,
                                status: order.status_label || 'dalam-proses',
                                points: order.customer_point,
                            },
                            replace: true,
                        });
                    } else {
                        // Fallback to transactions if no outlet slug
                        navigate('/transactions', {
                            state: {
                                orderCompleted: true,
                                orderCode: order.code,
                                points: order.customer_point,
                            }
                        });
                    }
                } else {
                   
                    alert(`Pembayaran masih dalam proses (Status: ${order.status_label || 'Menunggu'}). Silakan coba lagi dalam beberapa saat.`);
                }
            } else {
              
                alert('Data pesanan tidak ditemukan. Silakan coba lagi.');
            }
        },
        onError: (error) => {
            console.error('❌ Check status error:', error);
            alert('Gagal mengecek status pembayaran. Silakan coba lagi.');
        },
    });

    return {
        checkoutData: checkoutData,
        isLoadingCheckout,
        checkPaymentStatus: checkStatusMutation.mutate,
        isCheckingStatus: checkStatusMutation.isPending,
    };
};
