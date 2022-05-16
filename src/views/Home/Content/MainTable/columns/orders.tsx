import { ColumnProps } from 'react-table';
import { Order } from '@/gql/graphql';
import { CopyToClipboard } from '@/uikit';
import { UseTableQueryFetcherResultList } from '@/common/hooks/useTableQueryFetcher';
import { getTableDate } from '@/views/Home/Content/MainTable/helpers';
import { StatusBar } from '@/common/components/StatusBar';

export type OrdersColumns = UseTableQueryFetcherResultList<Order>;
export interface GetColumnsProps {
    urlBack: string;
}

export const getColumns = ({ urlBack }: GetColumnsProps): Array<ColumnProps<OrdersColumns>> => [
    {
        Header: 'ID',
        id: 'id',
        Cell: ({ row }) => {
            const { address } = row.original || {};
            if (!address) return '-';
            return (
                <CopyToClipboard url={`order/${address}?${urlBack}`}>
                    {address}
                </CopyToClipboard>
            );
        },
    },
    {
        Header: 'Status',
        id: 'status',
        Cell: ({ row }) => {
            const { orderInfo } = row.original || {};
            const { status } = orderInfo || {};
            return status ? <StatusBar status={status} /> : '-';
        },
        width: 100,
        isEllipsis: true,
    },
    {
        Header: 'Modified Date',
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
