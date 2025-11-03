import { HomeNavigationService } from "./homeNavigationService";
import { ACTION_TYPES } from "@/constants/home";
import type { UserAction } from "@/types/Home";

export class HomeActionService {
  private static actionHistory: UserAction[] = [];
  private static maxHistorySize: number = 100;  
  /**
   * Handle add to cart action
   */
  static handleAddToCart(
    productId: string,
    quantity: number = 1,
    options?: {
      size?: string;
      ice?: string;
      extras?: string[];
      notes?: string;
    },
    onSuccess?: (productId: string, quantity: number) => void,
    onError?: (error: string) => void,
  ): void {
    try {
      // Validate inputs
      if (!productId || typeof productId !== "string") {
        throw new Error("Product ID is required");
      }

      if (quantity <= 0 || !Number.isInteger(quantity)) {
        throw new Error("Quantity must be a positive integer");
      }

      // Import cart store and product lookup service dynamically to avoid circular dependencies
      Promise.all([
        import("@/store"),
        import("@/services/product/productLookupService")
      ]).then(([{ useCartStore }, { ProductLookupService }]) => {

        // Try to find the actual product details
        const product = ProductLookupService.findProductById(productId);

        let cartItem;
        if (product) {
          // Use actual product data
          cartItem = {
            productUuid: productId, // Use productId as UUID
            name: product.name,
            price: product.price,
            quantity,
            options: options?.extras || [],
            size: options?.size || "Regular",
            ice: options?.ice || "Normal",
            notes: options?.notes || "",
            image: product.image || "/images/default-product.jpg",
          };
        } else {
          // Fallback if product not found
          console.warn(`Product not found for ID: ${productId}, using fallback data`);
          cartItem = {
            productUuid: productId, // Use productId as UUID even for fallback
            name: `Product ${productId}`,
            price: 25000, // Default price
            quantity,
            options: options?.extras || [],
            size: options?.size || "Regular",
            ice: options?.ice || "Normal",
            notes: options?.notes || "",
            image: "/images/default-product.jpg",
          };
        }

        // Get cart store instance and add item
        const cartStore = useCartStore.getState();
        cartStore.addItem(cartItem);

        console.log("Added to cart successfully:", {
          productId,
          productName: cartItem.name,
          quantity,
          options,
        });

        // Log action
        this.logAction({
          type: ACTION_TYPES.ADD_TO_CART,
          payload: { productId, quantity, options },
        });

        // Success callback
        if (onSuccess) {
          onSuccess(productId, quantity);
        } else {
          this.showActionSuccess(
            `${quantity} item berhasil ditambahkan ke keranjang`,
          );
        }
      }).catch((error) => {
        console.error("Error adding to cart:", error);
        const errorMessage = "Gagal menambahkan ke keranjang";

        if (onError) {
          onError(errorMessage);
        } else {
          this.showActionError(errorMessage);
        }
      });

    } catch (error) {
      console.error("Error adding to cart:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Gagal menambahkan ke keranjang";

      if (onError) {
        onError(errorMessage);
      } else {
        this.showActionError(errorMessage);
      }
    }
  }

  /**
   * Handle product click action - navigates to product detail page
   */
  static handleProductClick(
    productId: string,
    navigate?: (path: string) => void,
    quantity: number = 1,
    options?: {
      size?: string;
      ice?: string;
      extras?: string[];
      notes?: string;
    }
  ): void {
    try {
      // Validate product ID
      if (!productId || typeof productId !== "string") {
        throw new Error("Product ID is required");
      }


      // Navigate to product detail page instead of adding to cart
      if (navigate) {
        HomeNavigationService.handleProductClick(productId, navigate);
      } else {
        console.warn("Navigate function not provided for product click");
      }

      // Log the product click action
      this.logAction({
        type: ACTION_TYPES.VIEW_PRODUCT,
        payload: { productId, quantity, options },
      });
    } catch (error) {
      console.error("Error handling product click:", error);
      const errorMessage = error instanceof Error ? error.message : "Gagal membuka detail produk";
      this.showActionError(errorMessage);
    }
  }

  /**
   * Handle view profile action
   */
  static handleViewProfile(
    navigate: (path: string) => void,
    onPreNavigation?: () => void,
  ): void {
    try {
      // Log action
      // this.logAction({
      //   type: "viewProfile",
      //   payload: { timestamp: new Date().toISOString() },
      // });

      // Pre-navigation callback
      if (onPreNavigation) {
        onPreNavigation();
      }

      // Navigate to profile
      HomeNavigationService.handleProfileClick(navigate);
    } catch (error) {
      console.error("Error viewing profile:", error);
      this.showActionError("Gagal membuka profil");
    }
  }

  /**
   * Handle product favorite action
   */
  static async handleToggleFavorite(
    productId: string,
    isFavorite: boolean,
    onSuccess?: (productId: string, newState: boolean) => void,
    onError?: (error: string) => void,
  ): Promise<void> {
    try {
      if (!productId) {
        throw new Error("Product ID is required");
      }

      // TODO: Implement actual favorite toggle logic
      // This would typically involve:
      // 1. Update user favorites in storage/API
      // 2. Update UI state

      const newState = !isFavorite;

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Log action
      this.logAction({
        type: "toggleFavorite",
        payload: { productId, isFavorite: newState },
      });

      // Success callback
      if (onSuccess) {
        onSuccess(productId, newState);
      } else {
        const message = newState
          ? "Produk ditambahkan ke favorit"
          : "Produk dihapus dari favorit";
        this.showActionSuccess(message);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Gagal mengubah favorit";

      if (onError) {
        onError(errorMessage);
      } else {
        this.showActionError(errorMessage);
      }
    }
  }

  /**
   * Handle generic user action
   */
  static handleGenericAction(
    action: UserAction,
    onSuccess?: (action: UserAction) => void,
    onError?: (error: string) => void,
  ): void {
    try {
      // Validate action
      const validation = this.validateAction(action);
      if (!validation.isValid) {
        throw new Error(validation.errors[0] || "Invalid action");
      }

      // Log action
      this.logAction(action);


      // Success callback
      if (onSuccess) {
        onSuccess(action);
      }
    } catch (error) {
      console.error("Error handling action:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Gagal menjalankan aksi";

      if (onError) {
        onError(errorMessage);
      } else {
        this.showActionError(errorMessage);
      }
    }
  }

  /**
   * Get action history
   */
  static getActionHistory(): UserAction[] {
    return [...this.actionHistory];
  }

  /**
   * Get action statistics
   */
  static getActionStatistics(): {
    totalActions: number;
    actionsByType: Record<string, number>;
    recentActions: UserAction[];
  } {
    const actionsByType: Record<string, number> = {};

    for (const action of this.actionHistory) {
      actionsByType[action.type] = (actionsByType[action.type] || 0) + 1;
    }

    return {
      totalActions: this.actionHistory.length,
      actionsByType,
      recentActions: this.actionHistory.slice(-10), // Last 10 actions
    };
  }

  /**
   * Clear action history
   */
  static clearActionHistory(): void {
    this.actionHistory = [];
  }

  /**
   * Validate user action
   */
  static validateAction(action: UserAction): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    try {
      if (!action) {
        errors.push("Action is required");
        return { isValid: false, errors };
      }

      if (!action.type || typeof action.type !== "string") {
        errors.push("Action type is required and must be a string");
      }

      // Validate against known action types
      const validActionTypes = Object.values(ACTION_TYPES);
      if (action.type && !validActionTypes.includes(action.type)) {
        errors.push(`Invalid action type: ${action.type}`);
      }

      // Validate payload if present
      if (action.payload !== undefined && typeof action.payload !== "object") {
        errors.push("Action payload must be an object");
      }
    } catch (error) {
      console.error("Error validating action:", error);
      errors.push("Validation error occurred");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Private utility methods
  private static logAction(action: UserAction): void {
    try {
      const timestampedAction: UserAction = {
        ...action,
        // payload: {
        //   ...action.payload,
        //   timestamp: new Date().toISOString(),
        // },
      };

      this.actionHistory.push(timestampedAction);

      // Keep history size manageable
      if (this.actionHistory.length > this.maxHistorySize) {
        this.actionHistory = this.actionHistory.slice(-this.maxHistorySize);
      }
    } catch (error) {
      console.error("Error logging action:", error);
    }
  }

  static async copyToClipboard(text: string): Promise<void> {
    try {
      if (navigator.clipboard && globalThis.window?.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.left = "-999999px";
        textarea.style.top = "-999999px";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
      }
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      throw new Error("Failed to copy to clipboard");
    }
  }

  private static showActionSuccess(message: string): void {
    // TODO: Implement proper toast/notification system
    

    // For now, use a simple alert (replace with proper UI component)
    if (globalThis.window !== undefined) {
      // Could integrate with a toast library here
      setTimeout(() => {
        alert(`✅ ${message}`);
      }, 100);
    }
  }

  private static showActionError(message: string): void {
    // TODO: Implement proper error notification system
    console.error("Action error:", message);

    // For now, use a simple alert (replace with proper UI component)
    if (globalThis.window !== undefined) {
      setTimeout(() => {
        alert(`❌ ${message}`);
      }, 100);
    }
  }

  /**
   * Cleanup action service resources
   */
  static cleanup(): void {
    // Clear any timeouts or intervals
    // Remove event listeners if any
  }

  /**
   * Configure action service
   */
  static configure(config: {
    maxHistorySize?: number;
    enableLogging?: boolean;
    enableNotifications?: boolean;
  }): void {
    if (config.maxHistorySize !== undefined) {
      this.maxHistorySize = Math.max(10, Math.min(1000, config.maxHistorySize));
    }
  }
}
