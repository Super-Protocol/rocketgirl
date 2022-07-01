import { UseTableQueryFetcherResultList } from '@/common/hooks/useTableQueryFetcher';
import { UseTablesQueryFetcherResult } from '@/views/Home/hooks/useTablesQueryFetcher';
import { Tables } from '@/views/Home/types';
import { Diff } from '@/common/hooks/useTableDiff';

export type TransactionsColumns = UseTableQueryFetcherResultList<any>; // todo

export interface TransactionsProps {
    classNameWrap?: string;
    fetcher: UseTablesQueryFetcherResult;
    diff: Map<Tables, Diff>;
}

export type Columns = TransactionsColumns;
