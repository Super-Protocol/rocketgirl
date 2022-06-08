import React from 'react';
import { ColumnProps } from 'react-table';
import { TeeOffer } from '@/gql/graphql';
import { CopyToClipboard } from '@/uikit';
import { UseTableQueryFetcherResultList } from '@/common/hooks/useTableQueryFetcher';
import { TooltipLink } from '@/common/components/TooltipLink';
import { getTableDate } from '@/common/helpers';

export type TeeOffersColumns = UseTableQueryFetcherResultList<TeeOffer>;

export const getColumns = (): Array<ColumnProps<TeeOffersColumns>> => [
    {
        Header: 'ID',
        id: 'id',
        Cell: ({ row }) => (row.original?.address || '-'),
        width: 'auto',
    },
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
        Header: 'Name',
        id: 'name',
        Cell: ({ row }) => row.original?.teeOfferInfo?.name || '-',
        width: 'auto',
        isEllipsis: true,
    },
    // todo add link support
    {
        Header: 'Description',
        id: 'description',
        Cell: ({ row }) => {
            const { description } = row.original?.teeOfferInfo || {};
            return description ? <TooltipLink text={description} /> : '-';
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
        Header: 'Modified Date',
        id: 'modifiedDate',
        Cell: ({ row }) => getTableDate(row.original?.origins?.modifiedDate),
        width: 'auto',
    },
];
