import { Tables } from '@/views/Home/types';
import { UseTablesQueryFetcherResult } from '@/views/Home/hooks/useTablesQueryFetcher';
import { Diff } from '@/common/hooks/useTableDiff';

export interface MainTableProps {
    classNameWrap?: string;
    onChangeTable: (table: Tables) => void;
    table: Tables;
    tables: { value: Tables, label: string }[][];
    fetcher: UseTablesQueryFetcherResult;
    diff: Map<Tables, Diff>;
}
