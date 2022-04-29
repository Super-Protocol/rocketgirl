import { memo, FC } from 'react';
import cn from 'classnames';
import { useDebounce } from 'use-debounce';
import { useField } from 'formik';
import { useTablesFetcher } from '@/views/Home/hooks/useTablesFetcher';
import { Box } from '@/uikit';
import { TransactionsProps } from './types';
import { TransactionsTable } from './TransactionsTable';
import { TransactionsHeader } from './TransactionsHeader';
import classes from './Transactions.module.scss';

const SEARCH_DEBOUNCE_TIMEOUT = 100;

export const Transactions: FC<TransactionsProps> = memo(({ classNameWrap }) => {
    const fetcher = useTablesFetcher(); // todo remove it after add transactions in backend
    // const [, { value: valueSearch }] = useField('search');
    // const [searchDebounced] = useDebounce(valueSearch, SEARCH_DEBOUNCE_TIMEOUT);
    return (
        <Box direction="column" className={cn(classes.wrap, classNameWrap)}>
            {/*<TransactionsHeader />*/}
            {/*<TransactionsTable search={searchDebounced} fetcher={fetcher} />*/}
        </Box>
    );
});
