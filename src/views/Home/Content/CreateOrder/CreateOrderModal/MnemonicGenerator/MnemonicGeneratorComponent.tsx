import { ReactElement, memo } from 'react';

import { Box, CheckboxFormik, MnemonicGeneratorFormik } from '@/uikit';
import classes from './MnemonicGenerator.module.scss';
import { chkboxlabel } from './helpers';
import { MnemonicGeneratorComponentProps } from './types';

export const MnemonicGeneratorComponent = memo<MnemonicGeneratorComponentProps>(({
    nameMode, namePhraseInput, nameAgreement, namePhraseGenerated,
}): ReactElement => {
    return (
        <Box className={classes.content} direction="column">
            <MnemonicGeneratorFormik
                namePhraseGenerated={namePhraseGenerated}
                namePhraseInput={namePhraseInput}
                nameMode={nameMode}
            />
            <CheckboxFormik
                name={nameAgreement}
                label={chkboxlabel}
                showError
                classNameWrap={classes.checkboxWrap}
                classNameLabel={classes.checkboxLabel}
                classNameCheckboxCheckmark={classes.checkboxCheckmark}
            />
        </Box>
    );
});
