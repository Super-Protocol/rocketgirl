import React, { memo, FC } from 'react';
import { Box, CopyToClipboard } from '@/uikit';
import { SuccessModalProps } from './types';
import classes from './SuccessModal.module.scss';

export const SuccessModal: FC<SuccessModalProps> = memo(({ mnemonic }) => {
    return (
        <Box direction="column">
            <Box className={classes.title}>Please remember your seed phrase:</Box>
            <CopyToClipboard isEllipsis={false}>{mnemonic}</CopyToClipboard>
        </Box>
    );
});
