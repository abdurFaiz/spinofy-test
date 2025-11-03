import HeaderBar from "@/components/HeaderBar";
import { ScreenWrapper } from "@/components/layout/ScreenWrapper";
import { PointsSummary } from "./Components/PoinSummary";
import { VoucherListSection } from "@/components/VoucherListSection";
import { useOutletNavigation } from "@/hooks/useOutletNavigation";
import { useQuery } from "@tanstack/react-query";
import { RewardAPI } from "@/api/reward.api";
import type { Voucher } from "@/types/Reward";
import { SkeltonReward } from "@/components/skeletons";

export default function RewardPoin() {
    const { navigateToHome, navigateToHistoryPoin, outletSlug } = useOutletNavigation();

    // Fetch reward data from API
    const { data: rewardData, isLoading, error } = useQuery({
        queryKey: ['reward-points', outletSlug],
        queryFn: async () => {
            if (!outletSlug) throw new Error('No outlet available');
            return RewardAPI.getListRewardPoint(outletSlug);
        },
        enabled: !!outletSlug,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Transform vouchers from API to match VoucherListSection props
    const transformVouchers = (vouchers: Voucher[]) => {
        return vouchers.map(voucher => ({
            title: voucher.name,
            subtitle: voucher.description,
            expiryDate: new Date(voucher.valid_until).toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }),
            minTransaction: voucher.discount_type === 'percentage'
                ? `Min. ${voucher.discount_amount}%`
                : `Rp ${voucher.discount_amount.toLocaleString('id-ID')}`,
            status: voucher.status === 'active' ? 'active' as const : 'cancelled' as const,
        }));
    };

    const pointBalance = rewardData?.data?.point_balance || 0;
    const vouchers = rewardData?.data?.vouchers ? transformVouchers(rewardData.data.vouchers) : [];

    // Skeleton Loading Component
    

    // Loading state
    if (isLoading) {
        return (
            <ScreenWrapper>
                <HeaderBar title="Reward Poin" showBack={true} showHistory={true} onHistory={navigateToHistoryPoin} onBack={navigateToHome} />
                <SkeltonReward />
            </ScreenWrapper>
        );
    }

    // Error state
    if (error) {
        return (
            <ScreenWrapper>
                <HeaderBar title="Reward Poin" showBack={true} showHistory={true} onHistory={navigateToHistoryPoin} onBack={navigateToHome} />
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="text-lg text-red-500 mb-2">Gagal memuat data</div>
                        <div className="text-sm text-gray-500">Silakan coba lagi nanti</div>
                    </div>
                </div>
            </ScreenWrapper>
        );
    }
    // Empty Vouchers Component
    const EmptyVouchersState = () => (
        <div className="mx-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Tukarkan Dengan Vouchers</h2>
                <span className="text-sm text-gray-500">0 voucher</span>
            </div>
            
            <div className="p-8 rounded-3xl bg-white border border-gray-100 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Belum Ada Voucher
                </h3>
                <p className="text-gray-500 text-sm">
                    Kamu belum memiliki voucher yang dapat ditukarkan. 
                    Kumpulkan lebih banyak poin untuk mendapatkan voucher menarik!
                </p>
            </div>
        </div>
    );

    return (
        <ScreenWrapper>
            <HeaderBar title="Reward Poin" showBack={true} showHistory={true} onHistory={navigateToHistoryPoin} onBack={navigateToHome} />
            <div className="flex flex-col gap-8">
                <PointsSummary points={pointBalance} />
                
                {vouchers.length > 0 ? (
                    <VoucherListSection
                        title="Tukarkan Dengan Vouchers"
                        totalItems={vouchers.length}
                        vouchers={vouchers}
                    />
                ) : (
                    <EmptyVouchersState />
                )}
            </div>
        </ScreenWrapper>
    )
}