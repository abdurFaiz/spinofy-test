import { FilterChip } from "@/components/FilterChips";
import HeaderBar from "@/components/HeaderBar";
import { ScreenWrapper } from "@/components/layout/ScreenWrapper";
import { useState } from "react";
import { PointHistoryItem, type PointHistory as BasePointHistory } from "./Components/PointHistoryItem";
import { useOutletNavigation } from "@/hooks/useOutletNavigation";
import { useQuery } from "@tanstack/react-query";
import { RewardAPI } from "@/api/reward.api";
import type { CustomerPoint } from "@/types/Reward";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { useOutletStore } from "@/store/useOutletStore";

interface PointHistory extends BasePointHistory {
    orderId?: number;
}

type FilterTab = "semua" | "poin didapat" | "poin ditukar";

export default function HistoryRewardPoin() {
    const [activeFilter, setActiveFilter] = useState<FilterTab>("semua");
    const { navigateToRewardPoin, outletSlug } = useOutletNavigation();
    const navigate = useNavigate();
    const { currentOutlet } = useOutletStore();

    const filters: { value: FilterTab; label: string }[] = [
        { value: "semua", label: "Semua" },
        { value: "poin didapat", label: "Poin Didapat" },
        { value: "poin ditukar", label: "Poin Ditukar" },
    ];

    // Fetch reward history from API
    const { data: rewardHistoryData, isLoading, error } = useQuery({
        queryKey: ['reward-history', outletSlug],
        queryFn: async () => {
            if (!outletSlug) throw new Error('No outlet available');
            return RewardAPI.getHistoryRewardPoint(outletSlug);
        },
        enabled: !!outletSlug,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Transform CustomerPoint data to PointHistory format
    const transformCustomerPoints = (customerPoints: CustomerPoint[]): PointHistory[] => {
        const outletName = currentOutlet?.name || 'Outlet';
        return customerPoints.map(point => ({
            id: point.id,
            category: point.type === 1 ? "Poin Didapat" : "Poin Ditukar",
            title: point.info || (point.type === 1 ? `Pembelian item di ${outletName}` : "Penukaran voucher"),
            date: new Date(point.created_at).toLocaleDateString('id-ID', {
                weekday: 'long',
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            amount: point.type === 1 ? point.point : -point.point,
            orderId: point.pointable_type === 'App\\Models\\Order' ? point.pointable_id : undefined,
        }));
    };

    const historyData = rewardHistoryData?.data?.customer_points
        ? transformCustomerPoints(rewardHistoryData.data.customer_points)
        : [];

    const filteredHistory = historyData.filter(item => {
        if (activeFilter === 'semua') return true;
        if (activeFilter === 'poin didapat') return item.amount > 0;
        if (activeFilter === 'poin ditukar') return item.amount < 0;
        return false;
    });

    // Handle click on point history item
    const handleHistoryItemClick = (item: PointHistory) => {
        // If item has orderId and is from an order, navigate to transaction detail
        if (item.orderId && item.category === "Poin Didapat") {
            if (outletSlug) {
                navigate(`/${outletSlug}/DetailTransaction/${item.orderId}`);
            }
        }
    };

    // Skeleton Loading Component
    const SkeletonLoader = () => (
        <div className="flex flex-col gap-4 px-4">
            {[1, 2, 3, 4, 5].map((index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg">
                    <div className="flex-1">
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-5 w-48 mb-1" />
                        <Skeleton className="h-3 w-40" />
                    </div>
                    <div className="text-right">
                        <Skeleton className="h-5 w-16" />
                    </div>
                </div>
            ))}
        </div>
    );

    // Empty State Component
    const EmptyState = () => (
        <div className="flex flex-col items-center justify-center py-16 px-8">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <svg
                    className="w-10 h-10 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
                Belum Ada Riwayat Poin
            </h3>
            <p className="text-gray-500 text-center text-sm">
                {activeFilter === 'semua'
                    ? 'Kamu belum memiliki riwayat poin. Mulai bertransaksi untuk mendapatkan poin!'
                    : `Belum ada riwayat untuk kategori "${filters.find(f => f.value === activeFilter)?.label}"`
                }
            </p>
        </div>
    );

    // Loading state
    if (isLoading) {
        return (
            <ScreenWrapper>
                <HeaderBar title="History Poin" showBack={true} onBack={navigateToRewardPoin} />
                <FilterChip
                    filters={filters}
                    activeFilter={activeFilter}
                    onChange={(value) => setActiveFilter(value)}
                    className="py-6"
                />
                <SkeletonLoader />
            </ScreenWrapper>
        );
    }

    // Error state
    if (error) {
        return (
            <ScreenWrapper>
                <HeaderBar title="History Poin" showBack={true} onBack={navigateToRewardPoin} />
                <FilterChip
                    filters={filters}
                    activeFilter={activeFilter}
                    onChange={(value) => setActiveFilter(value)}
                    className="py-6"
                />
                <div className="flex items-center justify-center py-16">
                    <div className="text-center">
                        <div className="text-lg text-red-500 mb-2">Gagal memuat riwayat</div>
                        <div className="text-sm text-gray-500">Silakan coba lagi nanti</div>
                    </div>
                </div>
            </ScreenWrapper>
        );
    }
    return (
        <ScreenWrapper>
            <HeaderBar title="History Poin" showBack={true} onBack={navigateToRewardPoin} />
            <FilterChip
                filters={filters}
                activeFilter={activeFilter}
                onChange={(value) => setActiveFilter(value)}
                className="p-6"
            />

            {filteredHistory.length > 0 ? (
                <div className="flex flex-col">
                    {filteredHistory.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => handleHistoryItemClick(item)}
                            className={item.orderId ? "cursor-pointer hover:bg-gray-50" : ""}
                        >
                            <PointHistoryItem
                                category={item.category}
                                title={item.title}
                                date={item.date}
                                amount={item.amount}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyState />
            )}
        </ScreenWrapper>
    )
}