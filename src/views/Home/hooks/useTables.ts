import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { OperationVariables } from '@apollo/client';
import { Tables } from '@/views/Home/types';
import { PageClick } from '@/uikit/Table/TablePagination/types';
import { SelectedWalletType } from '@/views/Home/context/walletContext';
import { useTablesSubscriptions } from './useTablesSubscriptions';
import { useTablesQueryFetcher, UseTablesQueryFetcherResult } from './useTablesQueryFetcher';

export interface UseTablesResult {
    queryFetcher: UseTablesQueryFetcherResult;
    table: Tables;
    onChangeTable: (table: Tables, filter?: OperationVariables | null) => void;
}

export const useTables = (initialTable: Tables, selectedWalletType?: SelectedWalletType): UseTablesResult => {
    const skipByWallet = useMemo(() => {
        return (!selectedWalletType ? [Tables.MyOrders] : [])
            .map((table) => ({ table, reason: 'Connect wallet to see your orders' }));
    }, [selectedWalletType]);
    const [table, setTable] = useState(initialTable);
    const queryFetcher = useTablesQueryFetcher({ table, skip: skipByWallet });
    useTablesSubscriptions(queryFetcher);
    const onChangeTable = useCallback((newTable: Tables, filter?: OperationVariables | null) => {
        setTable(newTable);
        if (!skipByWallet.some(({ table }) => table === newTable)) {
            queryFetcher[newTable]?.onChangePage({ filter, pageClick: PageClick.FIRST });
        }
        // reset query data
    }, [queryFetcher, skipByWallet]);
    useEffect(() => {
        onChangeTable(table);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedWalletType]);
    return {
        queryFetcher,
        table,
        onChangeTable,
    };
};
