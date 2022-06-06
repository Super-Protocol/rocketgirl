import { ReactElement, useCallback, memo } from 'react';

import { Box, CheckboxFormik, MnemonicGeneratorFormik } from '@/uikit';
import { LabelToolkit } from '@/common/components';
import { generateMnemonic } from '@/utils/crypto';
import { chkboxlabel, tooltipText } from './helpers';
import classes from './MnemonicGenerator.module.scss';
import { MnemonicGeneratorProps } from './types';

export const MnemonicGenerator = memo<MnemonicGeneratorProps>(({
    canShowAgreement, setAgreement, nameMode, name, classNameWrap,
}): ReactElement => {
    const onChangeAgreement = useCallback((val: boolean) => {
        setAgreement(val);
    }, [setAgreement]);
    return (
        <LabelToolkit
            tooltipText={tooltipText}
            title="Encryption passphrase"
            classNameWrap={classNameWrap}
        >
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
        </LabelToolkit>
    );
});
