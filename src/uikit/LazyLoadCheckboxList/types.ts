import { ApolloError } from '@apollo/client';
import { LazyLoadFetcher, Value } from '@/uikit/types';

export interface LazyLoadCheckboxListFetcherData { description?: string }

export interface Item<Info, value = Value> {
    value?: value;
    info?: Info;
}

export interface LazyLoadCheckboxListProps<Info> {
    fetcher?: LazyLoadFetcher<LazyLoadCheckboxListFetcherData> | null;
    isMulti?: boolean;
    values: Item<Info>[] | Item<Info>;
    onChange: (values?: Item<Info>[] | Item<Info>) => void;
    onError?: (e?: ApolloError | unknown) => void;
}
