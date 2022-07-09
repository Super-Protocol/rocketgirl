import { ColumnProps } from 'react-table';
import { Order, TOfferType } from '@/gql/graphql';
import { CopyToClipboard, TextCounter } from '@/uikit';
import { UseTableQueryFetcherResultList } from '@/common/hooks/useTableQueryFetcher';
import { StatusBar } from '@/common/components/StatusBar';
import { getTableDate } from '@/common/helpers';

export type OrdersColumns = UseTableQueryFetcherResultList<Order>;
export interface GetColumnsProps {
    urlBack: string;
}

const getCellValueOffer = (row, offerTypeProp, sortByMain?: boolean) => {
    const { subOrders } = row?.original || {};
    const filteredOffers = (subOrders || []).reverse()
        .filter(({ offerType }) => offerType === offerTypeProp);
    const sortedOffers = sortByMain
        ? filteredOffers
            .sort((a, b) => {
                const aIncludes = !a?.offerInfo?.restrictions?.types?.includes(offerTypeProp);
                const bIncludes = !b?.offerInfo?.restrictions?.types?.includes(offerTypeProp);
                return Number(aIncludes) - Number(bIncludes);
            })
        : filteredOffers;
    const offers = sortedOffers.map(({ offerInfo }) => ({ name: offerInfo?.name }));
    if (!offers.length) return '-';
    return <TextCounter list={offers} />;
};

export const getColumns = ({ urlBack }: GetColumnsProps): Array<ColumnProps<OrdersColumns>> => [
    {
        Header: 'ID',
        id: 'id',
        width: 'auto',
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
            const { teeOfferInfo } = row.original || {};
            if (!teeOfferInfo) return '-';
            return <TextCounter list={[teeOfferInfo]} />;
        },
    },
    {
        Header: 'Solutions',
        id: 'solutions',
        width: 'auto',
        Cell: ({ row }) => getCellValueOffer(row, TOfferType.Solution, true),
    },
    {
        Header: 'Data',
        id: 'data',
        width: 'auto',
        Cell: ({ row }) => getCellValueOffer(row, TOfferType.Data),
    },
    {
        Header: 'Storage',
        id: 'storage',
        width: 'auto',
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
        width: 'auto',
        isEllipsis: true,
    },
    {
        Header: 'Total Deposit, TEE',
        id: 'totalDeposit',
        Cell: ({ row }) => {
            const { orderHoldDeposit } = row.original || {};
            return typeof orderHoldDeposit === 'number' ? orderHoldDeposit : '-';
        },
        width: 'auto',
    },
    {
        Header: 'Unspent Deposit, TEE',
        id: 'unspentDeposit',
        Cell: ({ row }) => {
            const { orderHoldDeposit, depositSpent } = row.original || {};
            return typeof orderHoldDeposit === 'number'
                ? orderHoldDeposit - Number(depositSpent)
                : '-';
        },
        width: 'auto',
    },
    {
        Header: 'Modified Date',
        id: 'modifiedDate',
        Cell: ({ row }) => {
            const { origins } = row.original || {};
            const { modifiedDate } = origins || {};
            if (!modifiedDate) return '-';
            return getTableDate(modifiedDate);
        },
        width: 'auto',
    },
];
