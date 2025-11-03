import { ScreenWrapper } from "@/components/layout/ScreenWrapper";
import { VoucherListSection } from "@/components/VoucherListSection";
import { Separator } from "@/components/Separator";
import HeaderBar from "@/components/HeaderBar";
import { useNavigate } from "react-router-dom";
import { TextInputWithIcon } from "../vouchers/Components/InputVouchers";
import { VoucherCalculationCard } from "./components/VoucherSection/VoucherCalculationCard";
import { useCart } from "@/hooks/useCart";
import { useVoucherCalculation } from "@/hooks/Voucher/useVoucherCalculation";
import type { Voucher } from "@/hooks/Voucher/useVoucherCalculation";

export default function VoucherCheckout() {
  const navigate = useNavigate();
  // const [searchParams] = useSearchParams();
  const { getTotalPrice } = useCart();

  const subtotal = getTotalPrice();
  const { calculation, appliedVoucher, applyVoucher, removeVoucher } =
    useVoucherCalculation(subtotal, 0.1);

  // Mock voucher data with different types and conditions
  const availableVouchers: Voucher[] = [
    {
      id: "newuser50",
      name: "New User Voucher - Diskon 50% Hingga Rp 40K",
      type: "percentage",
      value: 50,
      maxDiscount: 40000,
      minTransaction: 0,
      isActive: true,
    },
    {
      id: "firstorder30",
      name: "Diskon Pesanan Pertama 30% Hingga Rp 25K",
      type: "percentage",
      value: 30,
      maxDiscount: 25000,
      minTransaction: 50000,
      isActive: true,
    },
    {
      id: "fixed15k",
      name: "Hemat Langsung Rp 15.000",
      type: "fixed",
      value: 15000,
      minTransaction: 75000,
      isActive: true,
    },
    {
      id: "weekend20",
      name: "Weekend Special - Diskon 20%",
      type: "percentage",
      value: 20,
      maxDiscount: 30000,
      minTransaction: 100000,
      isActive: false, // Currently inactive
    },
  ];

  // Convert to voucher card format
  const convertToVoucherCard = (voucher: Voucher) => {
    const isApplied = appliedVoucher?.id === voucher.id;

    // Calculate potential discount for this voucher
    let potentialDiscount = 0;
    let canUse = true;

    if (voucher.minTransaction && subtotal < voucher.minTransaction) {
      canUse = false;
    } else if (voucher.isActive) {
      if (voucher.type === "percentage") {
        potentialDiscount = Math.round(subtotal * (voucher.value / 100));
        if (voucher.maxDiscount && potentialDiscount > voucher.maxDiscount) {
          potentialDiscount = voucher.maxDiscount;
        }
      } else if (voucher.type === "fixed") {
        potentialDiscount = Math.min(voucher.value, subtotal);
      }
    }

    let subtitle = "";
    if (voucher.minTransaction && voucher.minTransaction > 0) {
      subtitle = `Min. Belanja Rp ${voucher.minTransaction.toLocaleString("id-ID")}`;
    } else {
      subtitle = "Tanpa Min. Belanja";
    }

    let status: "active" | "cancelled" | "disabled" | "expired";
    if (!voucher.isActive) {
      status = "expired";
    } else if (!canUse) {
      status = "disabled";
    } else if (isApplied) {
      status = "cancelled"; // Use cancelled to show "applied" state
    } else {
      status = "active";
    }

    return {
      title: voucher.name,
      subtitle,
      expiryDate: "31 Dec 2025",
      minTransaction: subtitle,
      status,
      potentialSavings: potentialDiscount,
      voucher,
    };
  };

  const activeVouchers = availableVouchers
    .filter((v) => v.isActive)
    .map(convertToVoucherCard);

  const expiredVouchers = availableVouchers
    .filter((v) => !v.isActive)
    .map(convertToVoucherCard);

  const handleVoucherClick = (voucherCard: any) => {
    if (voucherCard.status === "active") {
      applyVoucher(voucherCard.voucher);
    } else if (voucherCard.status === "cancelled") {
      // If already applied, remove it
      if (appliedVoucher?.id === voucherCard.voucher.id) {
        removeVoucher();
      }
    }
  };

  const handleApplyVoucher = () => {
    // Navigate back to checkout with applied voucher
    navigate(-1);
  };

  const handleClearVoucher = () => {
    removeVoucher();
  };

  const handleOpenVoucherModal = () => {
    console.log("Buka modal input voucher");
  };

  return (
    <ScreenWrapper>
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white rounded-b-3xl shadow-[0_4px_8px_0_rgba(128,128,128,0.24)]">
        <div className="px-4 py-5 flex flex-col gap-6">
          <HeaderBar
            title="Pilih Voucher"
            showBack={true}
            onBack={() => navigate(-1)}
            className="p-0 bg-transparent shadow-none"
          />
          <TextInputWithIcon onClick={handleOpenVoucherModal} />
        </div>
      </div>

      {/* Calculation Summary - Fixed at top when voucher applied */}
      {appliedVoucher && calculation.discount > 0 && (
        <div className="sticky top-[140px] z-10 px-4 py-4 bg-white border-b border-gray-100">
          <VoucherCalculationCard
            originalPrice={calculation.originalPrice}
            discount={calculation.discount}
            finalPrice={calculation.finalPrice}
            voucherName={appliedVoucher.name}
          />

          {/* Action Buttons */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleClearVoucher}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-2xl font-medium hover:bg-gray-50 transition-colors"
            >
              Hapus Voucher
            </button>
            <button
              onClick={handleApplyVoucher}
              className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-2xl font-medium hover:bg-orange-600 transition-colors"
            >
              Gunakan Voucher
            </button>
          </div>
        </div>
      )}

      {/* Voucher List */}
      <div className="flex flex-col gap-9 mt-6 mb-28">
        <VoucherListSection
          title="Voucher Tersedia"
          totalItems={activeVouchers.length}
          vouchers={activeVouchers}
          onVoucherClick={handleVoucherClick}
        />

        {expiredVouchers.length > 0 && (
          <>
            <Separator />
            <VoucherListSection
              title="Voucher Tidak Tersedia"
              totalItems={expiredVouchers.length}
              vouchers={expiredVouchers}
              onVoucherClick={handleVoucherClick}
            />
          </>
        )}
      </div>
    </ScreenWrapper>
  );
}
