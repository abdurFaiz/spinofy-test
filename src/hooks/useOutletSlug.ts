import { useParams } from "react-router-dom";

/**
 * Hook to get the outlet slug from the URL parameters
 * @returns The outlet slug from the current route
 */
export const useOutletSlug = () => {
    const { outletSlug } = useParams<{ outletSlug: string }>();
    return outletSlug;
};