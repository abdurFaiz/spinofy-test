import { NAVIGATION_ROUTES } from '../../constants/transaction';

export class TransactionActionService {
  static handleTransactionAction(
    actionLabel: string,
    navigate: (path: string) => void,
    additionalParams?: Record<string, string>
  ): void {
    try {
      switch (actionLabel) {
        case "Bayar Sekarang":
          this.handlePaymentAction(navigate, additionalParams);
          break;
        case "Pesan Lagi":
        case "Buat Pesanan Baru":
          this.handleOrderAgainAction(navigate);
          break;
        case "Struk Digital":
          this.handleDigitalReceiptAction(additionalParams);
          break;
        case "Lacak Pesanan":
          this.handleTrackOrderAction(navigate, additionalParams);
          break;
        default:
          console.warn(`Unknown action: ${actionLabel}`);
          break;
      }
    } catch (error) {
      console.error('Error handling transaction action:', error);
    }
  }

  private static handlePaymentAction(navigate: (path: string) => void, params?: Record<string, string>): void {
    const paymentUrl = params?.transactionId
      ? `${NAVIGATION_ROUTES.PAYMENT}?transactionId=${params.transactionId}`
      : NAVIGATION_ROUTES.PAYMENT;

    navigate(paymentUrl);
  }

  private static handleOrderAgainAction(navigate: (path: string) => void): void {
    navigate(NAVIGATION_ROUTES.HOME);
  }

  private static handleDigitalReceiptAction(params?: Record<string, string>): void {
    if (params?.transactionId) {
      // TODO: Implement digital receipt functionality
      console.log(`Show digital receipt for transaction: ${params.transactionId}`);

      // For now, trigger download or show modal
      this.downloadDigitalReceipt(params.transactionId);
    } else {
      console.log("Show digital receipt");
    }
  }

  private static handleTrackOrderAction(navigate: (path: string) => void, params?: Record<string, string>): void {
    if (params?.transactionId) {
      const trackingUrl = `/order-tracking?transactionId=${params.transactionId}`;
      navigate(trackingUrl);
    } else {
      // Fallback to generic tracking page
      navigate('/order-tracking');
    }
  }


  private static downloadDigitalReceipt(transactionId: string | number): void {
    // TODO: Implement actual receipt download
    console.log(`Downloading receipt for transaction: ${transactionId}`);

    // Placeholder for receipt generation
    const receiptData = {
      transactionId,
      timestamp: new Date().toISOString(),
      // Add more receipt data as needed
    };

    // For now, just log the receipt data
    console.log('Receipt data:', receiptData);
  }


  static buildDetailUrl(transactionCode: string, status: string): string {
    return `${NAVIGATION_ROUTES.DETAIL_TRANSACTION}?code=${transactionCode}&status=${status}`;
  }

  static getActionVariant(actionLabel: string): "outline" | "primary" {
    const primaryActions = [
      "Bayar Sekarang",
      "Lacak Pesanan",
      "Pesan Lagi",
      "Buat Pesanan Baru"
    ];

    return primaryActions.includes(actionLabel) ? "primary" : "outline";
  }

  static isDestructiveAction(actionLabel: string): boolean {
    const destructiveActions = ["Batalkan Pesanan"];
    return destructiveActions.includes(actionLabel);
  }

  static validateActionPermissions(actionLabel: string, transactionStatus: string): boolean {
    const actionPermissions: Record<string, string[]> = {
      "Batalkan Pesanan": ["menunggu-konfirmasi"],
      "Cek Pembayaran": ["dalam-proses", "menunggu-konfirmasi"],
      "Struk Digital": ["selesai"],
      "Pesan Lagi": ["selesai", "dibatalkan", "ditolak", "dalam-proses"]
    };

    const allowedStatuses = actionPermissions[actionLabel];
    return !allowedStatuses || allowedStatuses.includes(transactionStatus);
  }
}
