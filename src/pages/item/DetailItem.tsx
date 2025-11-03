import { useState, useEffect } from "react";
import { ScreenWrapper } from "@/components/layout/ScreenWrapper";
import AttributeSelector from "./Components/selectors/AttributeSelector";
import NotesInput from "./Components/NotesInput";
import {
  AddToCartButton,
  QuantitySelector,
} from "./Components/ActionBottomBar";
import { HeroImage } from "./Components/HeroImage";
import { ProductInfo } from "./Components/ProductInfo";
import {  useSearchParams, useLocation } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ProductAPI from "@/api/product.api";
import OutletAPI from "@/api/outlet.api";
import { PaymentAPI } from "@/api/payment.api";
import { SkeletonDetailItemPage } from "@/components/skeletons/SkeletonComponents";
import { useOutletNavigation } from "@/hooks/useOutletNavigation";
import { getImageUrl } from "@/utils/utils";

export default function DetailItem() {
  const { navigateToHome, navigateToCheckout } = useOutletNavigation();
  const location = useLocation();
  const { addItem, updateItem, items } = useCart();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  // Support both 'id' (number) and 'uuid' (string) parameters
  const productIdParam = searchParams.get('id'); // Legacy numeric ID
  const productUuidParam = searchParams.get('uuid'); // Preferred UUID string
  const productIdentifier = productUuidParam || productIdParam; // Use UUID if available

  const mode = searchParams.get('mode');
  const editMode = mode === 'edit'; // Edit existing order (with orderProductId)
  const cartEditMode = mode === 'cart-edit'; // Edit cart item (before order created)

  // Get edit data from location state
  const editData = location.state as {
    // For order edit mode
    editMode?: boolean;
    orderProductId?: number;
    // For cart edit mode
    cartEditMode?: boolean;
    cartItemId?: number;
    // Common fields
    productId?: number; // Numeric ID (legacy)
    productUuid?: string; // String UUID (preferred)
    variantIds?: number[];
    quantity?: number;
    note?: string;
  } | null;

  // State for selections - now using a Map to store selections per attribute
  const [attributeSelections, setAttributeSelections] = useState<Map<number, Set<string>>>(new Map());
  const [quantity, setQuantity] = useState(editData?.quantity || 1);
  const [notes, setNotes] = useState(editData?.note || "");

  // Get outlets list to find the first outlet's slug
  const { data: outletsResponse, isLoading: outletsLoading } = useQuery({
    queryKey: ['outlets-list'],
    queryFn: () => OutletAPI.getListOutlets(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const outletSlug = outletsResponse?.data?.outlets?.[0]?.slug;

  // Fetch product details
  const {
    data: productResponse,
    isLoading: productLoading,
    error: productError
  } = useQuery({
    queryKey: ['product-detail', outletSlug, productIdentifier],
    queryFn: () => {
      if (!outletSlug || !productIdentifier) {
        throw new Error('Missing outlet slug or product identifier');
      }
      return ProductAPI.getProduct(outletSlug, productIdentifier);
    },
    enabled: !!outletSlug && !!productIdentifier,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const product = productResponse?.data?.product;
  const productAttributes = product?.attributes || [];

  // Update product mutation for edit mode
  const updateProductMutation = useMutation({
    mutationFn: ({ outletSlug, orderProductId, payload }: {
      outletSlug: string;
      orderProductId: number;
      payload: { product_id: number; variant_id: number[]; quantity: number; note: string };
    }) => PaymentAPI.updateOrderProduct(outletSlug, orderProductId, payload),
    onSuccess: () => {
     
      // Invalidate orders query to refresh checkout data
      queryClient.invalidateQueries({ queryKey: ['orders-list'] });
      navigateToCheckout();
    },
    onError: (error) => {
      console.error('Update product failed:', error);
      alert('Failed to update product. Please try again.');
    },
  });

  // Store product mutation for empty cart (add first item)
  const storeProductMutation = useMutation({
    mutationFn: ({ outletSlug, payload }: {
      outletSlug: string;
      payload: { product_id: number; variant_id: number[]; quantity: number; note: string };
      cartItem: any;
    }) => PaymentAPI.storeProduct(outletSlug, payload),
    onSuccess: (_data, variables) => {
     
      // Add item to local cart so it shows in cart view
      if (variables.cartItem) {
        addItem(variables.cartItem);
      }
      // Invalidate payment cache to sync with backend
      queryClient.invalidateQueries({ queryKey: ['payment-cart'] });
      navigateToHome();
    },
    onError: (error) => {
      console.error('Store product failed:', error);
     
    },
  });

  // Initialize selections when product loads
  useEffect(() => {
    if (productAttributes.length > 0) {
      const initialSelections = new Map<number, Set<string>>();

      // If in any edit mode (order or cart) and has variantIds, populate with existing selections
      if ((editMode || cartEditMode) && editData?.variantIds && editData.variantIds.length > 0) {
        for (const attr of productAttributes) {
          const selectedValues = new Set<string>();

          for (const variantId of editData.variantIds) {
            const value = attr.values.find(v => v.id === variantId);
            if (value) {
              const valueKey = `${attr.id}-${value.id}`;
              selectedValues.add(valueKey);
            }
          }

          if (selectedValues.size > 0) {
            initialSelections.set(attr.id, selectedValues);
          }
        }
      } else {
        // Default: Set first value for each attribute
        for (const attr of productAttributes) {
          if (attr.values && attr.values.length > 0) {
            const firstValue = attr.values[0];
            const valueKey = `${attr.id}-${firstValue.id}`;
            initialSelections.set(attr.id, new Set([valueKey]));
          }
        }
      }

      setAttributeSelections(initialSelections);
    }
  }, [productAttributes.length, editMode, cartEditMode, editData?.variantIds]);

  const isLoading = outletsLoading || productLoading;

  if (isLoading) {
    return <SkeletonDetailItemPage />;
  }

  if (productError || !product) {
    return (
      <ScreenWrapper>
        <div className="flex items-center justify-center h-screen">
          <div className="text-lg text-red-500">
            Error loading product details. Please try again.
          </div>
        </div>
      </ScreenWrapper>
    );
  }

  // Calculate prices based on selections
  const basePrice = Number.parseInt(product.price);

  // Calculate extra price from selected attribute values
  let extraPrice = 0;
  for (const attr of productAttributes) {
    const selectedSet = attributeSelections.get(attr.id);
    if (selectedSet) {
      for (const valueKey of selectedSet) {
        // valueKey format: "attributeId-valueId"
        const valueId = Number.parseInt(valueKey.split('-')[1]);
        const value = attr.values.find(v => v.id === valueId);
        if (value) {
          extraPrice += value.extra_price;
        }
      }
    }
  }

  const totalPrice = (basePrice + extraPrice) * quantity;

  const toggleAttributeSelection = (
    attributeId: number,
    valueKey: string,
    isRadio: boolean
  ) => {
    setAttributeSelections(prev => {
      const newSelections = new Map(prev);
      const currentSet = newSelections.get(attributeId) || new Set<string>();

      if (isRadio) {
        // For radio (single select), replace with new selection
        newSelections.set(attributeId, new Set([valueKey]));
      } else {
        // For checkbox (multi select), toggle
        const newSet = new Set(currentSet);
        if (newSet.has(valueKey)) {
          newSet.delete(valueKey);
        } else {
          newSet.add(valueKey);
        }
        newSelections.set(attributeId, newSet);
      }

      return newSelections;
    });
  };

  const handleAddToCart = () => {

    // Collect all selected variant IDs
    const selectedVariantIds: number[] = [];
    const selectedAttributesData: string[] = [];

    for (const attr of productAttributes) {
      const selectedSet = attributeSelections.get(attr.id);
      if (selectedSet) {
        for (const valueKey of selectedSet) {
          const valueId = Number.parseInt(valueKey.split('-')[1]);
          const value = attr.values.find(v => v.id === valueId);
          if (value) {
            selectedVariantIds.push(value.id); // Collect variant IDs for API
            selectedAttributesData.push(`${attr.name}: ${value.name}`);
          }
        }
      }
    }

   

    // Prepare payload
    const payload = {
      product_id: product.id,
      variant_id: selectedVariantIds,
      quantity: quantity,
      note: notes,
    };

    // Check if in order edit mode (editing existing order in backend)
    if (editMode && editData?.orderProductId && outletSlug && product?.id) {
     
      updateProductMutation.mutate({
        outletSlug,
        orderProductId: editData.orderProductId,
        payload,
      });
    }
    // Check if in cart edit mode (editing cart item before order created)
    else if (cartEditMode && editData?.cartItemId) {
     
      // Update cart item
      const cartItemUpdates = {
        productUuid: product.uuid,
        name: product.name,
        price: totalPrice / quantity,
        quantity,
        options: selectedAttributesData,
        notes,
        image: getImageUrl(product.image_url),
        productId: product.id,
        variantIds: selectedVariantIds,
      };

     
      updateItem(editData.cartItemId.toString(), cartItemUpdates);
      navigateToCheckout();
    }
    // If cart is empty AND we're not in edit mode -> use storeProduct to create order on backend
    else if (items.length === 0 && outletSlug && product?.id && !editMode && !cartEditMode) {
     

      // Create cart item object for local storage
      const cartItem = {
        productUuid: product.uuid,
        name: product.name,
        price: totalPrice / quantity,
        quantity,
        options: selectedAttributesData,
        size: "regular", // Legacy field
        ice: "normal",   // Legacy field
        notes,
        image: getImageUrl(product.image_url),
        // Additional fields for future edit
        productId: product.id,
        variantIds: selectedVariantIds,
      };

      storeProductMutation.mutate({
        outletSlug,
        payload,
        cartItem,
      });
    }
    else {
     

      // Create cart item object for local storage
      const cartItem = {
        productUuid: product.uuid,
        name: product.name,
        price: totalPrice / quantity,
        quantity,
        options: selectedAttributesData,
        size: "regular", // Legacy field
        ice: "normal",   // Legacy field
        notes,
        image: getImageUrl(product.image_url),
        // Additional fields for future edit
        productId: product.id,
        variantIds: selectedVariantIds,
      };

      // If outlet available, add to backend order via API (this handles both new orders and existing orders)
      if (outletSlug && product?.id) {
       

        storeProductMutation.mutate({
          outletSlug,
          payload,
          cartItem,
        });
      } else {
        // Fallback: add only to local cart if no outlet
    
        addItem(cartItem);
        navigateToHome();
      }
    }
  };

  return (
    <ScreenWrapper>
      <HeroImage
        imgSrc={getImageUrl(product.image_url)}
        onBack={navigateToHome}
      />
      <div className="flex flex-col gap-9 px-4 py-6 mb-24">
        <ProductInfo
          title={product.name}
          description={product.description}
          price={basePrice}
        />

        {/* Render dynamic attribute selectors */}
        {productAttributes.map((attribute) => (
          <AttributeSelector
            key={attribute.id}
            attribute={attribute}
            selected={attributeSelections.get(attribute.id) || new Set()}
            toggle={(_, _current, value) =>
              toggleAttributeSelection(attribute.id, value, attribute.display_type === 1)
            }
          />
        ))}

        <NotesInput value={notes} onChange={setNotes} />
      </div>

      <div className="max-w-[440px] mx-auto fixed bottom-0 left-0 right-0 rounded-t-3xl bg-white px-4 py-6 shadow-body-grey/20 inset-x-1 inset-shadow-body-grey flex justify-between items-center gap-4 shadow-[0_-4px_8px_0_rgba(128,128,128,0.20)]">
        <QuantitySelector
          quantity={quantity}
          onIncrease={() => setQuantity((prev) => prev + 1)}
          onDecrease={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))}
        />
        <AddToCartButton
          totalPrice={totalPrice}
          onAddToCart={handleAddToCart}
          buttonText={editMode || cartEditMode ? "Simpan Perubahan" : "Tambah"}
          isLoading={updateProductMutation.isPending || storeProductMutation.isPending}
        />
      </div>
    </ScreenWrapper>
  );
}
