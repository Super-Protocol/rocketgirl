import React, {
    memo,
    FC,
} from 'react';
import { Box } from '@/uikit';
import { WalletConnectorBtn } from '@/common/components/WalletConnectorBtn';
import { NoAccountBlockProps } from './types';
import classes from './NoAccountBlock.module.scss';

export const NoAccountBlock: FC<NoAccountBlockProps> = memo(({ message }) => {
    return (
        <Box className={classes.wrap} direction="column" alignItems="center" justifyContent="center">
            {!!message && <Box className={classes.message}>{message}</Box>}
            <WalletConnectorBtn />
        </Box>
    );
});
