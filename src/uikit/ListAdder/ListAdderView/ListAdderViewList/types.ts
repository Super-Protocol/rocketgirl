import { ReactNode } from 'react';
import { Item } from '@/uikit/LazyLoadCheckboxList/types';

export interface Info { description: string; name: string; sub: Item<Info>[]; }

export interface ListAdderViewListProps {
    list?: Item<Info>[];
    onDelete?: (value: Item<Info>) => void;
    renderItem?: (value: Item<Info>) => ReactNode;
}
