import { useState, useMemo } from "react";
import TransactionService from "@/services/transaction/transactionService";
import type { Transaction, TransactionStatus } from "@/types/Transaction";

export interface UseTransactionFilterReturn {
  activeFilter: TransactionStatus | "semua";
  filteredTransactions: Transaction[];
  filterOptions: Array<{ value: TransactionStatus | "semua"; label: string }>;
  emptyStateMessage: string;
  setActiveFilter: (filter: TransactionStatus | "semua") => void;
}

export const useTransactionFilter = (
  transactions: Transaction[],
): UseTransactionFilterReturn => {
  const [activeFilter, setActiveFilter] = useState<TransactionStatus | "semua">(
    "semua",
  );

  // Memoized filtered transactions to prevent unnecessary recalculations
  const filteredTransactions = useMemo(() => {
    if (activeFilter === "semua") {
      return transactions;
    }
    return transactions.filter(
      (transaction) => transaction.status === activeFilter,
    );
  }, [transactions, activeFilter]);

  // Memoized filter options (static data)
  const filterOptions = useMemo(() => TransactionService.getFilterOptions(), []);

  // Memoized empty state message
  const emptyStateMessage = useMemo(
    () => TransactionService.getEmptyStateMessage(activeFilter),
    [activeFilter],
  );

  return {
    activeFilter,
    filteredTransactions,
    filterOptions,
    emptyStateMessage,
    setActiveFilter,
  };
};

export default useTransactionFilter;
