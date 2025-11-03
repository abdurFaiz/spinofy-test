import OrderCard from "../../components/TransactionCard";
import { BottomNav } from "../../components/MenuBar";
import { ScreenWrapper } from "@/components/layout/ScreenWrapper";
import HeaderBar from "@/components/HeaderBar";
import { FilterChip } from "@/components/FilterChips";
import { useNavigate, useLocation } from "react-router-dom";
import { useTransactions } from "@/hooks/Transactions/useTransactions";
import { useDuplicateOrder } from "@/hooks/Orders/useDuplicateOrder";
import { useEffect } from "react";
import { SkeletonTransactionsPage } from "@/components/skeletons/SkeletonComponents";

export default function Index() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    filteredTransactions,
    activeFilter,
    isLoading,
    error,
    setActiveFilter,
    handleTransactionClick,
    filterOptions,
    emptyStateMessage,
    refreshTransactions,
  } = useTransactions();

  const { duplicateOrder, isDuplicating } = useDuplicateOrder();

  // Handle "Pesan Lagi" button click
  const handleReorder = (orderCode: string) => {
    if (isDuplicating) return;

    
    duplicateOrder({ orderCode });
  };

  // Handle navigation from payment page
  useEffect(() => {
    if (location.state?.orderCompleted) {
      // Refresh transactions to show the newly completed order
      refreshTransactions();

      // Show success notification if points were earned
      if (location.state?.points) {
        const points = location.state.points.point;
        if (points > 0) {
          setTimeout(() => {
            alert(`Pembayaran berhasil! Kamu mendapat ${points} poin`);
          }, 500);
        }
      }

      // Clear navigation state
      globalThis.history.replaceState({}, document.title);
    }
  }, [location.state, refreshTransactions]);

  if (isLoading) {
    return (
      <SkeletonTransactionsPage />
    );
  }

  if (error) {
    return (
      <ScreenWrapper>
        <HeaderBar
          title="Pesanan Saya"
          showSearch
          onSearch={() => navigate("/searchtransaction")}
        />
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-500">Error: {error}</div>
        </div>
        <BottomNav />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <HeaderBar
        title="Pesanan Saya"
        showSearch
        onSearch={() => navigate("/searchtransaction")}
      />
      <div className="px-4 pt-6 pb-4 mb-20">
        <FilterChip
          filters={filterOptions}
          activeFilter={activeFilter}
          onChange={(value) => setActiveFilter(value)}
          className="pb-6"
        />

        <div className="flex flex-col gap-6">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction, index) => (
              <div
                id={`transaction-${index}`}
                key={transaction.id}
                className={transaction.pointsMessage ? "mb-[59px]" : ""}
              >
                <OrderCard
                  {...transaction}
                  orderCode={transaction.code}
                  onAction={() => handleTransactionClick(transaction)}
                  onReorder={handleReorder}
                />
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Tidak Ada Pesanan
              </h3>
              <p className="text-gray-500 text-center">{emptyStateMessage}</p>
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </ScreenWrapper>
  );
}
