import { ReactNode } from 'react';

export interface InputUiProps {
    'data-testid'?: string;
    id?: string;
    value?: number | string;
    placeholder?: string;
    label?: string;
    tooltip?: string | ReactNode;
    prepend?: string | ReactNode;
    disabled?: boolean;
    classNameWrap?: string;
    classNameLabel?: string;
    classNameInput?: string;
    classNamePrepend?: string;
    classNameErrorEmpty?: string;
    classNameError?: string;
    classNameInputLabelFocused?: string;
    classNameInputLabel?: string;
    error?: string;
    min?: number;
    max?: number;
    name?: string;
    isInvalid?: boolean;
    autoComplete?: string;
    isNumber?: boolean;
    showError?: boolean;
    isFloat?: boolean;
    isPositive?: boolean;
    isDate?: boolean;
    onChange?: Function;
    onKeyDown?: Function;
    onBlur?: Function;
    onFocus?: Function;
    innerTooltip?: string;
    loading?: boolean;
    as?: 'textarea' | 'input';
    [x: string]: any;
    resize?: 'none'
        | 'inherit'
        | '-moz-initial'
        | 'initial'
        | 'revert'
        | 'unset'
        | 'block'
        | 'both'
        | 'horizontal'
        | 'inline'
        | 'vertical';
    autosize?: boolean;
    mask?: string;
    alwaysShowMask?: boolean;
    beforeMaskedStateChange?: Function;
    renderError?: (error: any) => ReactNode;
    markLabelError?: boolean;
}

export enum InputUiTypes {
    REGULAR,
    PHONE,
}

export interface InputFormikProps extends InputUiProps {
    name: string;
    debounceInterval?: number;
    checkTouched?: boolean;
    inputUiType?: InputUiTypes;
    onChange?: Function;
    isInvalid?: boolean;
}

export interface InputWithResetProps {
    onChange?: Function;
}

export enum keyCodes {
    ARROW_UP = 38,
    ARROW_DOWN = 40,
}

export interface InputPhoneProps extends InputUiProps {

}
