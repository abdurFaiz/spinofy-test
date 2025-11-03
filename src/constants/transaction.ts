import type { FilterOption, TransactionAction } from "@/types/Transaction";

export const TRANSACTION_CONFIG = {
  PAYMENT_TIMEOUT_MINUTES: 15,
  API_DELAY_MS: 100,
  DEFAULT_TABLE_PREFIX: "Table D",
  TRANSACTION_ID_PREFIX: "S-2018",
  CACHE_DURATION_MS: 5 * 60 * 1000, // 5 minutes
  DEFAULT_POINTS: 24,
} as const;

export const FILTER_OPTIONS: FilterOption[] = [
  { value: "semua", label: "Semua" },
  { value: "pending", label: "Pending" },
  { value: "menunggu-konfirmasi", label: "Menunggu Konfirmasi" },
  { value: "dalam-proses", label: "Pesanan Sedang Disiapkan" },
  { value: "selesai", label: "Selesai" },
  { value: "gagal", label: "Gagal" },
  { value: "expired", label: "Kedaluwarsa" },
  { value: "challenge", label: "Challenge" },
  { value: "dibatalkan", label: "Dibatalkan" },
  { value: "ditolak", label: "Ditolak" },
];

export const STATUS_ACTIONS: Record<string, TransactionAction[]> = {
  pending: [
    { label: "Batalkan Pesanan", variant: "outline", size: "xl" },
    { label: "Lanjutkan Pembayaran", variant: "primary", size: "xl" },
  ],
  "menunggu-konfirmasi": [
    { label: "Batalkan Pesanan", variant: "outline", size: "xl" },
    { label: "Cek Status Pembayaran", variant: "primary", size: "xl" },
  ],
  "dalam-proses": [
    { label: "Struk Digital", variant: "outline", size: "xl" },
    { label: "Pesan Lagi", variant: "primary", size: "xl" },
  ],
  selesai: [
    { label: "Struk Digital", variant: "outline", size: "xl" },
    { label: "Pesan Lagi", variant: "primary", size: "xl" },
  ],
  gagal: [
    { label: "Struk Digital", variant: "outline", size: "xl" },
    { label: "Pesan Lagi", variant: "primary", size: "xl" },
  ],
  expired: [
    { label: "Struk Digital", variant: "outline", size: "xl" },
    { label: "Pesan Lagi", variant: "primary", size: "xl" },
  ],
  challenge: [
    { label: "Hubungi Support", variant: "outline", size: "xl" },
    { label: "Pesan Lagi", variant: "primary", size: "xl" },
  ],
  dibatalkan: [
    { label: "Struk Digital", variant: "outline", size: "xl" },
    { label: "Pesan Lagi", variant: "primary", size: "xl" },
  ],
  ditolak: [
    { label: "Struk Digital", variant: "outline", size: "xl" },
    { label: "Pesan Lagi", variant: "primary", size: "xl" },
  ],
  default: [
    { label: "Struk Digital", variant: "outline", size: "xl" },
    { label: "Pesan Lagi", variant: "primary", size: "xl" },
  ],
};

export const STATUS_TITLES: Record<string, string> = {
  pending: "Pending",
  "menunggu-konfirmasi": "Menunggu Konfirmasi",
  "dalam-proses": "Pesanan Sedang Disiapkan",
  selesai: "Pesanan Selesai",
  gagal: "Pesanan Gagal",
  expired: "Pesanan Kedaluwarsa",
  challenge: "Pesanan Bermasalah",
  dibatalkan: "Pesanan Dibatalkan",
  ditolak: "Pesanan Ditolak",
  default: "Pesanan Berhasil",
};

export const EMPTY_STATE_MESSAGES = {
  DEFAULT: "Belum ada pesanan yang dibuat",
  FILTERED: (filterLabel: string) =>
    `Belum ada pesanan dengan status "${filterLabel}"`,
} as const;

export const NAVIGATION_ROUTES = {
  PAYMENT: "/payment",
  HOME: "/home",
  DETAIL_TRANSACTION: "/DetailTransaction",
} as const;
