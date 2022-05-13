import { LazyLoadFetcher, Value } from '@/uikit/types';

export interface LazyLoadCheckboxListFetcherData { description?: string }

export interface LazyLoadCheckboxListProps {
    fetcher?: LazyLoadFetcher<LazyLoadCheckboxListFetcherData> | null;
    isMulti?: boolean;
    values: Value[] | Value;
    onChange: (values: Value[] | Value) => void;
}
