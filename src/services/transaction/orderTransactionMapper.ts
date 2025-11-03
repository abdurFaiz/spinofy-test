import type { Order, OrderProduct } from '@/types/Order';
import type { Transaction, TransactionStatus } from '@/types/Transaction';
import { mapBackendStatusToFrontend } from '@/utils/statusMapping';

/**
 * Service to map Order API data to Transaction interface
 */
export class OrderTransactionMapper {
    private static mapOrderStatus(statusCode: number): TransactionStatus {
        // Use the centralized status mapping utility
        const mappedStatus = mapBackendStatusToFrontend(statusCode);
        
        // Return mapped status or fallback to pending
        return mappedStatus || 'pending';
    }

    /**
     * Format order products into a readable string
     */
    private static formatOrderItems(orderProducts: OrderProduct[]): string {
        return orderProducts
            .map(product => `${product.quantity}x ${product.product.name}`)
            .join(', ');
    }

    /**
     * Calculate total items from order products
     */
    private static calculateTotalItems(orderProducts: OrderProduct[]): number {
        return orderProducts.reduce((total, product) => total + product.quantity, 0);
    }

    /**
     * Get first product image or default
     */
    private static getProductImage(orderProducts: OrderProduct[]): string {
        const firstProduct = orderProducts[0];
        if (!firstProduct?.product?.image) {
            return '/images/default-product.jpg';
        }

        // Get base URL from environment and construct full image URL
        const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000';
        const imagePath = firstProduct.product.image;

        // If image already has full URL, return it
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
            return imagePath;
        }

        // Otherwise, prepend storage path
        return `${baseUrl}/storage/${imagePath}`;
    }

    /**
     * Format price to currency string
     */
    private static formatPrice(price: number): string {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    }

    /**
     * Get points message if order is completed and has points
     */
    private static getPointsMessage(order: Order): string | undefined {
        // Only show points for completed orders (status: 4 = COMPLETED)
        if (order.status !== 4) {
            return undefined;
        }

        // Check if customer_point exists and has points
        // Type 0 = credit (earned points), Type 1 = debit (spent points)
        const customerPoint = order.customer_point;

        if (customerPoint?.type === 0 && customerPoint.point > 0) {
            return `Yeay! Kamu dapat ${customerPoint.point} poin dari transaksi ini`;
        }

        return undefined;
    }

    /**
     * Map single Order to Transaction
     */
    static mapOrderToTransaction(order: Order, outletName: string = 'Outlet'): Transaction {
        return {
            id: order.id,
            code: order.code,
            status: this.mapOrderStatus(order.status),
            date: new Date(order.created_at).toLocaleDateString('id-ID', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            }),
            created_at: order.created_at,
            cafeName: outletName,
            items: this.formatOrderItems(order.order_products),
            totalItems: this.calculateTotalItems(order.order_products),
            totalPrice: this.formatPrice(order.total),
            imageUrl: this.getProductImage(order.order_products),
            pointsMessage: this.getPointsMessage(order),
        };
    }

    /**
     * Map array of Orders to Transactions
     */
    static mapOrdersToTransactions(orders: Order[], outletName: string = 'Outlet'): Transaction[] {
        return orders.map(order => this.mapOrderToTransaction(order, outletName));
    }
}