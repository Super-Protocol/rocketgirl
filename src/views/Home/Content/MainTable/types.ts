import { Tables } from '@/views/Home/types';
import { UseTablesQueryFetcherResult } from '@/views/Home/hooks/useTablesQueryFetcher';

export interface MainTableProps {
    classNameWrap?: string;
    onChangeTable: (table: Tables) => void;
    table: Tables;
    tables: { value: Tables, label: string }[][];
    fetcher: UseTablesQueryFetcherResult;
}

export type GetDiffIndexesResult = Map<number, Set<string>> | null;
