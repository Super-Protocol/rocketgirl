import {
    useState, useMemo, memo, useCallback, ReactElement, useEffect,
} from 'react';
import { useField } from 'formik';
import { useDebouncedCallback } from 'use-debounce';

import { generateMnemonic } from '@/utils/crypto';
import { MnemonicGeneratorUi } from './MnemonicGeneratorUi';
import { MnemonicGeneratorFormikProps, Modes } from './types';

export const MnemonicGeneratorFormik = memo<MnemonicGeneratorFormikProps>(({
    name,
    debounceInterval = 100,
    onChange: onChangeProps = () => {},
}): ReactElement => {
    const [, { error }, { setValue }] = useField(name);
    const [mode, setMode] = useState<Modes>(Modes.generate);
    const [localValue, setLocalValue] = useState<string | undefined>(undefined);
    const phrase = useMemo(() => generateMnemonic(), []);
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
    }, [localValue, phrase, setValue]);
    useEffect(() => {
        if (mode === Modes.generate) {
            setValue(phrase);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phrase]);

    return (
        <MnemonicGeneratorUi
            {...{
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
