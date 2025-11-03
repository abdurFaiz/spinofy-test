import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "@/routes/routes";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useCartMigration } from "@/hooks/useCartMigration";
import { Toaster } from "@/components/ui/sonner";

export default function AppRoutes() {
  // Handle cart migration on app startup
  useCartMigration();

  return (
    <>
      <Suspense fallback={<LoadingSpinner />}>
        <RouterProvider router={router} />
      </Suspense>
      <Toaster richColors position="top-center" />
    </>
  );
}
