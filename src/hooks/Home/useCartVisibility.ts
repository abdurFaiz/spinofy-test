import { useCart } from "@/store";
import { useScrollDirection } from "../useScrollDirection";
import { useMemo } from "react";
import { HomeUIService } from "@/services/home/homeUIService";

export const useCartVisibility = () => {
  const { getTotalItems, items } = useCart();
  const { isScrollingDown, isScrollingStopped } = useScrollDirection({
    threshold: 10,
    scrollStopDelay: 150,
  });

  // Use items.length directly to ensure reactivity
  const totalItems = items.length > 0 ? getTotalItems() : 0;

  const isCartVisible = useMemo(
    () =>
      HomeUIService.calculateCartVisibility(
        totalItems,
        isScrollingDown,
        isScrollingStopped,
      ),
    [totalItems, isScrollingDown, isScrollingStopped],
  );

  return { totalItems, isCartVisible };
};