// Main Home Service (Facade/Orchestrator)
export { HomeService as default } from './homeService';
export { HomeService } from './homeService';

// Individual Services
// export { UserDataService } from './userDataService';
// export { ProductDataService } from './productDataService';
export { HomeUIService } from './homeUIService';
export { HomeNavigationService } from './homeNavigationService';
export { HomeActionService } from './homeActionService';


// Re-export constants
export {
  HOME_CONFIG,
  NAVIGATION_ROUTES,
  PRODUCT_CATEGORIES,
  DEFAULT_IMAGES,
  HOME_ERRORS,
  SCROLL_CONFIG,
  ACTION_TYPES,
  PRODUCT_SORT_OPTIONS,
  DEFAULT_PRODUCT_CONFIG,
} from '@/constants/home';


// Re-export types for convenience
export type {
  HomeUserData,
  HomeProduct,
  UserAction,
  ApiResponse,
  ProductCategory,
  ProductCollection,
  HomeData,
  CartVisibilityState,
  ScrollState,
  NavigationState,
  UIState,
  HomeConfig,
  ActionType,
} from '@/types/Home';

// Re-export ProductCollection from ProductDataService
// export type { ProductCollection as ProductDataCollection } from './productDataService';
