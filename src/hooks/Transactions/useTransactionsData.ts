import { useState, useEffect, useCallback } from "react";
import TransactionService from "@/services/transaction/transactionService";
import type { Transaction } from "@/types/Transaction";

export interface UseTransactionsDataReturn {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  refreshTransactions: () => Promise<void>;
}

export const useTransactionsData = (): UseTransactionsDataReturn => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTransactions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const transactionsData = await TransactionService.getAllTransactions();
      setTransactions(transactionsData.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load transactions",
      );
      console.error("Error loading transactions:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const refreshTransactions = useCallback(async () => {
    await loadTransactions();
  }, [loadTransactions]);

  return {
    transactions,
    isLoading,
    error,
    refreshTransactions,
  };
};

export default useTransactionsData;