import { useCart } from "@/store";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import CheckoutService from "@/services/checkout";
// import type { SpecialOffer } from "@/services/checkout";
// import type { Voucher } from "@/hooks/Voucher/useVoucherCalculation";
// import type { SpecialOffer } from "@/services/checkout";
// import type { Voucher } from "@/hooks/Voucher/useVoucherCalculation";
// import type { SpecialOffer } from "@/services/checkout";
// import type { Voucher } from "@/hooks/Voucher/useVoucherCalculation";



export interface CheckoutActionsReturn {
  handleItemQuantityUpdate: (itemId: string, delta: number) => void;
  handleAddMoreItems: () => void;
  // handleAddSpecialOffer: (offer: SpecialOffer) => void;
  // handleApplyVoucher: (voucher: Voucher | null) => void;
  handleRemoveVoucher: () => void;
  handleSubmitOrder: () => void;
  handleNavigateToVouchers: () => void;
}

export const useCheckoutActions = (): CheckoutActionsReturn => {
  const navigate = useNavigate();
  const { items, updateQuantity } = useCart();

  const handleItemQuantityUpdate = useCallback(
    (itemId: string, delta: number) => {
      const item = items.find((i) => i.id === itemId);
      const newQuantity = item ? item.quantity + delta : 1;
      CheckoutService.handleItemQuantityUpdate(
        items,
        itemId,
        newQuantity,
        updateQuantity,
      );
    },
    [items, updateQuantity],
  );

  const handleAddMoreItems = useCallback(() => {
    CheckoutService.handleCheckoutNavigation("home", navigate);
  }, [navigate]);

  // const handleAddSpecialOffer = useCallback(
  //   (offer: SpecialOffer) => {
  //     CheckoutService.handleAddSpecialOffer(offer, addItem);
  //   },
  //   [addItem],
  // );

  // const handleApplyVoucher = useCallback((voucher: Voucher | null) => {
  //   // This will be handled by the parent component that manages voucher state
    
  // }, []);

  const handleRemoveVoucher = useCallback(() => {
    // This will be handled by the parent component that manages voucher state
    // Just a placeholder for now
    console.log("Removing voucher");
  }, []);

  const handleSubmitOrder = useCallback(() => {
    const validation = CheckoutService.validateCheckout(items);
    if (validation.isValid) {
      CheckoutService.handleCheckoutNavigation("payment", navigate);
    } else {
      console.error("Validation errors:", validation.errors);
    }
  }, [items, navigate]);

  const handleNavigateToVouchers = useCallback(() => {
    CheckoutService.handleCheckoutNavigation("voucher", navigate);
  }, [navigate]);

  return {
    handleItemQuantityUpdate,
    handleAddMoreItems,
    // handleAddSpecialOffer,
    // handleApplyVoucher,
    handleRemoveVoucher,
    handleSubmitOrder,
    handleNavigateToVouchers,
  };
};
