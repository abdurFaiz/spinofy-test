import HeaderBar from "@/components/HeaderBar";
import { ScreenWrapper } from "@/components/layout/ScreenWrapper";
import VoucherCard from "@/components/VoucherCard";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useOutletNavigation } from "@/hooks/useOutletNavigation";

type TabType = "active" | "expired";

export default function HistoryVouchers() {
    const { navigateToVouchers } = useOutletNavigation();
    const [activeTab, setActiveTab] = useState<TabType>("active");
    const usedVouchers = [
        {
            id: 1,
            title: "New User Voucher - Diskon 50% Hingga Rp 40K",
            subtitle: "Tanpa Min.Belanja",
            expiryDate: "30 Oct 2025",
            minTransaction: "-",
            status: "active" as const,
        },
    ];

    const expiredVouchers = [
        {
            id: 2,
            title: "Voucher Promo Spesial - Diskon 30%",
            subtitle: "Min. Belanja Rp 100K",
            expiryDate: "15 Jan 2025",
            minTransaction: "Rp 100.000",
            status: "expired" as const,
        },
    ];
    return (
        <ScreenWrapper>
            <HeaderBar title="Riwayat Voucher" showBack onBack={navigateToVouchers} />
            <div className="flex items-center mt-6">
                <button
                    onClick={() => setActiveTab("active")}
                    className={cn(
                        "flex-1 py-4 text-base font-medium capitalize transition-all",
                        "border-b-2",
                        activeTab === "active"
                            ? "border-primary-orange text-primary-orange"
                            : "border-transparent text-gray hover:text-body-grey/80"
                    )}
                >
                    Dipakai
                </button>
                <button
                    onClick={() => setActiveTab("expired")}
                    className={cn(
                        "flex-1 py-4 text-base font-medium capitalize transition-all",
                        "border-b-2",
                        activeTab === "expired"
                            ? "border-primary-orange text-primary-orange"
                            : "border-transparent text-body-grey hover:text-body-grey/80"
                    )}
                >
                    Kadaluarsa
                </button>
            </div>
            <div className="space-y-4 mt-6">
                {activeTab === "active" && usedVouchers.length > 0 ? (
                    usedVouchers.map((voucher) => (
                        <VoucherCard
                            key={voucher.id}
                            title={voucher.title}
                            subtitle={voucher.subtitle}
                            expiryDate={voucher.expiryDate}
                            minTransaction={voucher.minTransaction}
                            status={voucher.status}
                        />
                    ))
                ) : activeTab === "expired" && expiredVouchers.length > 0 ? (
                    expiredVouchers.map((voucher) => (
                        <VoucherCard
                            key={voucher.id}
                            title={voucher.title}
                            subtitle={voucher.subtitle}
                            expiryDate={voucher.expiryDate}
                            minTransaction={voucher.minTransaction}
                            status={voucher.status}
                        />
                    ))
                ) : (
                    <div className="text-center py-12">
                        <p className="text-voucher-gray text-sm">
                            {activeTab === "active"
                                ? "Belum ada voucher yang dipakai"
                                : "Belum ada voucher yang kadaluarsa"}
                        </p>
                    </div>
                )}
            </div>
        </ScreenWrapper>
    )
}