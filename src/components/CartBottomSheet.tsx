import { useEffect } from "react";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useNavigate } from "react-router-dom";
import { useOutletSlug } from "@/hooks/useOutletSlug";
import { getImageUrl } from "@/utils/utils";
import type { CartItem } from "@/types/Cart";

interface CartBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartBottomSheet({ isOpen, onClose }: CartBottomSheetProps) {
  const { items, updateQuantity, removeItem, getTotalPrice } = useCart();
  const navigate = useNavigate();
  const outletSlug = useOutletSlug();

  // Prevent body scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleQuantityChange = (item: CartItem, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(item.id);
    } else {
      updateQuantity(item.id, newQuantity);
    }
  };

  const handleItemClick = (item: CartItem) => {
    // Navigate to detail page in cart-edit mode
    if (outletSlug) {
      navigate(`/${outletSlug}/DetailItem?uuid=${item.productUuid}&mode=cart-edit&cartItemId=${item.id}`, {
        state: {
          cartEditMode: true,
          cartItemId: Number(item.id),
          productUuid: item.productUuid,
          variantIds: item.variantIds || [],
          quantity: item.quantity,
          note: item.notes || "",
        },
      });
    } else {
      navigate('/onboard');
    }
    onClose(); // Close the bottom sheet
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50 max-w-[440px] mx-auto animate-in slide-in-from-bottom duration-300">
        <div className="bg-white rounded-t-3xl shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-full">
                <ShoppingBag className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Keranjang Saya
                </h2>
                <p className="text-sm text-gray-500">
                  {items.length} item dalam keranjang
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="max-h-[60vh] overflow-y-auto">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Keranjang Kosong
                </h3>
                <p className="text-gray-500 text-center">
                  Belum ada item yang ditambahkan ke keranjang
                </p>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    {/* Item Image - Clickable */}
                    <div
                      className="w-16 h-16 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0"
                      onClick={() => handleItemClick(item)}
                    >
                      {item.image ? (
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-orange-200 to-orange-300 flex items-center justify-center">
                          <ShoppingBag className="w-6 h-6 text-orange-600" />
                        </div>
                      )}
                    </div>

                    {/* Item Details - Clickable */}
                    <div
                      className="flex-1 min-w-0"
                      onClick={() => handleItemClick(item)}
                    >
                      <h3 className="font-medium text-gray-900 truncate">
                        {item.name}
                      </h3>
                      <div className="mt-1 space-y-1">
                        {item.size && (
                          <p className="text-xs text-gray-500">
                            Ukuran: {item.size}
                          </p>
                        )}
                        {item.ice && (
                          <p className="text-xs text-gray-500">
                            Es: {item.ice}
                          </p>
                        )}
                        {item.options.length > 0 && (
                          <p className="text-xs text-gray-500">
                            Pilihan: {item.options.join(", ")}
                          </p>
                        )}
                        {item.notes && (
                          <p className="text-xs text-gray-500">
                            Catatan: {item.notes}
                          </p>
                        )}
                      </div>
                      <p className="mt-2 font-semibold text-orange-600">
                        Rp {item.price.toLocaleString("id-ID")}
                      </p>
                    </div>

                    {/* Quantity Controls - Non-clickable (stops propagation) */}
                    <div
                      className="flex items-center gap-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() =>
                          handleQuantityChange(item, item.quantity - 1)
                        }
                        className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-orange-300 transition-colors"
                      >
                        <Minus className="w-4 h-4 text-gray-600" />
                      </button>
                      <span className="w-8 text-center font-medium text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantityChange(item, item.quantity + 1)
                        }
                        className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer with Total */}
          {items.length > 0 && (
            <div className="p-6 border-t border-gray-100 bg-white rounded-b-3xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-gray-900">
                  Total
                </span>
                <span className="text-lg font-bold text-orange-600">
                  Rp {getTotalPrice().toLocaleString("id-ID")}
                </span>
              </div>
              <button
                onClick={onClose}
                className="w-full bg-primary-orange text-white py-3 px-4 rounded-2xl font-medium hover:bg-orange-600 transition-colors"
              >
                Lanjut Belanja
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
