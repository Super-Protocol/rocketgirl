import { Value } from '@/uikit/types';

export interface OnAddProps {
    isMulti: boolean;
    values: Value | Value[];
}

export interface OnDeleteProps {
    isMulti: boolean;
    value: Value;
}

export interface ListAdderViewProps {
    label?: string;
    btnLabel?: string;
    values?: Value | Value[];
    isMulti?: boolean;
    onAdd?: (props: OnAddProps) => void;
    onDelete?: (props: OnDeleteProps) => void;
    className?: string;
}
