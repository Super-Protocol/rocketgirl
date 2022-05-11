import { Value } from '@/uikit/Select/types';

export interface OnAddProps {
    isMulti: boolean;
    values: Value | Value[];
}

export interface ListAdderViewProps {
    label?: string;
    values?: Value | Value[];
    isMulti?: boolean;
    onAdd?: (props: OnAddProps) => void;
}

export interface ListAdderViewFormikProps extends ListAdderViewProps {
    name: string;
}
