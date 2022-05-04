import { ColumnProps } from 'react-table';
import { Order } from '@/gql/graphql';
import { CopyToClipboard } from '@/uikit';
import { UseTableQueryFetcherResultList } from '@/common/hooks/useTableQueryFetcher';
import { getOrderStatusName } from '@/common/helpers';
import { getTableDate } from '@/views/Home/Content/MainTable/helpers';

export type OrdersColumns = UseTableQueryFetcherResultList<Order>;

export const getColumns = (): Array<ColumnProps<OrdersColumns>> => [
    {
        Header: 'Id',
        id: 'id',
        Cell: ({ row }) => {
            const { address } = row.original || {};
            if (!address) return '-';
            return <CopyToClipboard>{address}</CopyToClipboard>;
        },
    },
    {
        Header: 'Status',
        id: 'status',
        Cell: ({ row }) => {
            const { orderInfo } = row.original || {};
            const { status } = orderInfo || {};
            return status ? getOrderStatusName(status) : '-';
        },
        width: 100,
        isEllipsis: true,
    },
    {
        Header: 'ModifiedDate',
        id: 'modifiedDate',
        Cell: ({ row }) => {
            const { origins } = row.original || {};
            const { modifiedDate } = origins || {};
            if (!modifiedDate) return '-';
            return getTableDate(modifiedDate / 1000);
        },
        width: 'auto',
    },
];
