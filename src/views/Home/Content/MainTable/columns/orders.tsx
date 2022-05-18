import { ColumnProps } from 'react-table';
import { Order, TOfferType } from '@/gql/graphql';
import { CopyToClipboard, TextCounter } from '@/uikit';
import { UseTableQueryFetcherResultList } from '@/common/hooks/useTableQueryFetcher';
import { getTableDate } from '@/views/Home/Content/MainTable/helpers';
import { StatusBar } from '@/common/components/StatusBar';

export type OrdersColumns = UseTableQueryFetcherResultList<Order>;
export interface GetColumnsProps {
    urlBack: string;
}

const getCellValueOffer = (row, offerTypeProp) => {
    const { subOrders } = row?.original || {};
    const offers = (subOrders || [])
        .filter(({ offerType }) => offerType === offerTypeProp)
        .map(({ offerInfo }) => ({ name: offerInfo?.name }));
    if (!offers.length) return '-';
    return <TextCounter list={offers} />;
};

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
        Header: 'TEE',
        id: 'tee',
        Cell: ({ row }) => {
            const { subOrders } = row.original || {};
            const teeOffers = (subOrders || []).map(({ teeOfferInfo }) => ({ name: teeOfferInfo?.name }));
            if (!teeOffers.length) return '-';
            return <TextCounter list={teeOffers} />;
        },
    },
    {
        Header: 'Solutions',
        id: 'solutions',
        Cell: ({ row }) => getCellValueOffer(row, TOfferType.Solution),
    },
    {
        Header: 'Data',
        id: 'data',
        Cell: ({ row }) => getCellValueOffer(row, TOfferType.Data),
    },
    {
        Header: 'Storage',
        id: 'storage',
        Cell: ({ row }) => getCellValueOffer(row, TOfferType.Storage),
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
