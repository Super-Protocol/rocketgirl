import React from 'react';
import { ColumnProps } from 'react-table';
import { Order } from '@/gql/graphql';
import { CopyToClipboard } from '@/uikit';
import { UseTableQueryFetcherResultList } from '@/common/hooks/useTableQueryFetcher';
import { StatusBar } from '@/common/components/StatusBar';
import { getOfferTypeName, getTableDate } from '@/common/helpers';
import { TooltipLink } from '@/common/components/TooltipLink';

export type OrdersColumns = UseTableQueryFetcherResultList<Order>;

export const getColumns = (): Array<ColumnProps<OrdersColumns>> => [
    {
        Header: 'ID',
        id: 'id',
        width: 'auto',
        Cell: ({ row }) => {
            const { address } = row.original || {};
            if (!address) return '-';
            return (
                <CopyToClipboard>
                    {address}
                </CopyToClipboard>
            );
        },
    },
    {
        Header: 'Provider',
        id: 'provider',
        Cell: ({ row }) => {
            const { providerInfo } = row.original;
            if (!providerInfo?.actionAccount) return '-';
            return <CopyToClipboard title={providerInfo?.name}>{providerInfo?.actionAccount}</CopyToClipboard>;
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
        Header: 'Name',
        id: 'name',
        Cell: ({ row }) => {
            const { offerInfo, teeOfferInfo } = row.original || {};
            const name = offerInfo?.name || teeOfferInfo?.name;
            return name || '-';
        },
        width: 'auto',
        isEllipsis: true,
    },
    {
        Header: 'Description',
        id: 'description',
        Cell: ({ row }) => {
            const { offerInfo, teeOfferInfo } = row.original || {};
            const description = offerInfo?.description || teeOfferInfo?.description;
            return description ? <TooltipLink text={description} /> : '-';
        },
        width: 'auto',
        isEllipsis: true,
    },
    {
        Header: 'Cancellable',
        id: 'cancellable',
        Cell: ({ row }) => {
            const { offerInfo } = row.original || {};
            const { cancelable } = offerInfo || {};
            return typeof cancelable === 'boolean' ? cancelable ? 'yes' : 'no' : '-';
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
            return status ? <StatusBar status={status} /> : '-';
        },
        width: 'auto',
        isEllipsis: true,
    },
    {
        Header: 'Estimated cost',
        id: 'estimatedCost',
        Cell: ({ row }) => {
            const { orderHoldDeposit } = row.original || {};
            return orderHoldDeposit || '-';
        },
        width: 'auto',
        isEllipsis: true,
    },
    {
        Header: 'Actual cost',
        id: 'actualCost',
        Cell: ({ row }) => {
            const { depositSpent } = row.original || {};
            return depositSpent || '-';
        },
        width: 'auto',
        isEllipsis: true,
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
