import React from 'react';
import { ColumnProps } from 'react-table';
import { CopyToClipboard } from '@/uikit';
import { TooltipLink } from '@/common/components/TooltipLink';
import { getOfferTypeName, getTableDate } from '@/common/helpers';
import { UseTableQueryFetcherResultList } from '@/common/hooks/useTableQueryFetcher';
import { Offer } from '@/gql/graphql';

export type OffersColumns = UseTableQueryFetcherResultList<Offer>;

export const getColumns = (): Array<ColumnProps<OffersColumns>> => [
    {
        Header: 'ID',
        id: 'id',
        Cell: ({ row }) => row.original?.address || '-',
        width: 'auto',
    },
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
        Header: 'Name',
        id: 'name',
        Cell: ({ row }) => {
            const { name } = row.original?.offerInfo || {};
            return name ? <TooltipLink text={name} title="Name" checkOverflow /> : '-';
        },
        width: 'auto',
    },
    // todo add link support
    {
        Header: 'Description',
        id: 'description',
        Cell: ({ row }) => {
            const { description } = row.original?.offerInfo || {};
            return description ? <TooltipLink text={description} title="Description" checkOverflow /> : '-';
        },
        width: 'auto',
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
        Cell: ({ row }) => {
            const { offerInfo } = row.original;
            const { cancelable } = offerInfo || [];
            return typeof cancelable === 'boolean' ? cancelable ? 'yes' : 'no' : '-';
        },
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
