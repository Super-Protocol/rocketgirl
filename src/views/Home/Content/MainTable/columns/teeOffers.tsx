import { ColumnProps } from 'react-table';
import { TeeOffer } from '@/gql/graphql';
import { CopyToClipboard, HtmlBox } from '@/uikit';
import { getTableDate } from '@/views/Home/Content/MainTable/helpers';
import { UseTableQueryFetcherResultList } from '@/common/hooks/useTableQueryFetcher';

export type TeeOffersColumns = UseTableQueryFetcherResultList<TeeOffer>;

export const getColumns = (): Array<ColumnProps<TeeOffersColumns>> => [
    {
        Header: 'Provider',
        id: 'provider',
        Cell: ({ row }) => {
            const { providerAddress, providerInfo } = row.original || {};
            const { name } = providerInfo || {};
            if (!providerAddress) return '-';
            return <CopyToClipboard title={name}>{providerAddress}</CopyToClipboard>;
        },
        width: 'auto',
    },
    {
        Header: 'Id',
        id: 'id',
        Cell: ({ row }) => (row.original?.address ? <CopyToClipboard>{row.original?.address}</CopyToClipboard> : '-'),
        width: 'auto',
    },
    {
        Header: 'Name',
        id: 'name',
        Cell: ({ row }) => row.original?.teeOfferInfo?.name || '-',
        width: 'auto',
        isEllipsis: true,
    },
    // todo add link support, add tooltip support
    {
        Header: 'Description',
        id: 'description',
        Cell: ({ row }) => {
            const { description } = row.original?.teeOfferInfo || {};
            return description ? <HtmlBox text={description} /> : '-';
        },
        width: 'auto',
        isEllipsis: true,
    },
    {
        Header: 'Total Cores',
        id: 'slots',
        Cell: ({ row }) => row.original?.teeOfferInfo?.slots || '-',
        width: 'auto',
        isEllipsis: true,
    },
    {
        Header: 'Free Cores',
        id: 'freeCores',
        Cell: ({ row }) => row.original?.stats?.freeCores || '-',
        width: 'auto',
        isEllipsis: true,
    },
    {
        Header: 'Orders in queue',
        id: 'ordersInQueue',
        Cell: ({ row }) => row.original?.stats?.ordersInQueue || '-',
        width: 'auto',
        isEllipsis: true,
    },
    {
        Header: 'ModifiedDate',
        id: 'modifiedDate',
        Cell: ({ row }) => getTableDate(row.original?.origins?.modifiedDate / 1000),
        width: 'auto',
    },
];
