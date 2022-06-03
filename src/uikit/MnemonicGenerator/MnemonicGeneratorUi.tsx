import {
    memo, ReactElement, useState, useMemo, useCallback,
} from 'react';
import cn from 'classnames';

import {
    Box, InputUi, CheckboxUi, CopyToClipboardSimple,
} from '@/uikit';
import { generateMnemonic } from '@/utils/crypto';
import { LabelToolkit } from '@/common/components';
import { MnemonicGeneratorProps, Modes } from './types';
import {
    tooltipText, modeTitle, agreement, chkboxlabel,
} from './helpers';
import classes from './MnemonicGeneratorUi.module.scss';

export const MnemonicGeneratorUi = memo<MnemonicGeneratorProps>(({ init }): ReactElement => {
    const [mode, setMode] = useState<Modes>(Modes.generate);
    const [value, setValue] = useState<string>();
    const phrase = useMemo(() => generateMnemonic(), []);
    const changeMode = useCallback((k: Modes) => {
        setMode(k);
    }, []);
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
                : null}
            <p className={classes.agreement}>{agreement}</p>
        </div>
    );
});
