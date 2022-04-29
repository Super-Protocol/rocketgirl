import {
    memo, FC, useMemo, useCallback,
} from 'react';
// import { useHistory } from 'react-router-dom';
import { Table } from '@/uikit';
// import { useGoBackUrl } from '@/common/hooks/useGoBackUrl';
import CONFIG from '@/config';
import { Tables } from '@/views/Home/types';
import {
    TransactionsTableProps, Columns,
} from './types';
import { getFilteredData } from './helpers';
import { getColumns } from './columns';

export const TransactionsTable: FC<TransactionsTableProps> = memo(({ search, fetcher }) => {
    // const history = useHistory();
    // const backUrl = useGoBackUrl();
    const onClickTxnHash = useCallback((id) => {
        window.open(`${CONFIG.REACT_APP_POLYGON_SCAN}/${id}`, '_blank');
        // history.push(`/transaction-view/${id}?${backUrl}`);
    }, []);
    const transactionsFetcher = useMemo(() => fetcher[Tables.Transactions], [fetcher]);
    const columns = useMemo(() => getColumns({ onClickTxnHash }), [onClickTxnHash]);
    const loading = useMemo(() => transactionsFetcher?.query?.isFetching, [transactionsFetcher]);
    const error = useMemo(() => (transactionsFetcher?.query?.isError ? 'Error' : ''), [transactionsFetcher]);
    const data = useMemo(() => (transactionsFetcher?.query?.data || []) as Columns[], [transactionsFetcher]);
    const filteredData = useMemo(() => getFilteredData(data, search), [data, search]);
    return (
        <Table
            <Columns>
            columns={columns}
            data={filteredData}
            spinnerProps={useMemo(() => ({ fullscreen: true }), [])}
            loading={loading}
            called
            error={error}
            showLoader={false}
        />
    );
});
