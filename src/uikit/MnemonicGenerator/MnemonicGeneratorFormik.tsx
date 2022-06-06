import {
    useState, useMemo, memo, useCallback, ReactElement, useEffect,
} from 'react';
import { useField } from 'formik';
import { useDebouncedCallback } from 'use-debounce';
import { MnemonicGeneratorUi } from '@/uikit';
import { MnemonicGeneratorFormikProps, Modes } from './types';

export const MnemonicGeneratorFormik = memo<MnemonicGeneratorFormikProps>(({
    name,
    debounceInterval = 100,
    onChange: onChangeProps = () => {},
    nameMode,
    generateMnemonic,
    ...props
}): ReactElement => {
    const [, { value, error }, { setValue }] = useField(name);
    const [, { value: mode }, { setValue: setMode }] = useField(nameMode);
    const [localValue, setLocalValue] = useState<string | undefined>(value);
    const phrase = useMemo(() => generateMnemonic(), [generateMnemonic]);
    const isInvalid: boolean = useMemo(() => !!error, [error]);
    const setFormValue = useCallback((val) => {
        setValue(val);
        onChangeProps(val);
    }, [onChangeProps, setValue]);
    const debouncedCallback = useDebouncedCallback(setFormValue, debounceInterval, { leading: true });
    const onChange = useCallback((val: string) => {
        setLocalValue(val);
        debouncedCallback(val);
    }, [debouncedCallback]);
    const onChangeMode = useCallback((k) => {
        setMode(k);
        setValue(k === Modes.generate ? phrase : localValue);
    }, [localValue, phrase, setValue, setMode]);
    useEffect(() => {
        if (mode === Modes.generate) {
            setValue(phrase);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phrase]);

    return (
        <MnemonicGeneratorUi
            {...{
                ...props,
                phrase,
                value: localValue,
                onChange,
                error,
                isInvalid,
                mode,
                setMode: onChangeMode,
            }}
        />
    );
});
