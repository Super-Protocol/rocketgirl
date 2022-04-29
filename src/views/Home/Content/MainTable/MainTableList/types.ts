import { Tables } from '@/views/Home/types';
import { Diff } from '@/common/hooks/useTableDiff';

export interface ListItem { value: Tables, label: string }

export interface MainTableListProps {
    list: ListItem[][];
    active: Tables;
    onChange?: (table: Tables) => void;
    classNameWrap?: string;
    diff?: Map<Tables, Diff>;
}
