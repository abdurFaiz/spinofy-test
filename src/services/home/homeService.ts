// import { UserDataService } from './userDataService';
import { HomeUIService } from './homeUIService';
import { HomeNavigationService } from './homeNavigationService';
import { HomeActionService } from './homeActionService';
import type {  UserAction } from '@/types/Home';

/**
 * Main Home Service - Facade/Orchestrator
 * Provides a unified interface to all home-related services
 */
export class HomeService {
    // UI Methods
    static calculateCartVisibility(totalItems: number, isScrollingDown: boolean, isScrollingStopped: boolean): boolean {
        return HomeUIService.calculateCartVisibility(totalItems, isScrollingDown, isScrollingStopped);
    }

    // Navigation Methods
    static handleProfileClick(navigate: (path: string) => void): void {
        return HomeNavigationService.handleProfileClick(navigate);
    }

    static handleCategoryClick(category: string, navigate: (path: string) => void): void {
        return HomeNavigationService.handleCategoryClick(category, navigate);
    }

    static handleAddToCart(
        productId: string,
        quantity: number = 1,
        options?: {
            size?: string;
            ice?: string;
            extras?: string[];
            notes?: string;
        },
        onSuccess?: (productId: string, quantity: number) => void,
        onError?: (error: string) => void,
    ): void {
        return HomeActionService.handleAddToCart(productId, quantity, options, onSuccess, onError);
    }

    static handleProductClick(
        productId: string,
        navigate?: (path: string) => void,
        quantity: number = 1,
        options?: {
            size?: string;
            ice?: string;
            extras?: string[];
            notes?: string;
        }
    ): void {
        return HomeActionService.handleProductClick(productId, navigate, quantity, options);
    }

    static handleViewProfile(navigate: (path: string) => void, onPreNavigation?: () => void): void {
        return HomeActionService.handleViewProfile(navigate, onPreNavigation);
    }

    static async handleToggleFavorite(
        productId: string,
        isFavorite: boolean,
        onSuccess?: (productId: string, newState: boolean) => void,
        onError?: (error: string) => void,
    ): Promise<void> {
        return HomeActionService.handleToggleFavorite(productId, isFavorite, onSuccess, onError);
    }

    static validateAction(action: UserAction): { isValid: boolean; errors: string[] } {
        return HomeActionService.validateAction(action);
    }

    static getActionHistory(): UserAction[] {
        return HomeActionService.getActionHistory();
    }

    static clearActionHistory(): void {
        return HomeActionService.clearActionHistory();
    }

    // Utility Methods
    static async copyToClipboard(text: string): Promise<void> {
        return HomeActionService.copyToClipboard(text);
    }

    // Mock method for products - this would be replaced with actual API calls
    static async getAllProductsFromAPI(_outletSlug: string): Promise<{ success: boolean; data: any; message?: string }> {
        // This is a placeholder - the actual implementation should use the outlet-based product service

        // Return empty data structure for now
        return {
            success: true,
            data: {
                recommendations: [],
                kopiSusu: [],
                americano: [],
                cruasan: [],
            },
            message: 'Products loaded successfully'
        };
    }
}

export default HomeService;