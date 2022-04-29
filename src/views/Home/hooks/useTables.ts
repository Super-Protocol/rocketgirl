import { useCallback, useState } from 'react';
import { OperationVariables } from '@apollo/client';
import { Tables } from '@/views/Home/types';
import { PageClick } from '@/uikit/Table/TablePagination/types';
import { useTablesSubscriptions } from './useTablesSubscriptions';
import { useTablesQueryFetcher, UseTablesQueryFetcherResult } from './useTablesQueryFetcher';

export interface UseTablesResult {
    queryFetcher: UseTablesQueryFetcherResult;
    table: Tables;
    onChangeTable: (table: Tables, filter?: OperationVariables | null) => void;
}

export const useTables = (initialTable: Tables): UseTablesResult => {
    const [table, setTable] = useState(initialTable);
    const queryFetcher = useTablesQueryFetcher(table);
    useTablesSubscriptions(queryFetcher);
    const onChangeTable = useCallback((newTable: Tables, filter?: OperationVariables | null) => {
        setTable(newTable);
        queryFetcher[newTable]?.onChangePage({ filter, pageClick: PageClick.FIRST });
    }, [queryFetcher]);
    return {
        queryFetcher,
        table,
        onChangeTable,
    };
};
