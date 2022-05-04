import { ColumnProps } from 'react-table';
import { CopyToClipboard, Ellipsis } from '@/uikit';
import { getOfferTypeName, getOfferGroupName } from '@/common/helpers';
import { getTableDate } from '@/views/Home/Content/MainTable/helpers';
import { UseTableQueryFetcherResultList } from '@/common/hooks/useTableQueryFetcher';
import { Offer } from '@/gql/graphql';

export type OffersColumns = UseTableQueryFetcherResultList<Offer>;

export const getColumns = (): Array<ColumnProps<OffersColumns>> => [
    {
        Header: 'Provider',
        id: 'provider',
        Cell: ({ row }) => {
            const { providerInfo } = row.original;
            const { actionAccount, name } = providerInfo || {};
            if (!actionAccount) return '-';
            return <CopyToClipboard title={name}>{actionAccount}</CopyToClipboard>;
        },
        width: 'auto',
    },
    {
        Header: 'Id',
        id: 'id',
        Cell: ({ row }) => <CopyToClipboard>{row.original?.address || '-'}</CopyToClipboard>,
        width: 'auto',
    },
    {
        Header: 'Name',
        id: 'name',
        Cell: ({ row }) => row.original?.offerInfo?.name || '-',
        width: 'auto',
        isEllipsis: true,
    },
    // todo add link support, add tooltip support
    {
        Header: 'Description',
        id: 'description',
        Cell: ({ row }) => row.original?.offerInfo?.description || '-',
        width: 'auto',
        isEllipsis: true,
    },
    {
        Header: 'Type',
        id: 'type',
        Cell: ({ row }) => {
            const { offerType } = row.original?.offerInfo || {};
            return getOfferTypeName(offerType) || '-';
        },
        width: 'auto',
        isEllipsis: true,
    },
    {
        Header: 'Cancelable',
        id: 'cancelable',
        Cell: ({ row }) => (
            typeof row.original?.offerInfo?.cancelable === 'boolean' ? `${row.original?.offerInfo?.cancelable}` : '-'
        ),
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
