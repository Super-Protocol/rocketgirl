import { ReactNode } from 'react';
import { Item } from '@/uikit/LazyLoadCheckboxList/types';

export interface OnAddProps<Info> {
    isMulti: boolean;
    values?: Item<Info> | Item<Info>[];
}

export interface OnDeleteProps<Info> {
    isMulti: boolean;
    value: Item<Info>;
}

export interface ListAdderViewProps<Info> {
    label?: string;
    btnLabel?: string;
    values?: Item<Info> | Item<Info>[];
    isMulti?: boolean;
    onAdd?: (props: OnAddProps<Info>) => void;
    onDelete?: (props: OnDeleteProps<Info>) => void;
    className?: string;
    error?: string;
    isInvalid?: boolean;
    showError?: boolean;
    renderItem?: (value: Item<Info>) => ReactNode;
    disabled?: boolean;
    classNameListItem?: string;
    name?: string;
}

export interface ListAdderViewFormikProps<Info> extends ListAdderViewProps<Info> {
    name: string;
    checkTouched?: boolean;
}

export type Info = { description: string; name: string; sub: Item<Info>[] };
