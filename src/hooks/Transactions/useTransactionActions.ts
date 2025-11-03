import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useOutletSlug } from "@/hooks/useOutletSlug";
import type {
  Transaction,
  TransactionStatus,
} from "@/types/Transaction";

export interface UseTransactionActionsReturn {
  handleTransactionClick: (transaction: Transaction) => void;
  navigateToTransaction: (
    transactionCode: string,
    status: TransactionStatus,
  ) => void;
}

export const useTransactionActions = (): UseTransactionActionsReturn => {
  const navigate = useNavigate();
  const outletSlug = useOutletSlug();

  const handleTransactionClick = useCallback(
    (transaction: Transaction) => {
      if (outletSlug) {
        navigate(`/${outletSlug}/DetailTransaction?code=${transaction.code}&status=${transaction.status}`);
      } else {
        navigate('/onboard');
      }
    },
    [navigate, outletSlug],
  );

  const navigateToTransaction = useCallback(
    (transactionCode: string, status: TransactionStatus) => {
      if (outletSlug) {
        navigate(`/${outletSlug}/DetailTransaction?code=${transactionCode}&status=${status}`);
      } else {
        navigate('/onboard');
      }
    },
    [navigate, outletSlug],
  );

  return {
    handleTransactionClick,
    navigateToTransaction,
  };
};

export default useTransactionActions;
