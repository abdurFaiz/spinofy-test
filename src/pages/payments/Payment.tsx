import HeaderBar from "@/components/HeaderBar";
import { ScreenWrapper } from "@/components/layout/ScreenWrapper";
import { Separator } from "@/components/Separator";
import Button from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { usePaymentStatus } from "@/hooks/Payment/usePaymentStatus";
import { useQuery } from '@tanstack/react-query';
import { OutletAPI } from "@/api/outlet.api";
import { SkeletonPaymentPage } from "@/components/skeletons/SkeletonComponents";
import { useOutletNavigation } from "@/hooks/useOutletNavigation";

export default function Index() {
    const { navigateToHome } = useOutletNavigation();
    const location = useLocation();
    const orderCode = location.state?.orderCode;
    const orderData = location.state?.orderData;

    const { checkoutData, isLoadingCheckout, checkPaymentStatus, isCheckingStatus } = usePaymentStatus(orderCode);

    // Fetch outlet information
    const { data: outletsResponse } = useQuery({
        queryKey: ['outlets-list'],
        queryFn: () => OutletAPI.getListOutlets(),
        staleTime: 10 * 60 * 1000, // 10 minutes
    });

    const outlet = outletsResponse?.data?.outlets?.[0];
    console.error("Outlet Data:", outlet);

    // Note: Removed separate payment list API call since checkout API now includes order products
    // const { data: paymentListData, isLoading: isLoadingPaymentList } = useQuery(...);

    const [timeRemaining, setTimeRemaining] = useState({ minutes: 10, seconds: 0 });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev.seconds > 0) {
                    return { ...prev, seconds: prev.seconds - 1 };
                } else if (prev.minutes > 0) {
                    return { minutes: prev.minutes - 1, seconds: 59 };
                }
                return prev;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Debug logging in useEffect to avoid re-render loop
    // useEffect(() => {
    //     // Handle both array and object responses
    //     const orderData_ = checkoutData?.data?.order;
    //     const extractedOrder = (Array.isArray(orderData_) ? orderData_[0] : orderData_) || orderData || {};
    //     const totalPayment = extractedOrder?.total ?? 0;
        

        
    // }, [orderCode, orderData, checkoutData]);

    const formatTime = (minutes: number, seconds: number) => {
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    };

    const handleCheckStatus = () => {
        checkPaymentStatus();
    };

    const handleDownloadBarcode = () => {
        // Get barcode from checkout data - handle both array and object
        const orderData_ = checkoutData?.data?.order;
        const order = Array.isArray(orderData_) ? orderData_[0] : orderData_;
        const barcodeUrl = (order as any)?.barcode;

        if (barcodeUrl) {
            // Create a download link
            const link = document.createElement('a');
            link.href = barcodeUrl;
            link.download = `QRIS-${orderCode}.png`;
            document.body.appendChild(link);
            link.click();
            link.remove();
        } else {
            alert("Barcode tidak tersedia");
        }
    };

    // Get order details from checkout API - handle both array and object responses
    const orderData_ = checkoutData?.data?.order;
    let order = null;

    if (Array.isArray(orderData_) && orderData_.length > 0) {
        order = orderData_[0];
    } else if (orderData_ && typeof orderData_ === 'object' && !Array.isArray(orderData_)) {
        order = orderData_;
    } else if (checkoutData?.data?.data && (checkoutData.data.data as any).code) {
        // Handle nested data.data structure from storeProduct response
        order = checkoutData.data.data;
    } else if (orderData) {
        // Fallback to order data from navigation state
        order = orderData;
    }

    const totalPayment = order?.total ?? 0;

    // Show loading state
    if (isLoadingCheckout) {
        return <SkeletonPaymentPage />;
    }

    return (
        <ScreenWrapper>
            <HeaderBar title="Payments" showBack={true} onBack={navigateToHome} />

            {/* Main Content */}
            <div className="flex-1 px-4 pt-6 pb-8 overflow-y-auto">
                {/* Timer Section */}
                <div className="flex flex-col gap-3 mb-8">
                    <div className="flex items-center gap-2">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M3 12C3 13.1819 3.23279 14.3522 3.68508 15.4442C4.13738 16.5361 4.80031 17.5282 5.63604 18.364C6.47177 19.1997 7.46392 19.8626 8.55585 20.3149C9.64778 20.7672 10.8181 21 12 21C13.1819 21 14.3522 20.7672 15.4442 20.3149C16.5361 19.8626 17.5282 19.1997 18.364 18.364C19.1997 17.5282 19.8626 16.5361 20.3149 15.4442C20.7672 14.3522 21 13.1819 21 12C21 9.61305 20.0518 7.32387 18.364 5.63604C16.6761 3.94821 14.3869 3 12 3C9.61305 3 7.32387 3.94821 5.63604 5.63604C3.94821 7.32387 3 9.61305 3 12Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M12 7V12L15 15" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <h2 className="text-lg font-rubik font-medium text-black capitalize">Selesaikan Pembayaran</h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-rubik font-normal text-black capitalize">Waktu Tersisa</span>
                        <div className="px-3 py-2 bg-[#F35F0F]/20 rounded-3xl">
                            <span className="text-sm font-rubik font-medium text-[#F35F0F]">
                                {formatTime(timeRemaining.minutes, timeRemaining.seconds)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* QR Code Section */}
                <div className="flex flex-col items-center gap-6 mb-8">
                    <div className="w-full max-w-[320px] aspect-square rounded-3xl overflow-hidden bg-white shadow-lg p-4">
                        {order?.barcode ? (
                            <img
                                src={order.barcode}
                                alt="QRIS Barcode"
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 rounded-2xl">
                                <div className="text-gray-400 text-center">
                                    <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M3 3h18v18H3V3zm16 16V5H5v14h14zM6 6h3v3H6V6zm0 9h3v3H6v-3zm9-9h3v3h-3V6z" />
                                    </svg>
                                    <p className="text-sm">Barcode tidak tersedia</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Order Items List */}
                    {order?.order_products && order.order_products.length > 0 && (
                        <div className="w-full bg-white rounded-2xl p-4 shadow-sm mb-4">
                            <h3 className="text-lg font-rubik font-medium text-black mb-3">Order Items ({order.order_products.length})</h3>
                            <div className="space-y-3">
                                {order.order_products.map((item: any) => (
                                    <div key={item.id || item.product?.id || Math.random()} className="flex justify-between items-center py-2">
                                        <div className="flex-1">
                                            <div className="font-medium text-black">
                                                {item.product?.name || 'Product'}
                                            </div>
                                            {item.note && (
                                                <div className="text-sm text-gray-600 mt-1">
                                                    Note: {item.note}
                                                </div>
                                            )}
                                            {item.order_product_variant && item.order_product_variant.length > 0 && (
                                                <div className="text-sm text-gray-600 mt-1">
                                                    Variants: {item.order_product_variant.map((variant: any) =>
                                                        variant.product_attribute_value?.value
                                                    ).filter(Boolean).join(', ')}
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <div className="font-medium text-black">
                                                {item.quantity}x
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Rp {Number(item.price).toLocaleString('id-ID')}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Total Payment */}
                    <div className="flex flex-col items-center gap-2">
                        <h3 className="text-lg font-rubik font-medium text-black capitalize">Total Pembayaran</h3>
                        <div className="text-2xl font-medium text-black">
                            Rp {totalPayment.toLocaleString('id-ID')}
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-3 mb-8">
                    <Button
                        onClick={handleCheckStatus}
                        variant={"primary"}
                        size={"xl"}
                        disabled={isCheckingStatus}
                    >
                        {isCheckingStatus ? 'Mengecek...' : 'Check Status Pembayaran'}
                    </Button>
                    <Button onClick={handleDownloadBarcode} variant={"outline"} size={"xl"}>
                        Unduh Barcode
                    </Button>
                </div>

                <Separator />
                {/* Instructions */}
                <div className="flex flex-col gap-4 mt-6">
                    <h3 className="text-lg font-rubik font-medium text-black">Cara Membayarnya :</h3>
                    <div className="flex flex-col gap-2">
                        <p className="text-base font-normal text-black leading-6">
                            <span className="font-medium">1.</span>{' '}
                            Klik unduh barcode atau screenshoot barcode untuk menyimpan gambar QRIS
                        </p>
                        <p className="text-base font-normal text-black leading-6">
                            <span className="font-medium">2.</span>{' '}
                            Buka pembayaran QRIS pada mobile banking atau e-wallet
                        </p>
                        <p className="text-base font-normal text-black leading-6">
                            <span className="font-medium">3.</span>{' '}
                            Unggah gambar QRIS yang telah tersimpan dan selesaikan pembayaran
                        </p>
                        <p className="text-base font-normal text-black leading-6">
                            <span className="font-medium">4.</span>{' '}
                            Cek status pembayaran pada platform ini
                        </p>
                    </div>
                </div>
            </div>
        </ScreenWrapper>
    );
}