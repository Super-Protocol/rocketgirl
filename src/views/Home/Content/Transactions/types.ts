import { UseTableQueryFetcherResultList } from '@/common/hooks/useTableQueryFetcher';

export type TransactionsColumns = UseTableQueryFetcherResultList<any>; // todo

export interface TransactionsProps {
    classNameWrap?: string;
}

export type Columns = TransactionsColumns;
