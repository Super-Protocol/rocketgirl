import {
    memo, FC, useMemo, useEffect,
} from 'react';

import { Order, SubOrdersDocument } from '@/gql/graphql';
import { useTableQueryFetcher } from '@/common/hooks';
import { useTablesSubscriptions } from '@/views/Home/hooks';
import { Tables } from '@/views/Home/types';
import { Table, Box } from '@/uikit';
import { SubOrdersTableProps, Columns } from './types';
import { spinnerProps, styles, getSubOrdersList } from './helpers';
import { getColumns } from './columns';
import classes from './SubOrdersTable.module.scss';

export const SubOrdersTable: FC<SubOrdersTableProps> = memo(({
    id, setAddressSuborders, classNameWrap, selectedAddress,
}) => {
    const orders = useTableQueryFetcher<Order>({
        gql: SubOrdersDocument,
        queryOptions: { variables: { pagination: { sortBy: 'origins.modifiedDate' }, filter: { parentOrder: id } } },
        subscriptionKey: 'id',
    });
    useTablesSubscriptions({ [Tables.Orders]: orders } as any, selectedAddress);
    const columns = useMemo(() => getColumns(), []);
    const data = useMemo(() => (orders?.list ? orders?.list : []), [orders]);
    const pageCount = useMemo(() => orders?.pageCount || 0, [orders]);

    useEffect(() => {
        if (orders?.list?.length) {
            setAddressSuborders(getSubOrdersList(orders.list));
        }
    }, [orders, setAddressSuborders]);

    return (
        <Box direction="column" className={classNameWrap}>
            <Box className={classes.title}>Suborders</Box>
            <Table
                <Columns>
                pageIndex={orders?.pageIndex}
                columns={columns}
                data={data}
                pageCount={pageCount}
                pageSize={orders?.pageSize}
                onPageChange={orders?.onChangePage}
                onChangePageSize={orders?.onChangePageSize}
                spinnerProps={spinnerProps}
                loading={orders?.loading}
                error={orders?.error ? 'Error' : ''}
                noDataMessage={orders?.noDataMessage}
                called
                styles={styles}
                showLoader
                isUseCursor
            />
        </Box>
    );
});
