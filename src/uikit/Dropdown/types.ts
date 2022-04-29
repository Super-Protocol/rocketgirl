import { ElementType, ReactElement } from 'react';

export interface Value { value: any; label: string; }

export interface DropdownProps {
    active?: any;
    defaultActive?: any;
    list: Value[];
    onChange?: (value: any) => void;
    classNameWrap?: string;
    DropdownToggleComponent?: ElementType;
    DropdownMenuComponent?: ElementType;
    DropdownItemComponent?: ElementType;
    renderToggleLabel?: (value: Value) => ReactElement;
    renderItemLabel?: (value: Value) => ReactElement;
}
