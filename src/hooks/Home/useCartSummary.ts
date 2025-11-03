import { useCart } from "@/store";

export const useCartSummary = () => {
  const {  items } = useCart();

  // Calculate totals directly from items to ensure reactivity
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return { totalItems, totalPrice };
};