import { Tables } from '@/views/Home/types';
import { Diff } from '@/common/hooks/useTableDiff';

export interface ListItem { value: Tables, label: string }

export interface TableHeaderListProps {
    list: ListItem[][];
    active: Tables;
    onChange?: (table: Tables) => void;
    classNameWrap?: string;
    diff?: Map<Tables, Diff>;
}
