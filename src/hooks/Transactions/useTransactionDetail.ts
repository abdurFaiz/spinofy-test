import { useQuery } from '@tanstack/react-query';
import TransactionService from '@/services/transaction/transactionService';
import type { Transaction } from '@/types/Transaction';

export interface UseTransactionDetailReturn {
    transaction: Transaction | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export const useTransactionDetail = (transactionId: string): UseTransactionDetailReturn => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['transaction-detail', transactionId],
        queryFn: async () => {
            
            const response = await TransactionService.getTransactionById(transactionId);
            
            return response;
        },
        enabled: !!transactionId,
        staleTime: 30 * 1000, // 30 seconds
        retry: 2,
    });

   

    const handleRefetch = async () => {
        await refetch();
    };

    return {
        transaction: data?.data || null,
        isLoading,
        error: error instanceof Error ? error.message : data?.success === false ? data.message || null : null,
        refetch: handleRefetch,
    };
};

export default useTransactionDetail;
