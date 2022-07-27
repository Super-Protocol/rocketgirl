import {
    memo, FC, useMemo,
} from 'react';
import { Table, Box } from '@/uikit';
import { SubOrdersTableProps, Columns } from './types';
import { spinnerProps, styles } from './helpers';
import { getColumns } from './columns';
import classes from './SubOrdersTable.module.scss';

export const SubOrdersTable: FC<SubOrdersTableProps> = memo(({
    classNameWrap, orders,
}) => {
    const columns = useMemo(() => getColumns(), []);
    const data = useMemo(() => (orders?.list ? orders?.list : []), [orders]);
    const pageCount = useMemo(() => orders?.pageCount || 0, [orders]);

    if (!data?.length) return null;

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
