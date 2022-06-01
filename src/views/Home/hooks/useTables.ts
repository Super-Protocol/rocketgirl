import {
    useCallback,
    useEffect,
    useMemo,
} from 'react';
import qs from 'query-string';
import { useLocation } from 'react-router-dom';
import { useHistory } from 'react-router';
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
    const history = useHistory();
    const location = useLocation();
    const query = useMemo(() => qs.parse(location.search), [location]);
    const table = useMemo<Tables>(() => (query?.table as Tables) || initialTable, [query, initialTable]);
    const skipByWallet = useMemo(() => {
        return (!consumer ? [Tables.Orders] : [])
            .map((table) => ({
                table,
                message: 'Connect wallet to see your orders',
                type: UseTablesSkipType.wallet,
            }));
    }, [consumer]);
    const queryFetcher = useTablesQueryFetcher<UseTablesSkipType>({ table, skip: skipByWallet, consumer });
    useTablesSubscriptions(queryFetcher);
    const onChangeTable = useCallback((newTable: Tables, filter?: OperationVariables | null) => {
        history.push(`?table=${newTable}`);
        if (!skipByWallet.some(({ table }) => table === newTable)) {
            queryFetcher[newTable]?.onChangePage({ filter, pageClick: PageClick.FIRST });
        }
        // reset query data
    }, [queryFetcher, skipByWallet, history]);
    useEffect(() => {
        onChangeTable(table);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [consumer]);
    return {
        queryFetcher,
        table,
        onChangeTable,
    };
};
