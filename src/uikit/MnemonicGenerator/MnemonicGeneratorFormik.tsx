import {
    useState, useMemo, memo, useCallback, ReactElement,
} from 'react';
import { useField } from 'formik';
import { useDebouncedCallback } from 'use-debounce';
import { MnemonicGeneratorUi } from '@/uikit';
import { MnemonicGeneratorFormikProps, Modes } from './types';

export const MnemonicGeneratorFormik = memo<MnemonicGeneratorFormikProps>(({
    namePhraseInput,
    namePhraseGenerated,
    debounceInterval = 100,
    nameMode = Modes.generate,
    ...props
}): ReactElement => {
    const [, { value: valueInput, error: errorInput }, { setValue: setValueInput }] = useField(namePhraseInput);
    const [, { value: valueGenerated, error: errorGenerated }] = useField(namePhraseGenerated);
    const [, { value: valueMode }, { setValue: setValueMode }] = useField(nameMode);
    const [localInputValue, setLocalInputValue] = useState<string | undefined>(valueInput);
    const error = useMemo(() => (errorInput || errorGenerated), [errorGenerated, errorInput]);
    const isInvalid: boolean = useMemo(() => !!error, [error]);
    const debouncedCallback = useDebouncedCallback(setValueInput, debounceInterval, { leading: true });
    const onChange = useCallback((val: string | undefined) => {
        setLocalInputValue(val);
        debouncedCallback(val);
    }, [debouncedCallback]);
    const onChangeMode = useCallback((newMode: Modes) => {
        setValueMode(newMode);
    }, [setValueMode]);
    return (
        <MnemonicGeneratorUi
            {...{
                ...props,
                phrase: valueGenerated,
                value: localInputValue,
                onChange,
                error,
                isInvalid,
                mode: valueMode,
                setMode: onChangeMode,
            }}
        />
    );
});
