import {
    useCallback,
    useEffect,
    useMemo,
} from 'react';
import qs from 'query-string';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { OperationVariables } from '@apollo/client';
import { Tables } from '@/views/Home/types';
import { PageClick } from '@/uikit/Table/TablePagination/types';
import { useTablesSubscriptions } from './useTablesSubscriptions';
import {
    useTablesQueryFetcher,
    UseTablesQueryFetcherResult,
} from './useTablesQueryFetcher';

export enum UseTablesSkipType {
    wallet = 'wallet'
}

export interface UseTablesResult {
    queryFetcher: UseTablesQueryFetcherResult;
    table: Tables;
    onChangeTable: (table: Tables, filter?: OperationVariables | null) => void;
}

export const useTables = (initialTable: Tables, consumer?: string): UseTablesResult => {
    const navigate = useNavigate();
    const location = useLocation();
    const query = useMemo(() => qs.parse(location.search), [location]);
    const table = useMemo<Tables>(() => (query?.table as Tables) || initialTable, [query, initialTable]);
    const skipByWallet = useMemo(() => {
        return (!consumer ? [
            {
                table: Tables.Orders,
                message: 'Connect wallet to see your orders',
                type: UseTablesSkipType.wallet,
            },
            {
                table: Tables.Transactions,
                message: 'Connect wallet to see your transactions',
                type: UseTablesSkipType.wallet,
            },
        ] : []);
    }, [consumer]);
    const queryFetcher = useTablesQueryFetcher<UseTablesSkipType>({ table, skip: skipByWallet, consumer });
    useTablesSubscriptions(queryFetcher, consumer);
    const onChangeTable = useCallback((newTable: Tables, filter?: OperationVariables | null) => {
        navigate(`?table=${newTable}`);
        if (!skipByWallet.some(({ table }) => table === newTable)) {
            queryFetcher[newTable]?.onChangePage({ filter, pageClick: PageClick.FIRST });
        }
    }, [queryFetcher, skipByWallet, navigate]);
    useEffect(() => {
        Object.entries(queryFetcher).forEach(([, fetcher]) => {
            if (!fetcher.skip) {
                fetcher.onChangePage({ pageClick: PageClick.FIRST });
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [consumer]);
    return {
        queryFetcher,
        table,
        onChangeTable,
    };
};
