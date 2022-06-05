import {
    memo, ReactElement, useState, useCallback,
} from 'react';
import cn from 'classnames';

import { Box, CopyToClipboardSimple, InputUi } from '@/uikit';
import { MnemonicGeneratorUiProps, Modes } from './types';
import { modeTitle, agreement, placeholder } from './helpers';
import classes from './MnemonicGeneratorUi.module.scss';

export const MnemonicGeneratorUi = memo<MnemonicGeneratorUiProps>(({
    phrase,
    error,
    isInvalid,
    value,
    onChange: onChangeProps,
    mode: modeProps = Modes.generate,
    setMode: setModeProps = () => {},
}): ReactElement => {
    const [mode, setMode] = useState<Modes>(modeProps);
    const changeMode = useCallback((k: Modes) => {
        setMode(k);
        setModeProps(k);
    }, [setModeProps]);
    const onChange = useCallback((val: string) => {
        onChangeProps(val);
    }, [onChangeProps]);

    return (
        <div>
            <Box className={classes.modeswitcher}>
                {Object.entries(modeTitle).map(([k, v], idx) => (
                    <div
                        key={k}
                        className={cn(
                            classes.mode,
                            { [classes['mode-active']]: mode === k },
                            { [classes['mode-zero']]: idx === 0 },
                        )}
                        onClick={() => changeMode(k as Modes)}
                    >
                        {v}
                    </div>
                ))}
            </Box>
            {mode === Modes.generate
                ? (
                    <Box className={classes.phrase}>
                        {phrase}
                        <CopyToClipboardSimple text={phrase} />
                    </Box>
                )
                : (
                    <InputUi
                        {...{
                            value,
                            error,
                            isInvalid,
                            showError: isInvalid,
                            onChange,
                            classNameError: classes.inputError,
                            placeholder,
                        }}
                        as="textarea"
                    />
                )}
            <p className={classes.agreement}>{agreement}</p>
        </div>
    );
});
