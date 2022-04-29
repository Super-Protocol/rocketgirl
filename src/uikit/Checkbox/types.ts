import { ReactNode } from 'react';

export interface Value {
    [x: string]: boolean;
}

export interface Item {
    value: string;
    label: string;
    [x: string]: any;
}

export enum themes {
    light = 'light',
    dark = 'dark'
}

export interface CheckboxUiProps {
    label?: string | ReactNode;
    tooltip?: ReactNode | string;
    labelURL?: string;
    checked?: boolean;
    disabled?: boolean;
    onChange?: Function;
    onClick?: Function;
    isInvalid?: boolean;
    name?: string;
    classNameWrap?: string;
    classNameLabel?: string;
    classNameCheckboxCheckmark?: string;
    dataTestId?: string;
    labelClickDisabled?: boolean;
    semi?: boolean;
    theme?: themes;
    labelLimit?: number;
    localState?: string;
    withLabelTooltip?: boolean;
}

export interface CheckboxFormikProps {
    name: string;
    onChange?: Function;
    [x: string]: any;
    checkTouched?: boolean;
}

export interface CheckboxGroupProps {
    name: string;
    options: any[];
    tooltip?: ReactNode | string;
    tooltips?: any;
    label?: string;
    horizontal?: boolean;
    labelClassName?: string;
    groupClassName?: string;
    formGroupClassName?: string;
    dataTestId?: string;
    limit?: number;
    localState?: string;
    isMulti?: boolean;
    theme?: themes;
    classNameWrapCheckbox?: string;
    classNameLabelCheckbox?: string;
    classNameCheckboxGroupItem?: string;
    onChange?: Function;
    withLabelTooltip?: boolean;
}
