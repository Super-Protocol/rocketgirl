import { ReactElement } from 'react';

import { Box, CheckboxFormik, MnemonicGeneratorFormik } from '@/uikit';
import { LabelToolkit } from '@/common/components';
import { chkboxlabel, tooltipText } from './helpers';
import classes from './MnemonicGenerator.module.scss';

export const MnemonicGenerator = (): ReactElement => (
    <LabelToolkit
        tooltipText={tooltipText}
        title="Encryption passphrase"
    >
        <Box className={classes.content} direction="column">
            <MnemonicGeneratorFormik
                name="phrase"
            />
            <CheckboxFormik
                name="agreement"
                label={chkboxlabel}
                classNameWrap={classes.checkboxWrap}
                classNameLabel={classes.checkboxLabel}
                classNameCheckboxCheckmark={classes.checkboxCheckmark}
            />
        </Box>
    </LabelToolkit>
);
