// Utility functions for formatting and common operations

export class FormatUtils {
  /**
   * Format currency to Indonesian Rupiah format
   */
  static formatCurrency(amount: number): string {
    return `Rp ${amount.toLocaleString("id-ID")}`;
  }

  /**
   * Format date to Indonesian format
   */
  static formatDate(date: Date | string): string {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  /**
   * Format phone number to Indonesian format
   */
  static formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.startsWith("62")) {
      return `+${cleaned}`;
    }
    if (cleaned.startsWith("0")) {
      return `+62${cleaned.slice(1)}`;
    }
    return `+62${cleaned}`;
  }

  /**
   * Format product name for display
   */
  static formatProductName(name: string): string {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  /**
   * Truncate text with ellipsis
   */
  static truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + "...";
  }

  /**
   * Generate order reference number
   */
  static generateOrderReference(): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `S-${timestamp}${random}`;
  }

  /**
   * Calculate percentage
   */
  static calculatePercentage(value: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  }

  /**
   * Format file size
   */
  static formatFileSize(bytes: number): string {
    const sizes = ["B", "KB", "MB", "GB"];
    if (bytes === 0) return "0 B";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  }
}

export class ValidationUtils {
  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate Indonesian phone number
   */
  static isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  }

  /**
   * Validate required field
   */
  static isRequired(value: unknown): boolean {
    if (typeof value === "string") {
      return value.trim().length > 0;
    }
    return value != null && value !== "";
  }

  /**
   * Validate minimum length
   */
  static hasMinLength(value: string, minLength: number): boolean {
    return value.length >= minLength;
  }

  /**
   * Validate maximum length
   */
  static hasMaxLength(value: string, maxLength: number): boolean {
    return value.length <= maxLength;
  }

  /**
   * Validate numeric value
   */
  static isNumeric(value: string): boolean {
    return !isNaN(Number(value)) && !isNaN(parseFloat(value));
  }

  /**
   * Validate positive number
   */
  static isPositiveNumber(value: number): boolean {
    return value > 0;
  }
}

export class ArrayUtils {
  /**
   * Group array by key
   */
  static groupBy<T>(
    array: T[],
    keyFn: (item: T) => string,
  ): Record<string, T[]> {
    return array.reduce(
      (groups, item) => {
        const key = keyFn(item);
        if (!groups[key]) {
          groups[key] = [];
        }
        groups[key].push(item);
        return groups;
      },
      {} as Record<string, T[]>,
    );
  }

  /**
   * Remove duplicates from array
   */
  static unique<T>(array: T[], keyFn?: (item: T) => string | number): T[] {
    if (!keyFn) {
      return [...new Set(array)];
    }

    const seen = new Set();
    return array.filter((item) => {
      const key = keyFn(item);
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  /**
   * Sort array by key
   */
  static sortBy<T>(
    array: T[],
    keyFn: (item: T) => string | number,
    direction: "asc" | "desc" = "asc",
  ): T[] {
    return [...array].sort((a, b) => {
      const aValue = keyFn(a);
      const bValue = keyFn(b);

      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });
  }

  /**
   * Chunk array into smaller arrays
   */
  static chunk<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}

export class StorageUtils {
  /**
   * Set item in localStorage with error handling
   */
  static setLocalStorage(key: string, value: unknown): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error("Failed to set localStorage:", error);
      return false;
    }
  }

  /**
   * Get item from localStorage with error handling
   */
  static getLocalStorage<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue || null;
      return JSON.parse(item);
    } catch (error) {
      console.error("Failed to get localStorage:", error);
      return defaultValue || null;
    }
  }

  /**
   * Remove item from localStorage
   */
  static removeLocalStorage(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error("Failed to remove localStorage:", error);
      return false;
    }
  }

  /**
   * Clear all localStorage
   */
  static clearLocalStorage(): boolean {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error("Failed to clear localStorage:", error);
      return false;
    }
  }
}

export class DebounceUtils {
  private static timeouts: Map<string, number> = new Map();

  /**
   * Debounce function execution
   */
  static debounce<T extends (...args: unknown[]) => unknown>(
    key: string,
    func: T,
    delay: number,
  ): (...args: Parameters<T>) => void {
    return (...args: Parameters<T>) => {
      const existingTimeout = this.timeouts.get(key);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }

      const timeout = setTimeout(() => {
        func(...args);
        this.timeouts.delete(key);
      }, delay);

      this.timeouts.set(key, timeout);
    };
  }

  /**
   * Clear specific debounce
   */
  static clearDebounce(key: string): void {
    const timeout = this.timeouts.get(key);
    if (timeout) {
      clearTimeout(timeout);
      this.timeouts.delete(key);
    }
  }

  /**
   * Clear all debounces
   */
  static clearAllDebounces(): void {
    this.timeouts.forEach((timeout) => clearTimeout(timeout));
    this.timeouts.clear();
  }
}

export class DateUtils {
  /**
   * Get time ago string
   */
  static getTimeAgo(date: Date | string): string {
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
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)} hari lalu`;

    return targetDate.toLocaleDateString("id-ID");
  }

  /**
   * Add days to date
   */
  static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  /**
   * Check if date is today
   */
  static isToday(date: Date | string): boolean {
    const today = new Date();
    const targetDate = typeof date === "string" ? new Date(date) : date;

    return today.toDateString() === targetDate.toDateString();
  }

  /**
   * Format countdown time
   */
  static formatCountdown(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  }
}
