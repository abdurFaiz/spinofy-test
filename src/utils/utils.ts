import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Get the full URL for a product image
 * @param imagePath - The image path from the backend (e.g., "products/z4X1jkBQMcARU8uVbmrCtIYuQ8WAnQoF0ZqzXIjq.jpg")
 * @returns Full URL for the image or fallback URL if no image path provided
 */
export function getImageUrl(imagePath?: string | null): string {
    // If no image path provided, return fallback
    if (!imagePath) {
        return "/images/empty-product.svg"; // Local fallback image
    }

    // If image already has full URL, return it
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }

    // Get base URL from environment and construct full image URL
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000';

    // Remove leading slash if present and prepend storage path
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    return `${baseUrl}/storage/${cleanPath}`;
}
