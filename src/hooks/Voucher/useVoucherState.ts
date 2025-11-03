import { useState, useCallback } from 'react';

export interface Voucher {
  id: string;
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
  maxDiscount?: number;
  minTransaction?: number;
  isActive: boolean;
}

export interface UseVoucherStateReturn {
  appliedVoucher: Voucher | null;
  applyVoucher: (voucher: Voucher | null) => void;
  removeVoucher: () => void;
  hasAppliedVoucher: boolean;
}

export const useVoucherState = (): UseVoucherStateReturn => {
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);

  const applyVoucher = useCallback((voucher: Voucher | null) => {
    setAppliedVoucher(voucher);
  }, []);

  const removeVoucher = useCallback(() => {
    setAppliedVoucher(null);
  }, []);

  const hasAppliedVoucher = appliedVoucher !== null;

  return {
    appliedVoucher,
    applyVoucher,
    removeVoucher,
    hasAppliedVoucher,
  };
};

export default useVoucherState;
