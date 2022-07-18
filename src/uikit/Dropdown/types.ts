import { ElementType, ReactNode } from 'react';

export interface Value { value: any; label: string; }

export interface DropdownProps {
    active?: any;
    defaultActive?: any;
    list: Value[];
    onChange?: (value: any) => void;
    classNameWrap?: string;
    classNameDropdownMenu?: string;
    DropdownToggleComponent?: ElementType;
    DropdownMenuComponent?: ElementType;
    DropdownItemComponent?: ElementType;
    renderToggleLabel?: (value: any) => ReactNode | null;
    renderItemLabel?: (value: any) => ReactNode | null;
    loading?: boolean;
    header?: string | ReactNode;
    footer?: string | ReactNode;
}
