import { OutletAPI } from '@/api/outlet.api';
import { PaymentAPI } from '@/api/payment.api';
import { ProductAPI } from '@/api/product.api';
import type { StoreOrderPayload } from '@/types/Order';
import type { CartItem } from '@/types/Cart';
import { CartMigrationService } from '@/services/cart/cartMigrationService';

export interface CheckoutServiceOptions {
    cartItems: CartItem[];
    notes?: string;
}

export interface OrderCreationResult {
    success: boolean;
    orderId?: number;
    orderCode?: string;
    error?: string;
}

/**
 * Checkout Service
 * Handles order creation with outlet slug and product attribute values
 */
export class CheckoutService {
    /**
     * Validate and filter cart items, removing legacy items
     */
    private static validateCartItems(cartItems: CartItem[]): CartItem[] {
        // Filter out legacy items (missing productUuid)
        const validItems = CartMigrationService.filterLegacyItems(cartItems);

        const legacyCount = CartMigrationService.getLegacyItemsCount(cartItems);
        if (legacyCount > 0) {
            console.warn(`Filtered out ${legacyCount} legacy cart items that are missing productUuid`);
        }

        return validItems;
    }

    /**
     * Get outlet slug for order creation
     */
    private static async getOutletSlug(): Promise<string> {
        const outletsResponse = await OutletAPI.getListOutlets();
        const firstOutlet = outletsResponse?.data?.outlets?.[0];

        if (!firstOutlet?.slug) {
            throw new Error('No outlet available');
        }

        return firstOutlet.slug;
    }

    /**
     * Process single cart item and create order
     */
    private static async processSingleCartItem(
        cartItem: CartItem,
        outletSlug: string,
        notes: string
    ): Promise<OrderCreationResult> {
        try {
            // Get product details to find attribute value IDs using productUuid
            const productDetails = await ProductAPI.getProduct(outletSlug, cartItem.productUuid);
            const product = productDetails?.data?.product;

            if (!product) {
                console.warn(`Product not found for UUID: ${cartItem.productUuid}`);
                return {
                    success: false,
                    error: `Product not found for ${cartItem.name}`,
                };
            }

            // Extract attribute value IDs based on selected options
            const attributeValueIds = this.extractAttributeValueIds(product, cartItem);

            // Create order payload for this item
            const orderPayload: StoreOrderPayload = {
                product_id: product.id,
                variant_id: attributeValueIds,
                quantity: cartItem.quantity,
                note: cartItem.notes || notes,
            };

            // Store order to API
            const orderResponse = await PaymentAPI.storeProduct(outletSlug, orderPayload);

            return this.handleOrderResponse(orderResponse, cartItem);
        } catch (itemError) {
            console.error(`Failed to create order for item ${cartItem.name}:`, itemError);
            return {
                success: false,
                error: `Failed to create order for ${cartItem.name}`,
            };
        }
    }

    /**
     * Handle order API response
     * Supports multiple response formats:
     * 1. POST /payment/product: { status, data: { data: { id, code, ... } } }
     * 2. GET /payment: { status, data: { order: [{ id, code, ... }] } }
     */
    private static handleOrderResponse(orderResponse: any, cartItem: CartItem): OrderCreationResult {
        if (orderResponse.status !== 'success') {
            return {
                success: false,
                error: `Failed to create order for ${cartItem.name}: ${orderResponse.message || 'Unknown error'}`,
            };
        }

        // Try different response structures
        // Format 1: POST /payment/product response - response.data.data
        let orderData = orderResponse.data?.data;

        // Format 2: GET /payment response - response.data.order[0]
        if (!orderData && Array.isArray(orderResponse.data?.order)) {
            orderData = orderResponse.data.order[0];
        }

        if (!orderData?.id || !orderData?.code) {
            return {
                success: false,
                error: `Order created for ${cartItem.name} but missing order details`,
            };
        }

        return {
            success: true,
            orderId: orderData.id,
            orderCode: orderData.code.toString(),
        };
    }

    /**
     * Create order from cart items
     */
    static async createOrder(options: CheckoutServiceOptions): Promise<OrderCreationResult> {
        try {
            const { cartItems, notes = "" } = options;

            if (!cartItems || cartItems.length === 0) {
                throw new Error('Cart is empty');
            }

            // Validate and filter cart items, removing any legacy items
            const validCartItems = this.validateCartItems(cartItems);

            if (validCartItems.length === 0) {
                throw new Error('No valid items in cart. Please re-add items to your cart.');
            }

            if (validCartItems.length < cartItems.length) {
                console.warn(`${cartItems.length - validCartItems.length} legacy items were filtered out`);
            }

            // Get outlet slug
            const outletSlug = await this.getOutletSlug();

            // Process each cart item and create orders
            const orderResults: OrderCreationResult[] = [];

            for (const cartItem of validCartItems) {
                const result = await this.processSingleCartItem(cartItem, outletSlug, notes);
                orderResults.push(result);
            }

            // Check if any orders were successful
            const successfulOrders = orderResults.filter(result => result.success);

            if (successfulOrders.length === 0) {
                throw new Error('Failed to create any orders');
            }

            // Return the first successful order info
            return successfulOrders[0];

        } catch (error) {
            console.error('Error creating order:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to create order',
            };
        }
    }

    /**
     * Extract attribute value IDs from product and cart item selections
     */
    private static extractAttributeValueIds(product: any, cartItem: CartItem): number[] {
        const attributeValueIds: number[] = [];

        try {
            // Get attribute values from product
            const attributeValues = product.attribute?.values || [];

            // Map cart item selections to attribute value IDs
            const selections = [
                cartItem.ice,
                cartItem.size,
                ...(cartItem.options || [])
            ].filter(Boolean);

            for (const selection of selections) {
                const matchingValue = attributeValues.find((value: any) =>
                    value.name.toLowerCase() === selection?.toLowerCase()
                );

                if (matchingValue) {
                    attributeValueIds.push(matchingValue.id);
                }
            }

            // If no specific selections found, use the first available attribute value as default
            if (attributeValueIds.length === 0 && attributeValues.length > 0) {
                attributeValueIds.push(attributeValues[0].id);
            }

        } catch (error) {
            console.error('Error extracting attribute value IDs:', error);
            // Return empty array if extraction fails
        }

        return attributeValueIds;
    }

    /**
     * Validate cart before checkout
     */
    static validateCart(cartItems: CartItem[]): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (!cartItems || cartItems.length === 0) {
            errors.push('Cart is empty');
        }

        for (const item of cartItems) {
            if (!item.id) {
                errors.push(`Invalid product ID for item: ${item.name}`);
            }
            if (!item.productUuid) {
                errors.push(`Missing product UUID for item: ${item.name}`);
            }
            if (!item.quantity || item.quantity <= 0) {
                errors.push(`Invalid quantity for item: ${item.name}`);
            }
            if (!item.price || item.price <= 0) {
                errors.push(`Invalid price for item: ${item.name}`);
            }
        }

        return {
            isValid: errors.length === 0,
            errors,
        };
    }

    /**
     * Calculate order totals
     */
    static calculateOrderTotals(cartItems: CartItem[]) {
        const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
        const tax = Math.round(subtotal * 0.1); // 10% tax
        const total = subtotal + tax;

        return {
            subtotal,
            tax,
            total,
            itemCount: cartItems.reduce((count, item) => count + item.quantity, 0),
        };
    }
}

export default CheckoutService;