import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AppRoutes from "@/routes/AppRoutes";
import { QueryProvider } from "@/providers/QueryProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import "@/index.css";
import { setupServiceWorkerUpdater } from "@/utils/serviceWorkerUpdater";

// Setup Service Worker auto-update
if ('serviceWorker' in navigator) {
  // Development mode utilities
  if (import.meta.env.DEV) {
    // Utility untuk manual clear di console
    import("@/utils/clearServiceWorker").then(({ clearServiceWorker }) => {
      (globalThis as any).clearSW = clearServiceWorker;
    });
  }

  setupServiceWorkerUpdater({
    autoUpdate: import.meta.env.DEV, // Auto update di dev, manual di production
    clearCacheOnUpdate: false, // Set true jika ingin clear cache saat update
    onUpdateFound: () => {
      console.log('🔄 Checking for updates...');
    },
    onUpdateReady: () => {
      if (!import.meta.env.DEV) {
        // Di production, tampilkan notifikasi ke user
        console.log('✅ New version available! Refresh to update.');
        // Bisa tambahkan toast notification di sini jika ada
      }
    },
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </QueryProvider>
  </StrictMode>,
);