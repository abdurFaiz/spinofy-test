import { useCheckoutActions } from "./useCheckoutActions";
import { useCheckoutData } from "./useCheckoutData";

export const useCheckout = () => {
  const checkoutData = useCheckoutData();
  const checkoutActions = useCheckoutActions();

  return {
    ...checkoutData,
    ...checkoutActions,
  };
};