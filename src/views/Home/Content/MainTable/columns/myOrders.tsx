import { ColumnProps } from 'react-table';
import { Order } from '@/gql/graphql';
import { CopyToClipboard } from '@/uikit';
import { UseTableQueryFetcherResultList } from '@/common/hooks/useTableQueryFetcher';
import { getOrderStatusName } from '@/common/helpers';
import { getTableDate } from '@/views/Home/Content/MainTable/helpers';

export type OrdersColumns = UseTableQueryFetcherResultList<Order>;

export const getColumns = (): Array<ColumnProps<OrdersColumns>> => [
    // {
    //     Header: 'Consumer',
    //     id: 'consumer',
    //     Cell: ({ row }) => {
    //         const { consumer } = row.original || {};
    //         if (!consumer) return '-';
    //         return <CopyToClipboard title={cache.providers.get(consumer)}>{consumer}</CopyToClipboard>;
    //     },
    //     width: 'auto',
    // },
    {
        Header: 'Offer',
        id: 'offer',
        Cell: ({ row }) => {
            const { offerInfo, teeOfferInfo, orderInfo } = row.original || {};
            const offerAddress = orderInfo?.offer;
            const name = offerInfo?.name || teeOfferInfo?.name;
            return (
                offerAddress
                    ? <CopyToClipboard title={name}>{offerAddress}</CopyToClipboard>
                    : '-'
            );
        },
        width: 'auto',
    },
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
        Header: 'Args',
        id: 'args',
        Cell: ({ row }) => {
            const { orderInfo } = row.original || {};
            const { encryptedArgs } = orderInfo || {};
            if (!encryptedArgs) return '-';
            return <CopyToClipboard>{encryptedArgs}</CopyToClipboard>;
        },
        width: 'auto',
        isEllipsis: true,
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
        Header: 'Parent',
        id: 'parent',
        Cell: ({ row }) => {
            const { parentOrder } = row.original || {};
            const { offerName, orderAddress } = parentOrder || {};
            if (!orderAddress) return '-';
            return <CopyToClipboard title={offerName}>{orderAddress}</CopyToClipboard>;
        },
        width: 'auto',
        isEllipsis: true,
    },
    {
        Header: 'Result',
        id: 'result',
        Cell: ({ row }) => {
            const { orderResult } = row.original || {};
            const { encryptedResult } = orderResult || {};
            if (!encryptedResult) return '-';
            return <CopyToClipboard>{encryptedResult}</CopyToClipboard>;
        },
        width: 'auto',
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
