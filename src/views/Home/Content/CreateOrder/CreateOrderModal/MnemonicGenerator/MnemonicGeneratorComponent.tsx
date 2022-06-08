import { ReactElement, useCallback, memo } from 'react';

import { Box, CheckboxFormik, MnemonicGeneratorFormik } from '@/uikit';
import { generateMnemonic } from '@/utils/crypto';
import classes from './MnemonicGenerator.module.scss';
import { chkboxlabel } from './helpers';
import { MnemonicGeneratorComponentProps } from './types';

export const MnemonicGeneratorComponent = memo<MnemonicGeneratorComponentProps>(({
    canShowAgreement, setAgreement, nameMode, name,
}): ReactElement => {
    const onChangeAgreement = useCallback((val: boolean) => {
        setAgreement(val);
    }, [setAgreement]);
    return (
        <Box className={classes.content} direction="column">
            <MnemonicGeneratorFormik
                name={name}
                nameMode={nameMode}
                generateMnemonic={generateMnemonic}
            />
            {canShowAgreement && (
                <CheckboxFormik
                    name="agreement"
                    label={chkboxlabel}
                    onChange={(val) => onChangeAgreement(val)}
                    classNameWrap={classes.checkboxWrap}
                    classNameLabel={classes.checkboxLabel}
                    classNameCheckboxCheckmark={classes.checkboxCheckmark}
                />
            )}
        </Box>
    );
});
