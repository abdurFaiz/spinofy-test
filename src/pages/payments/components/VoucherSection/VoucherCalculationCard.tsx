import { TrendingDown } from "lucide-react";

interface VoucherCalculationCardProps {
  originalPrice: number;
  discount: number;
  finalPrice: number;
  voucherName?: string;
  className?: string;
}

export function VoucherCalculationCard({
  originalPrice,
  discount,
  finalPrice,
  voucherName,
  className = "",
}: VoucherCalculationCardProps) {
  const savings = originalPrice - finalPrice;
  const savingsPercentage = ((savings / originalPrice) * 100).toFixed(0);

  return (
    <div
      className={`bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4 ${className}`}
    >
      {/* Voucher Applied Info */}
      {voucherName && (
        <div className="mb-3 p-2 bg-white/70 rounded-lg border border-green-100">
          <p className="text-xs text-green-700 font-medium">
            Voucher Diterapkan:
          </p>
          <p className="text-sm text-green-800 font-medium truncate">
            {voucherName}
          </p>
        </div>
      )}

      {/* Price Breakdown */}
      <div className="space-y-2">
        {/* Original Price */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Harga Asli</span>
          <span className="text-sm text-gray-800 line-through">
            Rp {originalPrice.toLocaleString("id-ID")}
          </span>
        </div>

        {/* Discount */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-green-600 flex items-center gap-1">
            <TrendingDown className="w-3 h-3" />
            Hemat
          </span>
          <span className="text-sm text-green-600 font-semibold">
            - Rp {discount.toLocaleString("id-ID")}
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-green-200 my-2"></div>

        {/* Final Price */}
        <div className="flex justify-between items-center">
          <span className="text-base font-semibold text-gray-900">
            Total Bayar
          </span>
          <div className="text-right">
            <div className="text-lg font-bold text-green-600">
              Rp {finalPrice.toLocaleString("id-ID")}
            </div>
            <div className="text-xs text-green-500">
              Hemat {savingsPercentage}%!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VoucherCalculationCard;
