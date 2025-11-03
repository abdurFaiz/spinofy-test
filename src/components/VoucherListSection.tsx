import confetti from "canvas-confetti";
import { SubHeader } from "./SubHeader";
import VoucherCard from "./VoucherCard";
import type { VoucherCardProps } from "./VoucherCard";

interface VoucherListSectionProps {
  title: string;
  vouchers: VoucherCardProps[];
  totalItems: number;
  onVoucherClick?: (voucher: VoucherCardProps) => void;
}

export function VoucherListSection({
  title,
  vouchers,
  totalItems,
  onVoucherClick,
}: VoucherListSectionProps) {
  const handleClickConfetti = () => {
    const end = Date.now() + 1 * 1000; // 3 seconds
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];
    const frame = () => {
      if (Date.now() > end) return;
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });
      requestAnimationFrame(frame);
    };
    frame();
  };

  function handleClicVoucher(
    voucher: VoucherCardProps,
    status: "active" | "cancelled" | "disabled" | "expired",
  ) {
    if (status === "active") {
      handleClickConfetti();
    }
    onVoucherClick?.(voucher);
  }
  return (
    <div className="flex flex-col gap-6">
      <SubHeader title={title} totalItems={totalItems} />
      <div className="flex flex-col gap-5">
        {vouchers.map((voucher, idx) => (
          <VoucherCard
            onClick={() => handleClicVoucher(voucher, voucher.status)}
            key={idx}
            {...voucher}
          />
        ))}
      </div>
    </div>
  );
}
