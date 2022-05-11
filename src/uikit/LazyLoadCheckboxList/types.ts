import { SelectLazyLoadFetcher, Value } from '@/uikit/Select/types';

export interface LazyLoadCheckboxListProps {
    fetcher?: SelectLazyLoadFetcher | null;
    isMulti?: boolean;
    values: Value[] | Value;
    onChange: (values: Value[] | Value) => void;
}
