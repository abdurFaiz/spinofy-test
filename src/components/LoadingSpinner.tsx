import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingSpinner() {
    return (
        <div className="flex h-screen items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
    )
}

// Alternative skeleton-based loading component
export function SkeletonLoader() {
    return (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
            <Skeleton className="w-16 h-16 rounded-full" />
            <Skeleton className="w-32 h-4" />
        </div>
    );
}