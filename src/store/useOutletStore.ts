import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Outlet } from '@/types/Outlet';

interface OutletStore {
    currentOutlet: Outlet | null;
    outletSlug: string | null;
    setCurrentOutlet: (outlet: Outlet) => void;
    clearCurrentOutlet: () => void;
    isOutletSelected: () => boolean;
}

/**
 * Outlet store for managing user's selected outlet across the app
 */
export const useOutletStore = create<OutletStore>()(
    persist(
        (set, get) => ({
            currentOutlet: null,
            outletSlug: null,

            setCurrentOutlet: (outlet: Outlet) => {
                set({
                    currentOutlet: outlet,
                    outletSlug: outlet.slug,
                });
            },

            clearCurrentOutlet: () => {
                set({
                    currentOutlet: null,
                    outletSlug: null,
                });
            },

            isOutletSelected: () => {
                return get().currentOutlet !== null;
            },
        }),
        {
            name: 'outlet-storage',
            partialize: (state) => ({
                currentOutlet: state.currentOutlet,
                outletSlug: state.outletSlug,
            }),
        }
    )
);

export default useOutletStore;