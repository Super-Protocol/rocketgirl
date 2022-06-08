import { ReactElement, memo } from 'react';
import { Box, CheckboxFormik, MnemonicGeneratorFormik } from '@/uikit';
import { LabelToolkit } from '@/common/components';
import { generateMnemonic } from '@/utils/crypto';
import { chkboxlabel, tooltipText } from './helpers';
import classes from './MnemonicGenerator.module.scss';
import { MnemonicGeneratorProps } from './types';

export const MnemonicGenerator = memo<MnemonicGeneratorProps>(({
    nameMode, name, classNameWrap, nameAgreement,
}): ReactElement => {
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
                <CheckboxFormik
                    name={nameAgreement}
                    label={chkboxlabel}
                    classNameWrap={classes.checkboxWrap}
                    classNameLabel={classes.checkboxLabel}
                    classNameCheckboxCheckmark={classes.checkboxCheckmark}
                />
            </Box>
        </LabelToolkit>
    );
});
