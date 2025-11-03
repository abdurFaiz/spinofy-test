import type { CartVisibilityState, ScrollState } from "@/types/Home";
import { SCROLL_CONFIG } from "@/constants/home";

export class HomeUIService {
  private static scrollState: ScrollState = {
    isScrolling: false,
    direction: "none",
    lastScrollTop: 0,
    scrollStoppedTimeout: undefined,
  };

  /**
   * Calculate cart visibility based on scroll state and item count
   */
  static calculateCartVisibility(
    totalItems: number,
    isScrollingDown: boolean,
    isScrollingStopped: boolean,
  ): boolean {
    // Show cart if there are items and not scrolling down (or if scrolling stopped)
    return totalItems > 0 && (!isScrollingDown || isScrollingStopped);
  }

  /**
   * Handle scroll events with debouncing
   */
  static handleScroll(
    currentScrollTop: number,
    onScrollStateChange?: (state: ScrollState) => void,
  ): ScrollState {
    const scrollThreshold = SCROLL_CONFIG.THRESHOLD;
    const previousScrollTop = this.scrollState.lastScrollTop;
    const scrollDifference = currentScrollTop - previousScrollTop;

    // Determine scroll direction
    let direction: "up" | "down" | "none" = "none";
    if (Math.abs(scrollDifference) > scrollThreshold) {
      direction = scrollDifference > 0 ? "down" : "up";
    }

    // Update scroll state
    this.scrollState = {
      ...this.scrollState,
      isScrolling: Math.abs(scrollDifference) > 1,
      direction,
      lastScrollTop: currentScrollTop,
    };

    // Clear existing timeout
    if (this.scrollState.scrollStoppedTimeout) {
      clearTimeout(this.scrollState.scrollStoppedTimeout);
    }

    // Set new timeout for scroll stop detection
    this.scrollState.scrollStoppedTimeout = setTimeout(() => {
      this.scrollState = {
        ...this.scrollState,
        isScrolling: false,
        direction: "none",
      };

      if (onScrollStateChange) {
        onScrollStateChange(this.scrollState);
      }
    }, SCROLL_CONFIG.DEBOUNCE_DELAY);

    // Trigger callback if provided
    if (onScrollStateChange) {
      onScrollStateChange(this.scrollState);
    }

    return this.scrollState;
  }

  /**
   * Get current scroll state
   */
  static getScrollState(): ScrollState {
    return { ...this.scrollState };
  }

  /**
   * Reset scroll state
   */
  static resetScrollState(): void {
    if (this.scrollState.scrollStoppedTimeout) {
      clearTimeout(this.scrollState.scrollStoppedTimeout);
    }

    this.scrollState = {
      isScrolling: false,
      direction: "none",
      lastScrollTop: 0,
      scrollStoppedTimeout: undefined,
    };
  }

  /**
   * Calculate cart visibility state with full context
   */
  static calculateCartVisibilityState(
    totalItems: number,
    currentScrollTop: number,
  ): CartVisibilityState {
    const scrollState = this.handleScroll(currentScrollTop);
    const shouldShow = this.calculateCartVisibility(
      totalItems,
      scrollState.direction === "down",
      !scrollState.isScrolling,
    );

    return {
      totalItems,
      isScrollingDown: scrollState.direction === "down",
      isScrollingStopped: !scrollState.isScrolling,
      shouldShow,
    };
  }

  /**
   * Format user level display
   */
  static formatUserLevel(points: number): {
    currentLevel: string;
    nextLevel: string;
    progress: number;
    pointsToNext: number;
  } {
    // Define level thresholds
    const levels = [
      { name: "Bronze", minPoints: 0, color: "#CD7F32" },
      { name: "Silver", minPoints: 100, color: "#C0C0C0" },
      { name: "Gold", minPoints: 500, color: "#FFD700" },
      { name: "Platinum", minPoints: 1000, color: "#E5E4E2" },
    ];

    let currentLevel = levels[0];
    let nextLevel = levels[1];

    for (let i = 0; i < levels.length; i++) {
      if (points >= levels[i].minPoints) {
        currentLevel = levels[i];
        nextLevel = levels[i + 1] || levels[i]; // Stay at highest level
      } else {
        break;
      }
    }

    const pointsToNext =
      currentLevel === nextLevel ? 0 : nextLevel.minPoints - points;
    const progress =
      currentLevel === nextLevel
        ? 100
        : Math.min(
          100,
          ((points - currentLevel.minPoints) /
            (nextLevel.minPoints - currentLevel.minPoints)) *
          100,
        );

    return {
      currentLevel: currentLevel.name,
      nextLevel: nextLevel.name,
      progress: Math.round(progress),
      pointsToNext,
    };
  }

  /**
   * Format price for display
   */
  static formatPrice(price: string | number): string {
    if (typeof price === "number") {
      return `Rp ${price.toLocaleString("id-ID")}`;
    }

    // If already formatted, return as is
    if (typeof price === "string" && price.startsWith("Rp")) {
      return price;
    }

    // Try to extract number from string and format
    const numericValue = this.extractNumericPrice(price);
    return `Rp ${numericValue.toLocaleString("id-ID")}`;
  }

  /**
   * Extract numeric value from price string
   */
  static extractNumericPrice(priceString: string): number {
    const regex = /[\d.,]+/;
    const match = regex.exec(priceString);
    if (!match) return 0;

    // Remove dots and convert to number
    return Number.parseInt(match[0].replaceAll(/[.,]/g, ""), 10);
  }

  /**
   * Format product rating display
   */
  static formatRating(rating?: number): {
    stars: string;
    numeric: string;
    displayClass: string;
  } {
    if (!rating || rating === 0) {
      return {
        stars: "☆☆☆☆☆",
        numeric: "0.0",
        displayClass: "text-gray-400",
      };
    }

    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    const stars =
      "★".repeat(fullStars) + (hasHalfStar ? "☆" : "") + "☆".repeat(emptyStars);

    let displayClass = "text-yellow-500";
    if (rating < 3) displayClass = "text-red-500";
    else if (rating < 4) displayClass = "text-orange-500";

    return {
      stars,
      numeric: rating.toFixed(1),
      displayClass,
    };
  }

  /**
   * Calculate grid layout for products
   */
  static calculateGridLayout(
    containerWidth: number,
    itemMinWidth: number = 150,
    gap: number = 16,
  ): {
    columns: number;
    itemWidth: number;
    totalWidth: number;
  } {
    const availableWidth = containerWidth - gap;
    let columns = Math.floor(availableWidth / (itemMinWidth + gap));
    columns = Math.max(1, Math.min(columns, 4)); // Between 1 and 4 columns

    const totalGaps = (columns - 1) * gap;
    const itemWidth = (availableWidth - totalGaps) / columns;
    const totalWidth = itemWidth * columns + totalGaps;

    return {
      columns,
      itemWidth: Math.floor(itemWidth),
      totalWidth: Math.floor(totalWidth),
    };
  }

  /**
   * Generate loading skeleton configuration
   */
  static generateSkeletonConfig(type: "product" | "user" | "list"): {
    rows: Array<{ width: string; height: string; className?: string }>;
  } {
    switch (type) {
      case "product":
        return {
          rows: [
            { width: "100%", height: "120px", className: "rounded-lg" }, // Image
            { width: "80%", height: "16px", className: "mt-2" }, // Name
            { width: "60%", height: "14px", className: "mt-1" }, // Price
            { width: "90%", height: "12px", className: "mt-2" }, // Description
          ],
        };

      case "user":
        return {
          rows: [
            { width: "48px", height: "48px", className: "rounded-full" }, // Avatar
            { width: "120px", height: "16px", className: "mt-2" }, // Name
            { width: "80px", height: "14px", className: "mt-1" }, // Points
          ],
        };

      case "list":
        return {
          rows: Array.from({ length: 3 }, () => ({
            width: "100%",
            height: "16px",
            className: "mt-2",
          })),
        };

      default:
        return { rows: [] };
    }
  }

  /**
   * Calculate content visibility based on scroll position
   */
  static calculateContentVisibility(
    elementTop: number,
    elementHeight: number,
    viewportTop: number,
    viewportHeight: number,
    threshold: number = 0.1,
  ): {
    isVisible: boolean;
    visibilityRatio: number;
    isFullyVisible: boolean;
  } {
    const elementBottom = elementTop + elementHeight;
    const viewportBottom = viewportTop + viewportHeight;

    // Calculate intersection
    const intersectionTop = Math.max(elementTop, viewportTop);
    const intersectionBottom = Math.min(elementBottom, viewportBottom);
    const intersectionHeight = Math.max(
      0,
      intersectionBottom - intersectionTop,
    );

    const visibilityRatio = intersectionHeight / elementHeight;
    const isVisible = visibilityRatio > threshold;
    const isFullyVisible = visibilityRatio >= 0.99;

    return {
      isVisible,
      visibilityRatio,
      isFullyVisible,
    };
  }

  /**
   * Generate responsive breakpoint classes
   */
  static generateResponsiveClasses(
    baseClass: string,
    breakpoints: Record<string, string>,
  ): string {
    const classes = [baseClass];

    for (const [breakpoint, className] of Object.entries(breakpoints)) {
      classes.push(`${breakpoint}:${className}`);
    }

    return classes.join(" ");
  }

  /**
   * Calculate animation delay for staggered animations
   */
  static calculateStaggerDelay(index: number, baseDelay: number = 100): number {
    return index * baseDelay;
  }

  /**
   * Format time ago display
   */
  static formatTimeAgo(date: string | Date): string {
    const now = new Date();
    const targetDate = typeof date === "string" ? new Date(date) : date;
    const diffInSeconds = Math.floor(
      (now.getTime() - targetDate.getTime()) / 1000,
    );

    if (diffInSeconds < 60) return "Baru saja";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} menit lalu`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} jam lalu`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)} hari lalu`;
    if (diffInSeconds < 31536000)
      return `${Math.floor(diffInSeconds / 2592000)} bulan lalu`;

    return `${Math.floor(diffInSeconds / 31536000)} tahun lalu`;
  }

  /**
   * Cleanup resources and event listeners
   */
  static cleanup(): void {
    if (this.scrollState.scrollStoppedTimeout) {
      clearTimeout(this.scrollState.scrollStoppedTimeout);
    }
    this.resetScrollState();
  }

  /**
   * Validate UI component props
   */
  static validateComponentProps(
    props: Record<string, unknown>,
    required: string[],
  ): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    for (const prop of required) {
      if (
        !(prop in props) ||
        props[prop] === undefined ||
        props[prop] === null
      ) {
        errors.push(`Required prop '${prop}' is missing`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Generate accessibility attributes
   */
  static generateA11yAttributes(
    type: "button" | "link" | "image" | "input",
    props: {
      label?: string;
      description?: string;
      role?: string;
      state?: "expanded" | "collapsed" | "selected" | "checked";
    },
  ): Record<string, string> {
    const attributes: Record<string, string> = {};

    if (props.label) {
      attributes["aria-label"] = props.label;
    }

    if (props.description) {
      attributes["aria-description"] = props.description;
    }

    if (props.role) {
      attributes["role"] = props.role;
    }

    if (props.state) {
      switch (props.state) {
        case "expanded":
        case "collapsed":
          attributes["aria-expanded"] = (props.state === "expanded").toString();
          break;
        case "selected":
          attributes["aria-selected"] = "true";
          break;
        case "checked":
          attributes["aria-checked"] = "true";
          break;
      }
    }

    // Add default attributes based on type
    switch (type) {
      case "button":
        if (!attributes["role"]) attributes["role"] = "button";
        attributes["tabindex"] = "0";
        break;
      case "link":
        if (!attributes["role"]) attributes["role"] = "link";
        break;
      case "image":
        if (!attributes["role"]) attributes["role"] = "img";
        break;
      case "input":
        attributes["tabindex"] = "0";
        break;
    }

    return attributes;
  }
}
