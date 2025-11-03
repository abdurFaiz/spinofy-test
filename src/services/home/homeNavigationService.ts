import { NAVIGATION_ROUTES } from "@/constants/home";

export class HomeNavigationService {
  /**
   * Handle product click navigation
   */
  static handleProductClick(
    productId: string,
    navigate: (path: string) => void,
    outletSlug?: string,
  ): void {
    try {
      if (!productId || typeof productId !== "string") {
        console.error("Invalid product ID for navigation");
        return;
      }

      if (outletSlug) {
        const url = `/${outletSlug}/DetailItem?id=${encodeURIComponent(productId)}`;
        navigate(url);
      } else {
        navigate('/onboard');
      }
    } catch (error) {
      console.error("Error navigating to product detail:", error);
      this.handleNavigationError("product detail", error, navigate);
    }
  }

  /**
   * Handle category navigation
   */
  static handleCategoryClick(
    category: string,
    navigate: (path: string) => void,
    additionalParams?: Record<string, string | number>,
  ): void {
    try {
      if (!category) {
        console.error("Category is required for navigation");
        return;
      }

      let url = `${NAVIGATION_ROUTES.CATEGORY}?category=${encodeURIComponent(category)}`;

      if (additionalParams) {
        const queryParams = this.buildQueryParams(additionalParams);
        if (queryParams) {
          url += `&${queryParams}`;
        }
      }

      navigate(url);
    } catch (error) {
      console.error("Error navigating to category:", error);
      this.handleNavigationError("category", error, navigate);
    }
  }

  /**
   * Handle user profile navigation
   */
  static handleProfileClick(navigate: (path: string) => void): void {
    try {
      navigate(NAVIGATION_ROUTES.PROFILE);
    } catch (error) {
      console.error("Error navigating to profile:", error);
      this.handleNavigationError("profile", error, navigate);
    }
  }

  /**
   * Handle voucher navigation
   */
  static handleVoucherClick(navigate: (path: string) => void): void {
    try {
      navigate(NAVIGATION_ROUTES.VOUCHER);
    } catch (error) {
      console.error("Error navigating to voucher:", error);
      this.handleNavigationError("voucher", error, navigate);
    }
  }

  /**
   * Handle points/rewards navigation
   */
  static handlePointsClick(navigate: (path: string) => void): void {
    try {
      navigate(NAVIGATION_ROUTES.POINTS);
    } catch (error) {
      console.error("Error navigating to points:", error);
      this.handleNavigationError("points", error, navigate);
    }
  }

  /**
   * Handle cart navigation
   */
  static handleCartClick(navigate: (path: string) => void): void {
    try {
      navigate(NAVIGATION_ROUTES.CART);
    } catch (error) {
      console.error("Error navigating to cart:", error);
      this.handleNavigationError("cart", error, navigate);
    }
  }

  /**
   * Navigate to search results
   */
  static navigateToSearch(
    searchTerm: string,
    navigate: (path: string) => void,
    filters?: {
      category?: string;
      priceRange?: { min: number; max: number };
      sortBy?: string;
    },
  ): void {
    try {
      if (!searchTerm || searchTerm.trim() === "") {
        console.warn("Empty search term provided");
        return;
      }

      let url = `/search?q=${encodeURIComponent(searchTerm.trim())}`;

      if (filters) {
        const filterParams = this.buildQueryParams(filters);
        if (filterParams) {
          url += `&${filterParams}`;
        }
      }

      navigate(url);
    } catch (error) {
      console.error("Error navigating to search:", error);
      this.handleNavigationError("search", error, navigate);
    }
  }

  /**
   * Navigate back to previous page
   */
  static navigateBack(
    navigate: (path: string) => void,
    fallbackPath: string = "/home",
  ): void {
    try {
      if (typeof window !== "undefined" && window.history.length > 1) {
        window.history.back();
      } else {
        navigate(fallbackPath);
      }
    } catch (error) {
      console.error("Error navigating back:", error);
      navigate(fallbackPath);
    }
  }

  /**
   * Handle deep link navigation
   */
  static handleDeepLink(
    url: string,
    navigate: (path: string) => void,
  ): boolean {
    try {
      const urlObj = new URL(url, window.location.origin);
      const pathname = urlObj.pathname;
      const searchParams = urlObj.searchParams;

      // Handle different deep link patterns
      if (pathname.startsWith("/product/")) {
        const productId = pathname.split("/product/")[1];
        if (productId) {
          this.handleProductClick(productId, navigate);
          return true;
        }
      }

      if (pathname.startsWith("/category/")) {
        const category = pathname.split("/category/")[1];
        if (category) {
          const additionalParams: Record<string, string> = {};
          searchParams.forEach((value, key) => {
            additionalParams[key] = value;
          });
          this.handleCategoryClick(category, navigate, additionalParams);
          return true;
        }
      }

      if (pathname === "/search") {
        const query = searchParams.get("q");
        if (query) {
          const filters = {
            category: searchParams.get("category") || undefined,
            sortBy: searchParams.get("sortBy") || undefined,
          };
          this.navigateToSearch(query, navigate, filters);
          return true;
        }
      }

      // Default navigation for unhandled deep links
      navigate(url);
      return true;
    } catch (error) {
      console.error("Error handling deep link:", error);
      return false;
    }
  }

  /**
   * Build URL with parameters
   */
  static buildUrl(
    basePath: string,
    params?: Record<string, string | number>,
    query?: Record<string, string | number>,
  ): string {
    try {
      let url = basePath;

      // Replace path parameters
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          url = url.replace(`:${key}`, encodeURIComponent(String(value)));
        });
      }

      // Add query parameters
      if (query) {
        const queryString = this.buildQueryParams(query);
        if (queryString) {
          url += `?${queryString}`;
        }
      }

      return url;
    } catch (error) {
      console.error("Error building URL:", error);
      return basePath;
    }
  }

  /**
   * Check if navigation is safe (prevent infinite loops)
   */
  static isSafeNavigation(
    currentPath: string,
    targetPath: string,
    maxNavigationDepth: number = 20,
  ): boolean {
    try {
      // Prevent same-page navigation
      if (currentPath === targetPath) {
        console.warn("Preventing same-page navigation");
        return false;
      }

      // Check navigation history depth
      if (
        typeof window !== "undefined" &&
        window.history.length > maxNavigationDepth
      ) {
        console.warn("Maximum navigation depth reached");
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error checking navigation safety:", error);
      return true; // Allow navigation by default
    }
  }

  /**
   * Get navigation breadcrumbs
   */
  static getBreadcrumbs(currentPath: string): Array<{
    label: string;
    path: string;
    isActive: boolean;
  }> {
    const breadcrumbs = [{ label: "Home", path: "/home", isActive: false }];

    try {
      const pathSegments = currentPath.split("/").filter((segment) => segment);

      pathSegments.forEach((segment, index) => {
        const path = "/" + pathSegments.slice(0, index + 1).join("/");
        const isActive = index === pathSegments.length - 1;

        let label = segment.charAt(0).toUpperCase() + segment.slice(1);

        // Customize labels for known paths
        switch (segment) {
          case "detailitem":
            label = "Product Detail";
            break;
          case "category":
            label = "Category";
            break;
          case "search":
            label = "Search Results";
            break;
          case "profile":
            label = "Profile";
            break;
          case "cart":
            label = "Cart";
            break;
          case "voucher":
            label = "Vouchers";
            break;
          case "points":
            label = "Points & Rewards";
            break;
        }

        breadcrumbs.push({
          label,
          path,
          isActive,
        });
      });

      // Mark the last breadcrumb as active
      if (breadcrumbs.length > 1) {
        breadcrumbs[0].isActive = false;
        breadcrumbs[breadcrumbs.length - 1].isActive = true;
      }
    } catch (error) {
      console.error("Error generating breadcrumbs:", error);
    }

    return breadcrumbs;
  }

  /**
   * Handle external link navigation
   */
  static handleExternalLink(url: string): void {
    try {
      if (typeof window !== "undefined") {
        window.open(url, "_blank", "noopener,noreferrer");
      }
    } catch (error) {
      console.error("Error opening external link:", error);
    }
  }


  // Private utility methods
  private static buildQueryParams(params: Record<string, string | number | object | undefined | null>): string {
    try {
      const validParams = Object.entries(params)
        .filter(
          ([, value]) => value !== undefined && value !== null && value !== "",
        )
        .map(([key, value]) => {
          if (typeof value === "object") {
            return `${encodeURIComponent(key)}=${encodeURIComponent(JSON.stringify(value))}`;
          }
          return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
        });

      return validParams.join("&");
    } catch (error) {
      console.error("Error building query params:", error);
      return "";
    }
  }

  private static handleNavigationError(
    destination: string,
    error: unknown,
    navigate: (path: string) => void,
  ): void {
    console.error(`Failed to navigate to ${destination}:`, error);

    // Fallback navigation to onboard for outlet selection
    try {
      navigate("/onboard");
    } catch (fallbackError) {
      console.error("Fallback navigation also failed:", fallbackError);
    }
  }

  /**
   * Cleanup navigation resources
   */
  static cleanup(): void {
    // Clean up any navigation-related resources
    // This could include removing event listeners, clearing timeouts, etc.
  }

  /**
   * Get current route information
   */
  static getCurrentRoute(): {
    path: string;
    query: Record<string, string>;
    hash: string;
  } {
    try {
      if (typeof window === "undefined") {
        return { path: "/", query: {}, hash: "" };
      }

      const url = new URL(window.location.href);
      const query: Record<string, string> = {};

      url.searchParams.forEach((value, key) => {
        query[key] = value;
      });

      return {
        path: url.pathname,
        query,
        hash: url.hash,
      };
    } catch (error) {
      console.error("Error getting current route:", error);
      return { path: "/", query: {}, hash: "" };
    }
  }
}
