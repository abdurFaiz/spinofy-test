// Home constants and configuration

export const HOME_CONFIG = {
  apiDelay: 100,
  cacheTimeout: 5 * 60 * 1000, // 5 minutes
  scrollThreshold: 50, // pixels
  scrollStopDelay: 150, // milliseconds
} as const;

export const NAVIGATION_ROUTES = {
  DETAIL_ITEM: '/DetailItem',
  PROFILE: '/profile',
  CART: '/cart',
  VOUCHER: '/voucher',
  POINTS: '/points',
  CATEGORY: '/category',
} as const;

export const PRODUCT_CATEGORIES = {
  recommendations: { label: 'Rekomendasi', icon: '⭐' },
  kopiSusu: { label: 'Kopi Susu', icon: '☕' },
  americano: { label: 'Americano', icon: '☕' },
  cruasan: { label: 'Cruasan', icon: '🥐' },
  beverages: { label: 'Minuman', icon: '🥤' },
  food: { label: 'Makanan', icon: '🍕' },
  snacks: { label: 'Cemilan', icon: '🍿' },
} as const;

export const DEFAULT_IMAGES = {
  USER_AVATAR: 'https://api.builder.io/api/v1/image/assets/TEMP/default-avatar.jpg',
} as const;

export const HOME_ERRORS = {
  USER_DATA_FETCH_FAILED: 'Gagal memuat data pengguna',
  PRODUCTS_FETCH_FAILED: 'Gagal memuat data produk',
  NETWORK_ERROR: 'Koneksi bermasalah, silakan coba lagi',
  PRODUCT_NOT_FOUND: 'Produk tidak ditemukan',
  INVALID_PRODUCT_ID: 'ID produk tidak valid',
} as const;

export const SCROLL_CONFIG = {
  THRESHOLD: 5,
  DEBOUNCE_DELAY: 150,
  VELOCITY_THRESHOLD: 0.5,
} as const;

export const CACHE_KEYS = {
  USER_DATA: 'home_user_data',
  RECOMMENDATIONS: 'home_recommendations',
  KOPI_SUSU: 'home_kopi_susu',
  AMERICANO: 'home_americano',
  CRUASAN: 'home_cruasan',
  ALL_PRODUCTS: 'home_all_products',
} as const;

export const ACTION_TYPES = {
  REDEEM: 'redeem',
  NAVIGATE: 'navigate',
  ADD_TO_CART: 'addToCart',
  PRODUCT_CLICK: 'productClick',
  VIEW_PROFILE: 'viewProfile',
  TOGGLE_FAVORITE: 'toggleFavorite',
  REMOVE_FROM_CART: 'removeFromCart',
  VIEW_PRODUCT: 'viewProduct',
  SHARE_PRODUCT: 'shareProduct',
  SEARCH: 'search',
  FILTER: 'filter',
} as const;

export const PRODUCT_SORT_OPTIONS = [
  { value: 'name', label: 'Nama A-Z' },
  { value: 'price', label: 'Harga Terendah' },
  { value: 'rating', label: 'Rating Tertinggi' },
  { value: 'popularity', label: 'Terpopuler' },
] as const;

export const DEFAULT_PRODUCT_CONFIG = {
  ITEMS_PER_PAGE: 10,
  MAX_DESCRIPTION_LENGTH: 100,
  MAX_NAME_LENGTH: 50,
  MIN_PRICE: 1000,
  MAX_PRICE: 1000000,
} as const;