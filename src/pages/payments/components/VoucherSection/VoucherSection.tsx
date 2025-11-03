import { VoucherCard } from "./VoucherCard";
import { VoucherActionButton } from "./MoreVoucherActionButton";
import { SubHeader } from "@/components";

interface VoucherSectionProps {
  voucher: {
    name: string;
    savings: number;
  };
  originalPrice?: number;
  finalPrice?: number;
  onCheckVouchers: () => void;
}

export function VoucherSection({
  voucher,
  onCheckVouchers,
}: VoucherSectionProps) {
  return (
    <div className="flex flex-col">
      <SubHeader title="Voucher Diskon" />

      <div className="relative mx-4 mb-4 h-[120px]">
        <VoucherCard name={voucher.name} savings={voucher.savings} />
        <VoucherActionButton onClick={onCheckVouchers} />
      </div>
    </div>
  );
}
