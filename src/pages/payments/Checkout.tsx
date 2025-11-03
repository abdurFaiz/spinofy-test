import HeaderBar from "@/components/HeaderBar";
import { ScreenWrapper } from "@/components/layout/ScreenWrapper";
import { Separator } from "@/components/Separator";
import { SkeletonCheckoutPage } from "@/components/skeletons/SkeletonComponents";
import { useEffect } from "react";
import { OrderDetailsSection } from "./components/ItemCardSection/OrderDetailsSection";
import { SpecialOffersSection } from "./components/SpecialOfferSection/SpecialOffersSection";
import { PaymentMethodSection } from "./components/PaymentMethodSection";
import { CheckoutFooter } from "./components/CheckoutFooter";
import { PaymentDetailSection } from "@/components/PaymentDetailSection";
import { PointsBadge } from "./components/PointsBadge";
import { VoucherSection } from "./components/VoucherSection/VoucherSection";
import { useCart } from "@/hooks/useCart";
import { useCartStore, type CartItem } from "@/store/cartStore";
import { useVoucherCalculation } from "@/hooks/Voucher/useVoucherCalculation";
import type { Voucher } from "@/hooks/Voucher/useVoucherCalculation";
import { useQuery } from '@tanstack/react-query';
import { OutletAPI } from "@/api/outlet.api";
import { useCheckoutPayment } from "@/hooks/Checkout/useCheckoutPayment";
import PaymentAPI from "@/api/payment.api";
import { useOutletNavigation } from "@/hooks/useOutletNavigation";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "@/utils/utils";

const specialOffersData = [
  {
    id: "1",
    name: "Es Kopi Susu Special",
    description:
      "Perpaduan pas antara espresso, susu segar, dan manisnya gula aren pilihan.",
    price: 32000,
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/d6c2cecc56933ec6f1975ddcb946466c021f3e66?width=334",
  },
  // ... other offers
];


export default function Checkout() {
  const { navigateToHome, outletSlug } = useOutletNavigation();
  const navigate = useNavigate();
  const {
    items,
    getTotalPrice,
    updateQuantity,
    isCheckoutProcessing,
    setCheckoutProcessing
  } = useCart();
  const { checkoutPayment, isLoading: isCheckoutPaymentLoading } = useCheckoutPayment();

  // Fetch outlet information
  const { data: outletsResponse, isLoading: outletsLoading } = useQuery({
    queryKey: ['outlets-list'],
    queryFn: () => OutletAPI.getListOutlets(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const outlet = outletsResponse?.data?.outlets?.[0];
  const outletName = outlet?.name || 'Cafe';

  // Get tax percentage from outlet (fee_tax is a percentage number like 10 for 10%)
  // Convert to decimal for calculation (10 -> 0.1)
  const taxRate = outlet?.fee_tax ? outlet.fee_tax / 100 : 0;

  // Fetch current order (cart) from payment API
  const { data: paymentData, isLoading: isLoadingPayment, refetch: refetchPaymentData } = useQuery({
    queryKey: ['payment-cart', outlet?.slug],
    queryFn: async () => {
      if (!outlet?.slug) throw new Error('No outlet available');
      return PaymentAPI.getListPayment(outlet.slug);
    },
    enabled: !!outlet?.slug,
    staleTime: 10 * 1000, // Reduced to 10 seconds for more frequent updates
    refetchOnWindowFocus: true, // Refetch when window regains focus
  });

  const currentOrder = paymentData?.data?.order?.[0];
  const orderCode = currentOrder?.code;

  const subtotal = getTotalPrice();

  // Sample voucher data
  const sampleVoucher: Voucher = {
    id: "newuser50",
    name: "Diskon Pengguna Baru 50% s.d 12rb",
    type: "percentage",
    value: 50,
    maxDiscount: 12000,
    minTransaction: 0,
    isActive: true,
  };

  const { calculation, appliedVoucher, applyVoucher } = useVoucherCalculation(
    subtotal,
    taxRate, // Use dynamic tax rate from outlet
  );

  // Apply sample voucher by default for demo
  useEffect(() => {
    applyVoucher(sampleVoucher);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Force refetch payment data on component mount to get latest backend order
  useEffect(() => {
    if (outlet?.slug) {
      refetchPaymentData();
    }
  }, [outlet?.slug, refetchPaymentData]);

  // Sync frontend cart with backend order data
  useEffect(() => {
    if (currentOrder?.order_products) {

      const backendCartItems: CartItem[] = currentOrder.order_products.map(orderProduct => ({
        id: String(orderProduct.id), // Use backend ID as the unique key
        name: orderProduct.product?.name || 'Unknown Product',
        price: orderProduct.price + (orderProduct.extra_price || 0),
        quantity: orderProduct.quantity,
        image: getImageUrl(orderProduct.product?.image),
        notes: orderProduct.note || '',
        size: '', // Will be derived from variants
        ice: '', // Will be derived from variants
        options: orderProduct.order_product_variant?.map(v =>
          v.product_attribute_value?.name || ''
        ).filter(Boolean) || [],
        productId: orderProduct.product_id,
        productUuid: orderProduct.product?.uuid || '',
        variantIds: orderProduct.order_product_variant?.map(v => v.product_attribute_value_id) || [],
        orderProductId: orderProduct.id, // Important: Link to backend
      }));

      // Use the new syncCart action to replace the entire cart state
      useCartStore.getState().syncCart(backendCartItems);

    } else if (!isLoadingPayment && outlet?.slug) {
      // If there's no backend order but we have stale frontend cart data, clear it
      if (items.length > 0) {
        useCartStore.getState().clearCart();
      }
    }
  }, [currentOrder, isLoadingPayment, outlet?.slug, items.length]); // Include relevant dependencies



  // Cleanup: Reset checkout processing flag when component unmounts
  useEffect(() => {
    return () => {
      setCheckoutProcessing(false);
    };
  }, [setCheckoutProcessing]);

  // Redirect to home if no backend order exists (cart should be empty in this case)
  useEffect(() => {
    if (!currentOrder && !isLoadingPayment && outlet?.slug && items.length === 0 && !isCheckoutProcessing) {
    
      navigateToHome();
    }
  }, [currentOrder, isLoadingPayment, outlet?.slug, items.length, isCheckoutProcessing, navigateToHome]);

  // Show loading state
  if (isCheckoutPaymentLoading || outletsLoading || isLoadingPayment) {
    return <SkeletonCheckoutPage />;
  }

  // Handle checkout submission
  const handleCheckoutSubmit = () => {
    if (isCheckoutPaymentLoading) return;

    if (!orderCode) {
      alert('Order tidak ditemukan. Silakan tambahkan produk ke cart terlebih dahulu.');
      return;
    }

    // Validate that the backend order has products
    if (!currentOrder?.order_products || currentOrder.order_products.length === 0) {
      alert('Tidak ada produk dalam pesanan. Silakan tambahkan produk ke cart terlebih dahulu.');
      return;
    }

    currentOrder.order_products.map(p => ({
      name: p.product?.name,
      quantity: p.quantity,
      price: p.price,
      total: p.total
    }));

    // Update payment method to QRIS (ID: 1)
    // This changes order status from PENDING to WAITING_CONFIRMATION
    checkoutPayment({
      orderCode: String(orderCode), // Ensure it's a string
      paymentMethodId: 1, // QRIS payment method
    });
  };

  // Use calculation results
  const { originalPrice, discount, finalPrice, tax } = calculation;

  // Convert cart items to checkout format - use synced frontend cart data
  const orderItemsData = items.map((item) => ({
    id: item.id,
    name: item.name,
    notes: item.notes || null,
    price: item.price,
    image: getImageUrl(item.image),
    quantity: item.quantity,
    size: item.size || '',
    ice: item.ice || '',
    options: item.options || [],
    orderProductId: item.orderProductId,
    productId: item.productId,
    productUuid: item.productUuid,
    variantIds: item.variantIds,
  }));



  const updateItemQuantity = async (itemId: string, delta: number) => {
    const item = items.find((i) => i.id === itemId);
    if (item?.orderProductId) {
      const newQuantity = Math.max(0, item.quantity + delta);

      try {
        // Update quantity in backend first using the correct quantity-specific endpoint
        if (outlet?.slug) {

          // Use the correct updateQuantityPaymentProduct method for quantity updates
          await PaymentAPI.updateQuantityPaymentProduct(outlet.slug, item.orderProductId, {
            quantity: newQuantity
          });

          // Update frontend cart only after backend success
          updateQuantity(itemId, newQuantity);

          // Refetch payment data to ensure backend sync
          refetchPaymentData();
        }
      } catch (error) {
        console.error('❌ Failed to update quantity:', error);

        // Refetch payment data to ensure we have the latest state
        refetchPaymentData();

      }
    } else {
      // Fallback for items without backend ID (shouldn't happen after sync)
      const newQuantity = Math.max(1, item?.quantity ? item.quantity + delta : 1);
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!outlet?.slug || !orderCode) {
      console.error('❌ Cannot delete item: missing outlet slug or order code');
      return;
    }

    const item = items.find((i) => i.id === itemId);
    if (!item) {
      console.error('❌ Item not found in cart');
      return;
    }

    try {
      // Use the cart store's deleteItem method which handles backend API calls
      await useCartStore.getState().deleteItem(itemId, outlet.slug, orderCode);

  

      // Add small delay to ensure backend has processed the deletion
      await new Promise(resolve => setTimeout(resolve, 300));

      // Refetch payment data to sync with backend
      await refetchPaymentData();

    

      // If cart becomes empty after deletion, redirect to home
      const updatedItems = useCartStore.getState().items;
      if (updatedItems.length === 0) {
       
        setTimeout(() => {
          navigateToHome();
        }, 500);
      }
    } catch (error) {
      console.error('❌ Failed to delete item:', error);

      // Refetch payment data to ensure we have the latest state
      await refetchPaymentData();
    }
  };

  const handleAddMoreItems = () => {
    navigateToHome();
  };

  const handleEditItem = (
    cartItemId: number,
    productUuid: string,
    variantIds: number[],
    quantity: number,
    note: string
  ) => {
  
    if (outletSlug) {
      navigate(`/${outletSlug}/DetailItem?uuid=${productUuid}&mode=cart-edit&cartItemId=${cartItemId}`, {
        state: {
          cartEditMode: true,
          cartItemId,
          productUuid,
          variantIds,
          quantity,
          note,
        }
      });
    } else {
      navigate('/onboard');
    }
  };

  // Payment details for display
  const paymentDetailsData = [
    {
      id: "1",
      label: "Harga",
      value: `Rp ${subtotal.toLocaleString("id-ID")}`,
    },
    { id: "2", label: "Pajak", value: `Rp ${tax.toLocaleString("id-ID")}` },
    ...(appliedVoucher && discount > 0
      ? [
        {
          id: "3",
          label: "Voucher Diskon",
          value: `- Rp ${discount.toLocaleString("id-ID")}`,
          isDiscount: true,
          dashed: true,
        },
      ]
      : []),
    {
      id: "4",
      label: "Total Pembayaran",
      value: `Rp ${finalPrice.toLocaleString("id-ID")}`,
      highlight: true,
    },
  ];

  const voucherData = appliedVoucher
    ? {
      name: appliedVoucher.name,
      savings: discount,
    }
    : null;

  const footerData = {
    total: finalPrice,
    originalTotal: originalPrice,
    savings: discount,
  };

  return (
    <ScreenWrapper>
      <HeaderBar
        title={`Checkout • ${outletName}`}
        showBack={true}
        onBack={navigateToHome}
      />

      <div className="flex flex-col gap-6 pt-6">
        <OrderDetailsSection
          items={orderItemsData}
          quantities={Object.fromEntries(
            items.map((item) => [item.id, item.quantity]),
          )}
          onUpdateQuantity={updateItemQuantity}
          onAddItem={handleAddMoreItems}
          onEditItem={handleEditItem}
          onDeleteItem={handleDeleteItem}
        />

        <Separator />

        <SpecialOffersSection
          offers={specialOffersData}
          onAddOffer={() => {
            /* Handle add offer */
          }}
        />

        <Separator />

        <PaymentDetailSection
          title="Detail Pembayaran"
          items={paymentDetailsData}
        />
        <PointsBadge points={100} />

        <Separator />

        {voucherData && (
          <VoucherSection
            voucher={voucherData}
            originalPrice={originalPrice}
            finalPrice={finalPrice}
            onCheckVouchers={() => {
              if (outletSlug) {
                navigate(`/${outletSlug}/vouchercheckout`);
              } else {
                navigate('/onboard');
              }
            }}
          />
        )}

        <Separator />

        <PaymentMethodSection
          selectedMethod="qris"
          onSelectMethod={() => () => { }}
        />

        {/* Bottom Spacing for Fixed Footer */}
        <div className="h-[199px]"></div>
      </div>

      <CheckoutFooter
        summary={footerData}
        onSubmit={handleCheckoutSubmit}
      />
    </ScreenWrapper>
  );
}
