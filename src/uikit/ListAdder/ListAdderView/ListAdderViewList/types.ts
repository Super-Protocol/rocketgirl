import { ReactNode } from 'react';
import { Item } from '@/uikit/LazyLoadCheckboxList/types';

export interface ListAdderViewListProps<Info> {
    list?: Item<Info>[];
    onDelete?: (value: Item<Info>) => void;
    renderItem?: (value: Item<Info>) => ReactNode;
}
