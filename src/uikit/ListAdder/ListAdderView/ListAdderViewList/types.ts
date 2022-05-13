import { Value } from '@/uikit/types';

export interface ListAdderViewListProps {
    list: Value[];
    onDelete?: (value: Value) => void;
}
