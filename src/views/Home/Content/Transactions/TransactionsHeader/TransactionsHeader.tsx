import { memo, FC } from 'react';
import { Box } from '@/uikit';
import { TransactionsHeaderProps } from './types';
import { TransactionsHeaderInfo } from './TransactionsHeaderInfo';
import { TransactionsHeaderSearch } from './TransactionsHeaderSearch';
import classes from './TransactionsHeader.module.scss';

export const TransactionsHeader: FC<TransactionsHeaderProps> = memo(() => {
    return (
        <Box justifyContent="space-between" className={classes.wrap}>
            <TransactionsHeaderInfo />
            <TransactionsHeaderSearch />
        </Box>
    );
});
