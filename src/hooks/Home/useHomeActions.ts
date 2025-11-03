import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOutletSlug } from "@/hooks/useOutletSlug";

export const useHomeActions = () => {
  const navigate = useNavigate();
  const outletSlug = useOutletSlug();
  const [isCartBottomSheetOpen, setIsCartBottomSheetOpen] = useState(false);

  const handleCartClick = useCallback(() => {
    setIsCartBottomSheetOpen(true);
  }, []);

  const handleCloseCartBottomSheet = useCallback(() => {
    setIsCartBottomSheetOpen(false);
  }, []);

  const handleProductClick = useCallback(
    (productId: string) => {
      if (outletSlug) {
        navigate(`/${outletSlug}/DetailItem?id=${encodeURIComponent(productId)}`);
      } else {
        navigate('/onboard');
      }
    },
    [navigate, outletSlug],
  );

  return {
    isCartBottomSheetOpen,
    handleCartClick,
    handleCloseCartBottomSheet,
    handleProductClick,
  };
};
