import React, {
    memo,
    FC,
    useMemo,
    useCallback,
} from 'react';
import { PageClick } from '@/uikit/Table/TablePagination/types';
import CONFIG from '@/config';
import { SubOrdersDocument } from '@/gql/graphql'; // todo
import { useTableQueryFetcher } from '@/common/hooks/useTableQueryFetcher';
import { Table, Box } from '@/uikit';
import { TransactionsProps, Columns } from './types';
import { getFilters, spinnerProps, styles } from './helpers';
import { getColumns } from './columns';
import classes from './Transactions.module.scss';
import { FilterForm } from './Filter';
import { Filter } from './Filter/FilterForm/types';

export const Transactions: FC<TransactionsProps> = memo(({ classNameWrap }) => {
    const transactions = useTableQueryFetcher({
        gql: SubOrdersDocument, // todo change query
        queryOptions: { variables: { pagination: { sortBy: 'origins.modifiedDate' } } },
    });
    const onClickTxnHash = useCallback((id?: string) => {
        if (!id) return;
        window.open(`${CONFIG.REACT_APP_POLYGON_SCAN}/${id}`, '_blank');
    }, []);
    const columns = useMemo(() => getColumns({ onClickTxnHash }), [onClickTxnHash]);
    const data = useMemo(() => (transactions?.list ? transactions?.list : []), [transactions]);
    const pageCount = useMemo(() => transactions?.pageCount || 0, [transactions]);
    const onSubmit = useCallback((filter: Filter) => {
        transactions?.onChangePage({ filter: getFilters(filter?.values), pageClick: PageClick.FIRST });
    }, [transactions]);

    return (
        <Box direction="column" className={classNameWrap}>
            <Box className={classes.header} alignItems="center" justifyContent="space-between">
                <Box className={classes.title}>Transactions</Box>
                <FilterForm onSubmit={onSubmit} />
            </Box>
            <Table
                <Columns>
                pageIndex={transactions?.pageIndex}
                columns={columns}
                data={data}
                pageCount={pageCount}
                pageSize={transactions?.pageSize}
                onPageChange={transactions?.onChangePage}
                onChangePageSize={transactions?.onChangePageSize}
                spinnerProps={spinnerProps}
                loading={transactions?.loading}
                error={transactions?.error ? 'Error' : ''}
                noDataMessage={transactions?.noDataMessage}
                called
                styles={styles}
                showLoader
                isUseCursor
            />
        </Box>
    );
});
