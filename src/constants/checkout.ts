import type { CheckoutConfig } from '@/types/Checkout';

export const CHECKOUT_CONFIG: CheckoutConfig = {
  taxRate: 0.1, // 10%
  currency: 'Rp',
  locale: 'id-ID',
} as const;

export const NAVIGATION_ROUTES = {
  HOME: '/home',
  PAYMENT: '/payment',
  VOUCHER: '/vouchercheckout',
  ORDER_TRACKING: '/order-tracking',
} as const;

export const CHECKOUT_ERRORS = {
  EMPTY_CART: 'Keranjang kosong',
  INVALID_ITEM_NAME: (index: number) => `Item ${index + 1}: Nama produk tidak valid`,
  INVALID_ITEM_PRICE: (index: number) => `Item ${index + 1}: Harga tidak valid`,
  INVALID_ITEM_QUANTITY: (index: number) => `Item ${index + 1}: Jumlah tidak valid`,
  VOUCHER_NOT_AVAILABLE: 'Voucher tidak tersedia',
  VOUCHER_INACTIVE: 'Voucher sudah tidak aktif',
  MIN_TRANSACTION_NOT_MET: (amount: number) => `Minimum transaksi ${CHECKOUT_CONFIG.currency} ${amount.toLocaleString(CHECKOUT_CONFIG.locale)} diperlukan`,
} as const;

export const PAYMENT_DETAIL_IDS = {
  SUBTOTAL: '1',
  TAX: '2',
  DISCOUNT: '3',
  TOTAL: '4',
} as const;

export const PAYMENT_DETAIL_LABELS = {
  SUBTOTAL: 'Harga',
  TAX: 'Pajak',
  DISCOUNT: 'Voucher Diskon',
  TOTAL: 'Total Pembayaran',
} as const;

export const DEFAULT_ITEM_CONFIG = {
  SIZE: 'Regular',
  ICE: 'Normal',
  MIN_QUANTITY: 1,
} as const;

export const API_CONFIG = {
  DELAY_MS: 100,
  CACHE_DURATION_MS: 5 * 60 * 1000, // 5 minutes
} as const;
