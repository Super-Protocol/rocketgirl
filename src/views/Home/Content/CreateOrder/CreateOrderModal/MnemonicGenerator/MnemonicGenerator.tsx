import { ReactElement } from 'react';

import { Box, CheckboxFormik, MnemonicGeneratorUi } from '@/uikit';
import { LabelToolkit } from '@/common/components';
import { chkboxlabel, tooltipText } from './helpers';
import classes from './MnemonicGenerator.module.scss';

export const MnemonicGenerator = (): ReactElement => {
    return (
        <Box direction="column" className={classes.wrap}>
            <LabelToolkit
                tooltipText={tooltipText}
                title="Encryption passphrase"
            />
            <Box className={classes.content} direction="column">
                <MnemonicGeneratorUi />
                <CheckboxFormik
                    name="ssss"
                    label={chkboxlabel}
                    checked
                />
            </Box>
        </Box>
    );
};
