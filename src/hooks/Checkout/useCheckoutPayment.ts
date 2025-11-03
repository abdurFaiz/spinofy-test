import { useMutation } from '@tanstack/react-query';
import { PaymentAPI } from '@/api/payment.api';
import { useNavigate } from 'react-router-dom';
import { OrderAPI } from '@/api/order.api';
import { useCart } from '@/hooks/useCart';
import { useCartStore } from '@/store/cartStore';
import { useOutletSlug } from '@/hooks/useOutletSlug';

interface CheckoutPaymentParams {
    orderCode: string;
    paymentMethodId: number;
}

export const useCheckoutPayment = () => {
    const navigate = useNavigate();
    const { clearCart } = useCart();
    const { setCheckoutProcessing } = useCartStore();
    const outletSlug = useOutletSlug();

    const checkoutMutation = useMutation({
        mutationFn: async ({ orderCode }: CheckoutPaymentParams) => {
            if (!outletSlug) {
                throw new Error('No outlet available');
            }

            // Update payment status with payment method
            // const updateResponse = await PaymentAPI.updateStatusPayment(outletSlug, orderCode, {
            //     method_id: paymentMethodId,
            // });


            let order = null;

            try {
                // Try to get order details via getOrderDetails endpoint
                const orderDetailsResponse = await OrderAPI.getOrderDetails(outletSlug, Number(orderCode));


                // Handle both array and object response formats
                const orderData_ = orderDetailsResponse?.data?.order;
                order = (Array.isArray(orderData_) ? orderData_[0] : orderData_) || null;


            } catch (getDetailsError) {
                console.error('❌ Failed to get order details:', getDetailsError);

                // Fallback: Try to get order from payment list
                try {
                    const paymentListResponse = await PaymentAPI.getListPayment(outletSlug);


                    // Find the order with matching code
                    const orders = (paymentListResponse?.data as any)?.orders || paymentListResponse?.data?.order || [];
                    order = orders.find((o: any) => o.code === Number(orderCode) || o.code === orderCode);


                } catch (fallbackError) {
                    console.error('❌ Fallback also failed:', fallbackError);
                }
            }

            if (!order) {
                console.warn('⚠️ Could not fetch order details, but proceeding with orderCode:', orderCode);
                // Still return orderCode so redirect can happen, Payment page will fetch data
            }

            return { order, orderCode };
        },
        onSuccess: (data: any) => {


            const { order, orderCode } = data;



            if (orderCode) {

                setCheckoutProcessing(true);


                // Navigate to payment page with order code
                // If order data is available, pass it; otherwise Payment page will fetch it via usePaymentStatus
                navigate(`/${outletSlug}/payment`, {
                    state: {
                        orderCode,
                        orderData: order || undefined,
                    }
                });

                // Longer delay to ensure Checkout page has unmounted before clearing
                setTimeout(() => {

                    clearCart();
                    // Don't reset isCheckoutProcessing yet - keep it true until we're sure
                }, 500);

                // Reset checkout processing flag after a longer delay
                setTimeout(() => {

                    setCheckoutProcessing(false);
                }, 1000);
            } else {

                setCheckoutProcessing(false);
                alert('Gagal memproses pembayaran. Silakan coba lagi.');
            }
        },
        onError: (error: any) => {
            console.error('❌ Checkout payment error:', error);
            setCheckoutProcessing(false);

            // Extract error message
            const errorMessage = error?.message || 'Unknown error occurred';

            // Show user-friendly error
            alert(`Gagal memproses pembayaran.\n\n${errorMessage}\n\nSilakan coba lagi atau hubungi staff.`);
        },
    });

    return {
        checkoutPayment: checkoutMutation.mutate,
        isLoading: checkoutMutation.isPending,
        isSuccess: checkoutMutation.isSuccess,
        error: checkoutMutation.error,
    };
};
