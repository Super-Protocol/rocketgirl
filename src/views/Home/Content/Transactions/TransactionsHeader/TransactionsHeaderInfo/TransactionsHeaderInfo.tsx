import { memo, FC } from 'react';
import { Box } from '@/uikit';
import { TransactionsHeaderInfoProps } from './types';
import classes from './TransactionsHeaderInfo.module.scss';

export const TransactionsHeaderInfo: FC<TransactionsHeaderInfoProps> = memo(() => {
    return (
        <Box direction="column">
            <div className={classes.title}>Transactions</div>
        </Box>
    );
});
