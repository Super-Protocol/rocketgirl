import { ColumnProps } from 'react-table';
import { TeeOffer } from '@/gql/graphql';
import { CopyToClipboard } from '@/uikit';
import { getTableDate } from '@/views/Home/Content/MainTable/helpers';
import { UseTableQueryFetcherResultList } from '@/common/hooks/useTableQueryFetcher';
import { getOfferTypeName } from '@/common/helpers';

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
        Cell: ({ row }) => row.original?.teeOfferInfo?.description || '-',
        width: 'auto',
        isEllipsis: true,
    },
    // todo Total Cores, Free Cores, Orders in queue
    {
        Header: 'ModifiedDate',
        id: 'modifiedDate',
        Cell: ({ row }) => getTableDate(row.original?.origins?.modifiedDate / 1000),
        width: 'auto',
    },
];
