import React, {
    memo,
    FC,
    useMemo,
    useCallback, useContext,
} from 'react';
import isEqual from 'lodash.isequal';
import { PageClick } from '@/uikit/Table/TablePagination/types';
import { Table, Box } from '@/uikit';
import { getDiffIndexes } from '@/views/Home/Content/helpers';
import useMemoCompare from '@/common/hooks/useMemoCompare';
import { GetDiffIndexesResult } from '@/views/Home/Content/types';
import { Tables } from '@/views/Home/types';
import { NoAccountBlock } from '@/common/components/NoAccountBlock';
import { WalletContext } from '@/common/context/WalletProvider';
import { TransactionsProps, Columns } from './types';
import {
    getFilters,
    spinnerProps,
    styles,
    tables,
} from './helpers';
import { getColumns } from './columns';
import classes from './Transactions.module.scss';
import { FilterForm } from './Filter';
import { Filter } from './Filter/FilterForm/types';
import { TableHeaderList } from '../TableHeaderList';

export const Transactions: FC<TransactionsProps> = memo(({ classNameWrap, fetcher, diff }) => {
    const { selectedAddress } = useContext(WalletContext);
    const transactionFetcher = useMemo(() => fetcher[Tables.Transactions], [fetcher]);
    const activeDiffIndexes = useMemo(() => getDiffIndexes(transactionFetcher), [transactionFetcher]);
    const activeDiffIndexesMemoCompare = useMemoCompare<GetDiffIndexesResult>(activeDiffIndexes, isEqual);
    const columns = useMemo(() => getColumns(), []);
    const data = useMemo(() => (transactionFetcher?.list ? transactionFetcher?.list : []), [transactionFetcher]);
    const pageCount = useMemo(() => transactionFetcher?.pageCount || 0, [transactionFetcher]);
    const onSubmit = useCallback((filter: Filter) => {
        transactionFetcher?.onChangePage({ filter: getFilters(filter?.values), pageClick: PageClick.FIRST });
    }, [transactionFetcher]);

    return (
        <Box direction="column" className={classNameWrap}>
            <Box className={classes.header} alignItems="center" justifyContent="space-between">
                <TableHeaderList
                    list={tables}
                    active={Tables.Transactions}
                    diff={diff}
                />
                {!!selectedAddress && <FilterForm onSubmit={onSubmit} />}
            </Box>
            {!transactionFetcher.skip ? (
                <Table
                    <Columns>
                    pageIndex={transactionFetcher?.pageIndex}
                    columns={columns}
                    diff={activeDiffIndexesMemoCompare}
                    data={data}
                    pageCount={pageCount}
                    pageSize={transactionFetcher?.pageSize}
                    onPageChange={transactionFetcher?.onChangePage}
                    onChangePageSize={transactionFetcher?.onChangePageSize}
                    spinnerProps={spinnerProps}
                    loading={transactionFetcher?.loading}
                    error={transactionFetcher?.error ? 'Error' : ''}
                    noDataMessage={transactionFetcher?.noDataMessage}
                    called
                    styles={styles}
                    showLoader
                    isUseCursor
                />
            ) : <NoAccountBlock message={transactionFetcher.skip?.message} />}
        </Box>
    );
});
