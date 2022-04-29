import { useField } from 'formik';
import { useCallback, useMemo } from 'react';
import { Value } from '@/uikit/Select/types';

export interface UseSelectFormikProps {
    name?: string;
    onChange?: Function;
    error?: string;
    checkTouched?: boolean;
}

export interface UseSelectFormikResult {
    handleOnChange: Function;
    value?: Value | Value[];
    isInvalid: boolean;
    error?: string;
}

export const useSelectFormik = ({
    name,
    error: errorProp,
    onChange = () => {},
    checkTouched = true,
}: UseSelectFormikProps): UseSelectFormikResult => {
    const [, { value, error, touched }, { setValue }] = useField(name as string);
    const isInvalid: boolean = useMemo(
        () => !!((error || errorProp) && (!checkTouched || touched)),
        [error, touched, checkTouched, errorProp],
    );

    const handleOnChange = useCallback((value) => {
        setValue(value);
        onChange(value);
    }, [onChange, setValue]);
    return {
        handleOnChange,
        value,
        isInvalid,
        error: errorProp || error,
    };
};
