import {
    memo,
    useMemo,
    FC,
    useState,
    useCallback,
    useEffect,
} from 'react';
import { useField } from 'formik';
import { useDebouncedCallback } from 'use-debounce';
import { InputUi } from '@/uikit';
import { InputFormikProps, InputUiTypes } from './types';

export const InputFormik: FC<InputFormikProps> = memo(({
    name,
    debounceInterval = 100,
    checkTouched = true,
    showError = true,
    inputUiType = InputUiTypes.REGULAR,
    isInvalid: isInvalidProps = false,
    onChange: onChangeProps = (val: number | string) => {},
    ...props
}) => {
    const [, { value, error, touched }, { setValue, setTouched }] = useField(name);
    const [localValue, setLocalValue] = useState(value);
    const isInvalid: boolean = useMemo(() => !!(error && (!checkTouched || touched)) || !!isInvalidProps,
        [error, touched, checkTouched, isInvalidProps]);
    const setFormValue = useCallback((val) => {
        setValue(val);
        onChangeProps(val);
    }, [onChangeProps, setValue]);
    const debouncedCallback = useDebouncedCallback(setFormValue, debounceInterval, { leading: true });
    const onChange = useCallback((val: number | string) => {
        setLocalValue(val);
        debouncedCallback(val);
    }, [debouncedCallback]);
    useEffect(() => {
        setLocalValue(value);
    }, [value]);
    return (
        <InputUi
            {...props}
            name={name}
            value={localValue}
            error={error}
            showError={showError}
            isInvalid={isInvalid}
            onChange={onChange}
            onBlur={() => setTouched(true)}
        />
    );
});
