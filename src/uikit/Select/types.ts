import {
    JSXElementConstructor,
    PropsWithChildren,
    ReactElement,
    ReactNode,
} from 'react';
import {
    ApolloError,
} from '@apollo/client';

export type Value = string | number | undefined | boolean | null;

export interface Item<Val = Value> {
    value: Val;
    label: string;
    disabled?: boolean;
    [x: string]: any;
}

export interface SelectUiProps {
    name?: string;
    options?: Item[];
    isMulti?: boolean;
    isNumber?: boolean;
    showError?: boolean;
    placeholder?: string;
    label?: string | ReactNode;
    error?: string;
    tooltip?: ReactNode | string;
    showFeedback?: boolean;
    onChange?: Function;
    onCreate?: Function;
    getValue?: Function;
    defaultValue?: Value | Value[];
    value?: Value | Value[];
    disabled?: boolean;
    isClearable?: boolean;
    loading?: boolean;
    isInvalid?: boolean;
    classNameError?: string;
    classNameErrorEmpty?: string;
    classNameLabel?: string;
    classNameWrap?: string;
    classNamePrefix?: string;
    classNameSelect?: string;
    customStyles?: object;
    components?: any;
    menuPlacement?: 'top' | 'bottom' | 'auto';
    tooltipComponent?: ReactNode;
    dataTestId?: string;
    mode?: 'create' | 'default' | 'async' | 'async-query';
    [x: string]: any;
}

export interface SelectFormikProps extends SelectUiProps {
    name: string;
    checkTouched?: boolean;
}

export type SelectUiResult<TData> = ReactElement<
    PropsWithChildren<SelectUiProps>,
    string | JSXElementConstructor<TData>
> | null;

export type SelectLazyLoadFetcherResult = { options: Item[] | undefined, cursor?: string | null, input?: string | null };

export type SelectLazyLoadFetcherProps = { cursor?: string | null; search?: string | null; signal?: AbortSignal };

export type SelectLazyLoadFetcher = (props: SelectLazyLoadFetcherProps) => Promise<SelectLazyLoadFetcherResult>

export interface SelectLazyLoadUiProps extends SelectUiProps {
    fetcher?: SelectLazyLoadFetcher | null;
    onError?: (e: ApolloError | Error) => void;
    defaultOptions?: Item[];
}

export interface SelectLazyLoadFormikProps extends SelectLazyLoadUiProps {}
