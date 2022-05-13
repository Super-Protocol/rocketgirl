import { ReactNode } from 'react';
import { ApolloError } from '@apollo/client';
import { Item, LazyLoadFetcher, Value } from '@/uikit/types';

export interface RenderListProps<TData> {
    options: Item<Value, TData>[];
    loading: boolean;
}

export interface LazyLoadListProps<TData> {
    fetcher?: LazyLoadFetcher<TData> | null;
    renderList: (props: RenderListProps<TData>) => ReactNode;
    classes?: { wrap?: string };
    onError?: (e?: ApolloError | unknown) => void;
}
