import { Columns as TransactionsColumns } from '@/views/Home/Content/Transactions/TransactionsTable/types';
import { usePeriodicalTableFetcher, UseTableCacheFetcherResult } from '@/common/hooks/usePeriodicalTableFetcher';
import { Tables } from '../types';
import { useTransactionsCache } from './useTransactionsCache';

export interface UseTablesFetcherResult {
    [Tables.Transactions]: UseTableCacheFetcherResult<TransactionsColumns>;
}
export const useTablesFetcher = (): UseTablesFetcherResult => {
    const { getCachedTransactions } = useTransactionsCache();
    const transactions = usePeriodicalTableFetcher<Tables, TransactionsColumns>({
        table: Tables.Transactions,
        fetcher: getCachedTransactions,
    });

    return {
        [Tables.Transactions]: transactions,
    };
};
