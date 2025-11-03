import { ScreenWrapper } from "@/components/layout/ScreenWrapper";
import { VoucherListSection } from "@/components/VoucherListSection";
import { Separator } from "@/components/Separator";
import HeaderBar from "@/components/HeaderBar";
import { useNavigate } from "react-router-dom";
import { TextInputWithIcon } from "../vouchers/Components/InputVouchers";

export default function Index() {
  const navigate = useNavigate();
  const terbaruVouchers = [
    {
      title: "New User Voucher - Diskon 50% Hingga Rp 40K",
      subtitle: "Tanpa Min.Belanja",
      expiryDate: "30 Oct 2025",
      minTransaction: "-",
      status: "active" as const,
    },
    {
      title: "New User Voucher - Diskon 50% Hingga Rp 40K",
      subtitle: "Tanpa Min.Belanja",
      expiryDate: "30 Oct 2025",
      minTransaction: "-",
      status: "cancelled" as const,
    },
    {
      title: "New User Voucher - Diskon 50% Hingga Rp 40K",
      subtitle: "Tanpa Min.Belanja",
      expiryDate: "30 Oct 2025",
      minTransaction: "-",
      status: "active" as const,
    },
    {
      title: "New User Voucher - Diskon 50% Hingga Rp 40K",
      subtitle: "Tanpa Min.Belanja",
      expiryDate: "30 Oct 2025",
      minTransaction: "-",
      status: "active" as const,
    },
  ];

  const lainnyaVouchers = [
    {
      title: "Voucher Disneyland - Diskon 50% Hingga Rp 400K",
      subtitle: "Min.Belanja 1000K",
      expiryDate: "30 Oct 2025",
      minTransaction: "1000K",
      status: "disabled" as const,
    },
    {
      title: "Voucher Disneyland - Diskon 50% Hingga Rp 400K",
      subtitle: "Min.Belanja 1000K",
      expiryDate: "30 Oct 2025",
      minTransaction: "1000K",
      status: "disabled" as const,
    },
    {
      title: "Voucher Disneyland - Diskon 50% Hingga Rp 400K",
      subtitle: "Min.Belanja 1000K",
      expiryDate: "30 Oct 2025",
      minTransaction: "1000K",
      status: "disabled" as const,
    },
  ];

  const expiredVouchers = [
    {
      title: "New User Voucher - Diskon 50% Hingga Rp 40K",
      subtitle: "Tanpa Min.Belanja",
      expiryDate: "30 Oct 2025",
      minTransaction: "-",
      status: "expired" as const,
    },
  ];

  const handleOpenVoucherModal = () => {
    console.log("Buka modal input voucher");
  };

  return (
    <ScreenWrapper>
      <div className="sticky top-0 z-10 bg-white rounded-b-3xl shadow-[0_4px_8px_0_rgba(128,128,128,0.24)]">
        <div className="px-4 py-5 flex flex-col gap-6">
          <HeaderBar
            title="Vouchers"
            showBack={true}
            onBack={() => navigate(-1)}
            className="p-0 bg-transparent shadow-none"
          />
          <TextInputWithIcon onClick={handleOpenVoucherModal} />
        </div>
      </div>

      <div className="flex flex-col gap-9 mt-6 mb-28">
        <VoucherListSection
          title="Terbaru"
          totalItems={5}
          vouchers={terbaruVouchers}
        />
        <Separator />
        <VoucherListSection
          title="Langsung Tukarkan Ke Kasir"
          totalItems={5}
          vouchers={lainnyaVouchers}
        />
        <Separator />
        <VoucherListSection
          title="Terbaru"
          totalItems={5}
          vouchers={expiredVouchers}
        />
      </div>
    </ScreenWrapper>
  );
}
