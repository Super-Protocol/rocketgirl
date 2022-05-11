import { ReactNode } from 'react';
import { Item, SelectLazyLoadFetcher } from '@/uikit/Select/types';

export interface RenderListProps {
    options: Item[];
    loading: boolean;
}

export interface LazyLoadListProps {
    fetcher?: SelectLazyLoadFetcher | null;
    renderList: (props: RenderListProps) => ReactNode;
}
