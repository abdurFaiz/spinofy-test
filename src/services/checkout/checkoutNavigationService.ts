import type { NavigationAction } from '@/types/Checkout';
import { NAVIGATION_ROUTES } from '@/constants/checkout';

export class CheckoutNavigationService {
  /**
   * Handle checkout navigation actions
   */
  static handleCheckoutNavigation(
    action: NavigationAction,
    navigate: (path: string) => void,
    params?: Record<string, string>
  ): void {
    try {
      switch (action) {
        case "home":
          this.navigateToHome(navigate);
          break;
        case "payment":
          this.navigateToPayment(navigate, params);
          break;
        case "voucher":
          this.navigateToVoucher(navigate, params);
          break;
        default:
          console.warn(`Unknown navigation action: ${action}`);
          break;
      }
    } catch (error) {
      console.error('Error handling checkout navigation:', error);
    }
  }

  /**
   * Navigate to home page
   */
  private static navigateToHome(navigate: (path: string) => void): void {
    navigate(NAVIGATION_ROUTES.HOME);
  }

  /**
   * Navigate to payment page
   */
  private static navigateToPayment(
    navigate: (path: string) => void,
    params?: Record<string, string>
  ): void {
    let paymentUrl = NAVIGATION_ROUTES.PAYMENT;

    if (params) {
      const queryParams = this.buildQueryParams(params);
      if (queryParams) {
        paymentUrl += `?${queryParams}`;
      }
    }

    navigate(paymentUrl);
  }

  /**
   * Navigate to voucher selection page
   */
  private static navigateToVoucher(
    navigate: (path: string) => void,
    params?: Record<string, string>
  ): void {
    let voucherUrl = NAVIGATION_ROUTES.VOUCHER;

    if (params) {
      const queryParams = this.buildQueryParams(params);
      if (queryParams) {
        voucherUrl += `?${queryParams}`;
      }
    }

    navigate(voucherUrl);
  }

  /**
   * Navigate to order tracking page
   */
  static navigateToOrderTracking(
    navigate: (path: string) => void,
    orderId?: string
  ): void {
    try {
      let trackingUrl = NAVIGATION_ROUTES.ORDER_TRACKING;

      if (orderId) {
        trackingUrl += `?orderId=${encodeURIComponent(orderId)}`;
      }

      navigate(trackingUrl);
    } catch (error) {
      // Fallback to basic tracking page
      navigate(NAVIGATION_ROUTES.ORDER_TRACKING);
    }
  }

  /**
   * Navigate back to previous page
   */
  static navigateBack(
    navigate: (path: string) => void,
    fallbackPath: string = NAVIGATION_ROUTES.HOME
  ): void {
    try {
      // Try to go back in history
      if (window.history.length > 1) {
        window.history.back();
      } else {
        // Fallback to specified path
        navigate(fallbackPath);
      }
    } catch (error) {
      console.error('Error navigating back:', error);
      navigate(fallbackPath);
    }
  }

  /**
   * Build URL with checkout data
   */
  static buildCheckoutUrl(
    baseUrl: string,
    checkoutData?: Record<string, string>
  ): string {
    try {
      if (!checkoutData || Object.keys(checkoutData).length === 0) {
        return baseUrl;
      }

      const queryParams = this.buildQueryParams(checkoutData);
      return queryParams ? `${baseUrl}?${queryParams}` : baseUrl;
    } catch (error) {
      console.error('Error building checkout URL:', error);
      return baseUrl;
    }
  }

  /**
   * Navigate with checkout context
   */
  static navigateWithCheckoutContext(
    navigate: (path: string) => void,
    path: string,
    checkoutData: Record<string, string>
  ): void {
    try {
      const url = this.buildCheckoutUrl(path, checkoutData);
      navigate(url);
    } catch (error) {
      console.error('Error navigating with checkout context:', error);
      // Fallback to basic navigation
      navigate(path);
    }
  }

  /**
   * Handle post-checkout navigation (after successful checkout)
   */
  static handlePostCheckoutNavigation(
    navigate: (path: string) => void,
    orderId: string,
    action: 'track' | 'home' | 'continue_shopping' = 'track'
  ): void {
    try {
      switch (action) {
        case 'track':
          this.navigateToOrderTracking(navigate, orderId);
          break;
        case 'home':
          this.navigateToHome(navigate);
          break;
        case 'continue_shopping':
          this.navigateToHome(navigate);
          break;
        default:
          this.navigateToOrderTracking(navigate, orderId);
          break;
      }
    } catch (error) {
      console.error('Error handling post-checkout navigation:', error);
      // Fallback to home
      this.navigateToHome(navigate);
    }
  }

  /**
   * Validate navigation action
   */
  static isValidNavigationAction(action: string): action is NavigationAction {
    return ['home', 'payment', 'voucher'].includes(action);
  }

  /**
   * Get navigation breadcrumbs for checkout flow
   */
  static getCheckoutBreadcrumbs(currentStep: 'cart' | 'voucher' | 'payment' | 'confirmation'): Array<{
    label: string;
    path: string;
    active: boolean;
  }> {
    const breadcrumbs = [
      { label: 'Keranjang', path: '/checkout', active: false },
      { label: 'Voucher', path: '/vouchercheckout', active: false },
      { label: 'Pembayaran', path: '/payment', active: false },
      { label: 'Konfirmasi', path: '/confirmation', active: false },
    ];

    const stepIndex = {
      'cart': 0,
      'voucher': 1,
      'payment': 2,
      'confirmation': 3,
    }[currentStep];

    if (stepIndex !== undefined) {
      breadcrumbs[stepIndex].active = true;
    }

    return breadcrumbs;
  }



  /**
   * Build query parameters string
   */
   private static buildQueryParams(params: Record<string, string>): string {
       try {
         const validParams = Object.entries(params)
           .filter(([, value]) => value !== undefined && value !== null && value !== '')
           .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);

         return validParams.join('&');
       } catch (error) {
         console.error('Error building query params:', error);
         return '';
       }
     }

  /**
   * Check if navigation is safe (prevent navigation loops)
   */
  static isSafeNavigation(
    currentPath: string,
    targetPath: string,
    maxNavigationDepth: number = 10
  ): boolean {
    try {
      // Prevent same-page navigation
      if (currentPath === targetPath) {
        return false;
      }

      // Check navigation history depth (prevent infinite loops)
      if (window.history.length > maxNavigationDepth) {
        console.warn('Maximum navigation depth reached, blocking navigation');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error checking navigation safety:', error);
      return true; // Allow navigation by default
    }
  }

  /**
   * Pre-navigation cleanup
   */
  static performPreNavigationCleanup(): void {
    try {
    } catch (error) {
      console.error('Error during pre-navigation cleanup:', error);
    }
  }
}
