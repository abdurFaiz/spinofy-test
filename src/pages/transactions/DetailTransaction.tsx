import { useState, useEffect } from "react";
import { ScreenWrapper } from "@/components/layout/ScreenWrapper";
import TransactionProgressIndicator from "./Components/TransactionProgressIndicator";
import { TransactionHeader } from "./Components/TransactionHeader";
import { Separator } from "@/components/Separator";
import { OrderSection } from "./Components/OrderSection";
import { ServiceFeeSection, type ServiceFeeItemProps } from "./Components/ServiceFeeSection";
import { PaymentDetailSection, type PaymentDetailItem } from "@/components/PaymentDetailSection";
import { PointsRewardSection } from "./Components/PointsReward";
import { BottomActionSection } from "./Components/ContainerButton";
import HeaderBar from "@/components/HeaderBar";
import CountdownTimer from "@/components/CountdownTimer";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useTransactionDetail } from "@/hooks/Transactions/useTransactionDetail";
import { useDuplicateOrder } from "@/hooks/Orders/useDuplicateOrder";
import type { Transaction as TransactionType, TransactionStatus } from "@/types/Transaction";
import { SkeletonDetailTransactionPage } from "@/components/skeletons/SkeletonComponents";
import { useOutletNavigation } from "@/hooks/useOutletNavigation";
import { toast } from "sonner";

interface TransactionData {
  id: number;
  status: TransactionStatus;
  title: string;
  date: string;
  transactionInfo: string;
  orderItems: Array<{
    id: string;
    name: string;
    quantity: number;
    price: string;
  }>;
  serviceFees: ServiceFeeItemProps[];
  paymentDetails: Array<{
    id: string;
    label: string;
    value: string;
    isDiscount?: boolean;
    dashed?: boolean;
    highlight?: boolean;
  }>;
  points?: number;
  actions: Array<{ label: string; variant: "outline" | "primary"; size: "xl" }>;
  paymentTimer?: number; // minutes for countdown
}

export default function DetailTransaction() {
  const { navigateToHome, outletSlug } = useOutletNavigation();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const transactionCode = searchParams.get("code") || "1";

  // Fetch real transaction data
  const { transaction, isLoading, error } = useTransactionDetail(transactionCode);
  const { duplicateOrder, isDuplicating } = useDuplicateOrder();

  // Also fetch raw order data to get detailed information
  const [rawOrderData, setRawOrderData] = useState<any>(null);

  // Get data passed from PaymentSuccess page
  const showPointsToast = location.state?.showPointsToast;

  useEffect(() => {
    const fetchRawOrderData = async () => {
      try {
        if (!transactionCode) return;

        // Import OrderAPI dynamically to avoid circular dependency
        const { OrderAPI } = await import('@/api/order.api');
        const { OutletAPI } = await import('@/api/outlet.api');

        // Get outlet slug
        const outletsResponse = await OutletAPI.getListOutlets();
        const outletSlug = outletsResponse?.data?.outlets?.[0]?.slug;

        if (!outletSlug) return;

        // Fetch raw order details
        const orderResponse = await OrderAPI.getOrderDetails(outletSlug, Number.parseInt(transactionCode, 10));


        // Extract order from response
        let order = null;
        const orderData = orderResponse.data?.order;

        if (Array.isArray(orderData) && orderData.length > 0) {
          order = orderData[0];
        } else if (orderData && typeof orderData === 'object' && !Array.isArray(orderData)) {
          order = orderData;
        } else if (orderResponse.data?.data && (orderResponse.data.data as any).code) {
          // Handle nested data.data structure from storeProduct response
          order = orderResponse.data.data;
        } else if (orderResponse.data && (orderResponse.data as any).code) {
          order = orderResponse.data;
        }

        if (order) {
          setRawOrderData(order);
        }
      } catch (error) {
        console.error('Error fetching raw order data:', error);
      }
    };

    fetchRawOrderData();
  }, [transactionCode]);

  // Transform real transaction data to component format
  const getTransactionDataFromApi = (trans: TransactionType | null, rawOrder: any = null): TransactionData | null => {
    if (!trans) return null;

    // Parse items from raw order data (more detailed) or fallback to transaction data
    const orderItems = [];

    // Use raw order data if available (has more detail)
    const orderToProcess = rawOrder || trans;

    // Check if we have order_products data in the raw order or transaction
    if (orderToProcess && (orderToProcess as any).order_products && Array.isArray((orderToProcess as any).order_products)) {


      for (const [index, orderProduct] of (orderToProcess as any).order_products.entries()) {
        // Build item name with product name + variants
        let itemName = orderProduct.product?.name || 'Product';
        const variants: string[] = [];

        // Add variants from order_product_variant with context
        if (orderProduct.order_product_variant && Array.isArray(orderProduct.order_product_variant)) {
          for (const variant of orderProduct.order_product_variant) {
            if (variant.product_attribute_value?.name) {
              // Get attribute context (like "Ice", "Sugar", etc.)
              const attributeName = variant.product_attribute_value?.product_attribute?.name || '';
              const valueName = variant.product_attribute_value.name;

              // Create contextual name (e.g., "Extra Ice", "Less Sugar")
              let contextualName = valueName;
              if (attributeName && !valueName.toLowerCase().includes(attributeName.toLowerCase())) {
                contextualName = `${valueName} ${attributeName}`;
              }

              variants.push(contextualName);
            }
          }
        }

        // Append variants to item name
        if (variants.length > 0) {
          itemName += ` (${variants.join(', ')})`;
        }

        // Calculate individual item price (base price + variant prices)
        const basePrice = Number(orderProduct.price) || 0;
        const variantPrice = Number(orderProduct.extra_price) || 0;
        const individualPrice = basePrice + variantPrice;

        // Build detailed breakdown for dropdown
        const itemDetails = [];

        // Base product price
        itemDetails.push({
          label: orderProduct.product?.name || 'Product',
          price: basePrice,
        });

        // Add variant details with context
        if (orderProduct.order_product_variant && Array.isArray(orderProduct.order_product_variant)) {
          for (const variant of orderProduct.order_product_variant) {
            if (variant.product_attribute_value?.name) {
              const variantPrice = Number(variant.price) || 0;

              // Get attribute context for detailed breakdown
              const attributeName = variant.product_attribute_value?.product_attribute?.name || '';
              const valueName = variant.product_attribute_value.name;

              // Create contextual name for breakdown
              let contextualName = valueName;
              if (attributeName && !valueName.toLowerCase().includes(attributeName.toLowerCase())) {
                contextualName = `${valueName} ${attributeName}`;
              }

              itemDetails.push({
                label: contextualName,
                price: variantPrice,
              });
            }
          }
        }

        orderItems.push({
          id: `${index + 1}`,
          name: itemName,
          quantity: Number(orderProduct.quantity) || 1,
          price: `Rp ${individualPrice.toLocaleString('id-ID')}`,
          details: itemDetails, // Add detailed breakdown
          basePrice: basePrice,
          totalPrice: individualPrice * Number(orderProduct.quantity),
        });


      }
    } else {
      // Fallback: Parse from string format if API structure not available

      const items = trans.items.split(', ');
      for (const [index, item] of items.entries()) {
        const itemRegex = /(\d+)x\s+(.+)/;
        const match = itemRegex.exec(item);
        if (match) {
          orderItems.push({
            id: `${index + 1}`,
            name: match[2],
            quantity: Number.parseInt(match[1], 10),
            price: trans.totalPrice, // We don't have individual prices, use total
          });
        } else {
          orderItems.push({
            id: `${index + 1}`,
            name: item,
            quantity: 1,
            price: trans.totalPrice,
          });
        }
      }
    }

    // Generate service fees and payment details from raw order data or transaction
    let serviceFees: ServiceFeeItemProps[] = [];
    let paymentDetails: PaymentDetailItem[] = [];
    const paymentSource = rawOrder || trans;

    if (paymentSource && typeof (paymentSource as any).sub_total === 'number') {
      // Use actual API response data
      const subtotal = Number((paymentSource as any).sub_total) || 0;
      const tax = Number((paymentSource as any).tax) || 0;
      const feeService = Number((paymentSource as any).fee_service) || 0;
      const deliveryFee = Number((paymentSource as any).delivery_fee) || 0;
      const packagingFee = Number((paymentSource as any).packaging_fee) || 0;
      const platformFee = Number((paymentSource as any).platform_fee) || 0;
      const discount = Number((paymentSource as any).discount) || 0;
      const pointsUsed = Number((paymentSource as any).points_used) || 0;
      const pointsValue = Number((paymentSource as any).points_value) || 0;
      const voucherDiscount = Number((paymentSource as any).voucher_discount) || 0;
      const total = Number((paymentSource as any).total) || 0;



      // Build service fees section
      let serviceFeeId = 1;
      if (feeService > 0 || deliveryFee > 0 || packagingFee > 0 || platformFee > 0) {
        // Create service fee items with detailed breakdown
        const serviceDetails = [];

        if (feeService > 0) {
          serviceDetails.push({ label: "Biaya Layanan", price: feeService });
        }
        if (deliveryFee > 0) {
          serviceDetails.push({ label: "Biaya Pengiriman", price: deliveryFee });
        }
        if (packagingFee > 0) {
          serviceDetails.push({ label: "Biaya Kemasan", price: packagingFee });
        }
        if (platformFee > 0) {
          serviceDetails.push({ label: "Biaya Platform", price: platformFee });
        }

        const totalServiceFees = feeService + deliveryFee + packagingFee + platformFee;

        serviceFees.push({
          id: `${serviceFeeId}`,
          name: "Biaya Layanan",
          price: `Rp ${totalServiceFees.toLocaleString('id-ID')}`,
          details: serviceDetails
        });
      }

      // Base price (excluding service fees from payment details since they're now separate)
      paymentDetails = [
        { id: "1", label: "Harga", value: `Rp ${subtotal.toLocaleString('id-ID')}`, dashed: true },
      ];

      // Additional costs section (excluding service fees which are now separate)
      let additionalCostId = 2;

      // Tax
      if (tax > 0) {
        paymentDetails.push({
          id: `${additionalCostId}`,
          label: "Pajak",
          value: `Rp ${tax.toLocaleString('id-ID')}`,
          dashed: true
        });
        additionalCostId++;
      }

      // Discounts section
      if (discount > 0) {
        paymentDetails.push({
          id: `${additionalCostId}`,
          label: "Diskon",
          value: `Rp ${discount.toLocaleString('id-ID')}`,
          isDiscount: true,
          dashed: true
        });
        additionalCostId++;
      }

      // Voucher discount
      if (voucherDiscount > 0) {
        paymentDetails.push({
          id: `${additionalCostId}`,
          label: "Diskon Voucher",
          value: `Rp ${voucherDiscount.toLocaleString('id-ID')}`,
          isDiscount: true,
          dashed: true
        });
        additionalCostId++;
      }

      // Points used
      if (pointsUsed > 0) {
        paymentDetails.push({
          id: `${additionalCostId}`,
          label: `Poin Digunakan (${pointsUsed} poin)`,
          value: `Rp ${pointsValue.toLocaleString('id-ID')}`,
          isDiscount: true,
          dashed: true
        });
        additionalCostId++;
      }

      // Total payment (highlighted)
      paymentDetails.push({
        id: `${additionalCostId}`,
        label: "Total Pembayaran",
        value: `Rp ${total.toLocaleString('id-ID')}`,
        highlight: true
      });
    } else {
      // Fallback: Calculate from string total
      const total = Number.parseInt(trans.totalPrice.replaceAll(/[^\d]/g, ''), 10);
      const tax = Math.round(total * 0.1);
      const subtotal = total - tax;

      // No service fees data available in fallback
      serviceFees = [];

      paymentDetails = [
        { id: "1", label: "Harga", value: `Rp ${subtotal.toLocaleString('id-ID')}` },
        { id: "2", label: "Pajak", value: `Rp ${tax.toLocaleString('id-ID')}` },
        {
          id: "3",
          label: "Total Pembayaran",
          value: trans.totalPrice,
          highlight: true,
        },
      ];
    }

    // Determine title and actions based on status
    let title = "Pesanan Berhasil";
    let actions: TransactionData['actions'] = [];
    let paymentTimer: number | undefined;
    let points: number | undefined;

    switch (trans.status) {
      case "pending":
        title = "Menunggu Pembayaran";
        actions = [
          { label: "Batalkan Pesanan", variant: "primary", size: "xl" },
          { label: "Bayar Sekarang", variant: "primary", size: "xl" },
        ];
        break;

      case "menunggu-konfirmasi":
        title = "Menunggu Konfirmasi";
        actions = [
          { label: "Batalkan Pesanan", variant: "primary", size: "xl" },
          { label: "Bayar Sekarang", variant: "primary", size: "xl" },
        ];
        break;

      case "dalam-proses":
        title = "Pesanan Sedang Disiapkan";
        actions = [
          { label: "Struk Digital", variant: "outline", size: "xl" },
          { label: "Pesan Lagi", variant: "primary", size: "xl" },
        ];
        // Get real customer_point from raw order data (API response)
        // customer_point is an object with structure: {id, point, type, info, user_id, ...}
        if (rawOrder?.customer_point?.point) {
          points = Number(rawOrder.customer_point.point);

        } else if (trans.pointsMessage) {
          // Fallback: Extract points from pointsMessage if available
          const pointRegex = /(\d+)\s+poin/;
          const pointMatch = pointRegex.exec(trans.pointsMessage);
          if (pointMatch) {
            points = Number.parseInt(pointMatch[1], 10);

          }
        } else {
          console.warn('⚠️ No points available for dalam-proses status');
        }
        break;

      case "selesai":
        title = "Pesanan Selesai";
        actions = [
          { label: "Struk Digital", variant: "outline", size: "xl" },
          { label: "Pesan Lagi", variant: "primary", size: "xl" },
        ];
        // Get real customer_point from raw order data (API response)
        // customer_point is an object with structure: {id, point, type, info, user_id, ...}
        if (rawOrder?.customer_point?.point) {
          points = Number(rawOrder.customer_point.point);

        } else if (trans.pointsMessage) {
          // Fallback: Extract points from pointsMessage if available
          const pointRegex = /(\d+)\s+poin/;
          const pointMatch = pointRegex.exec(trans.pointsMessage);
          if (pointMatch) {
            points = Number.parseInt(pointMatch[1], 10);

          }
        } else {
          console.warn('⚠️ No points available for selesai status');
        }
        break;

      case "dibatalkan":
        title = "Pesanan Dibatalkan";
        actions = [
          { label: "Struk Digital", variant: "outline", size: "xl" },
          { label: "Pesan Lagi", variant: "primary", size: "xl" },
        ];
        break;

      case "ditolak":
        title = "Pesanan Ditolak";
        actions = [
          { label: "Struk Digital", variant: "outline", size: "xl" },
          { label: "Pesan Lagi", variant: "primary", size: "xl" },
        ];
        break;
    }



    return {
      id: trans.id,
      status: trans.status,
      title,
      date: trans.date,
      transactionInfo: `${trans.cafeName} • ${trans.date}`,
      orderItems,
      serviceFees,
      paymentDetails,
      points,
      actions,
      paymentTimer,
    };
  };

  const [transactionData, setTransactionData] = useState<TransactionData | null>(null);

  useEffect(() => {
    if (transaction) {
      const data = getTransactionDataFromApi(transaction, rawOrderData);
      setTransactionData(data);
    }
  }, [transaction, rawOrderData]);

  // Show points toast notification when coming from PaymentSuccess
  useEffect(() => {

    if (showPointsToast && rawOrderData) {
      // Get customer_point from raw order data (real-time API data)
      // customer_point is an object with structure: {id, point, type, info, user_id, ...}
      const customerPointObj = rawOrderData?.customer_point;
      const pointValue = customerPointObj?.point;



      if (pointValue && pointValue > 0) {

        // Show success toast with points earned
        toast.success('Selamat! 🎉', {
          description: `Kamu mendapatkan ${pointValue} poin dari pesanan ini!`,
          duration: 5000,
          position: 'top-center',
        });
      } else {
        console.warn('⚠️ No customer point to show, value:', pointValue);
      }

      // Clear the state to prevent showing toast again on refresh
      navigate(location.pathname + location.search, {
        replace: true,
        state: { ...location.state, showPointsToast: false }
      });
    }
  }, [showPointsToast, rawOrderData, navigate, location.pathname, location.search, location.state]);

  const handlePaymentTimeout = () => {
    // Handle when payment time runs out
    setTransactionData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        title: "Waktu Pembayaran Habis",
        actions: [{ label: "Buat Pesanan Baru", variant: "primary", size: "xl" }],
      };
    });
  };

  const handleActionClick = (actionLabel: string) => {
    switch (actionLabel) {
      case "Bayar Sekarang":
        // Navigate to payment page with order data
        navigate(`/${outletSlug}/payment`, {
          state: {
            orderCode: transactionCode,
            orderData: rawOrderData, // Pass the raw order data for payment
          }
        });
        break;
      case "Pesan Lagi":
        if (isDuplicating) return;


        duplicateOrder({ orderCode: transactionCode });
        break;
      case "Struk Digital":
        // Handle digital receipt

        break;
      case "Batalkan Pesanan":
        // Handle cancel order

        break;
      case "Hubungi Cafe":
        // Handle contact cafe

        break;
      case "Lacak Pesanan":
        // Handle track order

        break;
      case "Buat Pesanan Baru":
        navigateToHome();
        break;
      default:
        break;
    }
  };

  // Loading state
  if (isLoading) {
    return <SkeletonDetailTransactionPage />;
  }

  // Error state
  if (error) {
    return (
      <ScreenWrapper>
        <HeaderBar
          title="Rincian Pesanan"
          showBack={true}
          onBack={() => navigate(-1)}
        />
        <div className="flex items-center justify-center h-screen">
          <div className="text-lg text-red-500">Error: {error}</div>
        </div>
      </ScreenWrapper>
    );
  }

  // No data state
  if (!transactionData) {
    return (
      <ScreenWrapper>
        <HeaderBar
          title="Rincian Pesanan"
          showBack={true}
          onBack={() => navigate(-1)}
        />
        <div className="flex items-center justify-center h-screen">
          <div className="text-lg">Transaction not found</div>
        </div>
      </ScreenWrapper>
    );
  }


  return (
    <ScreenWrapper>
      {/* Header */}
      <HeaderBar
        title="Rincian Pesanan"
        showBack={true}
        onBack={() => navigate(-1)}
      />

      {/* Progress Indicator */}
      <TransactionProgressIndicator status={transactionData.status} />

      {/* Countdown Timer for Payment Pending */}
      {transactionData.status === "menunggu-konfirmasi" &&
        transactionData.paymentTimer && (
          <div className="px-4 pb-4">
            <CountdownTimer
              initialMinutes={transactionData.paymentTimer}
              onTimeUp={handlePaymentTimeout}
            />
          </div>
        )}

      {/* Content */}
      <div className="flex flex-col flex-1">
        {/* Transaction Header */}
        <TransactionHeader
          title={transactionData.title}
          dateTime={transactionData.date}
          transactionInfo={transactionData.transactionInfo}
        />

        <Separator />

        {/* Order Items Section */}
        <OrderSection
          title="Pesanan"
          totalItems={transactionData.orderItems.length}
          items={transactionData.orderItems}
        />

        <Separator />

        {/* Service Fees Section - Only show if there are service fees */}
        {transactionData.serviceFees.length > 0 && (
          <>
            <ServiceFeeSection
              title="Biaya Layanan"
              totalItems={transactionData.serviceFees.length}
              items={transactionData.serviceFees}
            />
            <Separator />
          </>
        )}

        {/* Payment Details Section */}
        <PaymentDetailSection
          title="Detail Pembayaran"
          items={transactionData.paymentDetails}
        />

        {/* Points Section - Only show for completed or in-progress orders */}
        {transactionData.points !== undefined &&
          transactionData.points > 0 &&
          transactionData.status !== "menunggu-konfirmasi" && (
            <>
              <Separator />
              <PointsRewardSection
                title={`Kamu Dapat ${transactionData.points} Poin`}
                label="SpinoCaf Poin"
                points={transactionData.points}
              />
            </>
          )}
      </div>

      {/* Bottom Action Buttons */}
      <BottomActionSection
        actions={transactionData.actions.map((action) => ({
          ...action,
          onClick: () => handleActionClick(action.label),
        }))}
      />
    </ScreenWrapper>
  );
}
