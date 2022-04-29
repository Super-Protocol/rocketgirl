import { MouseEventHandler } from 'react';

export type appearanceTypes = 'default' | 'narrow';

export type DatePickerMinMaxDate = string | Date;

export interface IconRangeDatePickerProps {
    startDate?: DatePickerMinMaxDate;
    endDate: DatePickerMinMaxDate;
    onSelected?: Function;
}

export interface CustomDatePickerUIProps {
    label?: string;
    placeholder?: string;
    minDate?: DatePickerMinMaxDate;
    maxDate?: DatePickerMinMaxDate;
    endDate?: DatePickerMinMaxDate;
    startDate?: DatePickerMinMaxDate;
    locale?: string;
    onChange?: Function;
    showError?: boolean;
    endOfDay?: boolean;
    classNameErrorEmpty?: string;
    classNameWrapInput?: string;
    classNameWrap?: string;
    error?: string;
    touched?: boolean;
    value?: DatePickerMinMaxDate;
    inline?: boolean;
    dataTestId?: string;
    useOverlay?: boolean;
    popperPlacement?: string;
    popperModifiers?: object;
    tabIndex?: number;
    appearance?: appearanceTypes;
    disabled?: boolean;
    format?: string;
}

export interface CustomDatePickerFormikProps extends CustomDatePickerUIProps {
    name: string;
}

export interface CustomInputProps {
    placeholder?: string;
    value?: string | Date;
    id?: string;
    onClick?: MouseEventHandler;
    parentRef?: any;
    onChange?: Function;
    label?: string;
    dataTestId?: string;
    classNameWrap?: string;
    isFocused?: boolean;
    closeDatepicker: () => void;
    minDate?: DatePickerMinMaxDate;
    maxDate?: DatePickerMinMaxDate;
    tabIndex?: number;
    appearance?: appearanceTypes;
}
