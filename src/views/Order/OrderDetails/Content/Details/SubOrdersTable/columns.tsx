import Web3 from 'web3';
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
        width: 100,
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
            const { providerInfo } = row.original || {};
            if (!providerInfo?.actionAccount) return '-';
            const { name, actionAccount } = providerInfo || {};
            return (
                <CopyToClipboard title={name} canShowTooltip={{ title: 'Provider' }}>
                    {actionAccount}
                </CopyToClipboard>
            );
        },
        width: 162,
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
            return name ? <TooltipLink text={name} title="Name" checkOverflow /> : '-';
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
            return description ? <TooltipLink text={description} title="Description" checkOverflow /> : '-';
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
        Header: 'Estimated cost, TEE',
        id: 'estimatedCost',
        Cell: ({ row }) => {
            const { orderHoldDeposit } = row.original || {};
            return orderHoldDeposit && typeof orderHoldDeposit === 'number'
                ? (Math.round(Number(Web3.utils.fromWei(orderHoldDeposit.toString())) * 1000) / 1000).toFixed(3)
                : '-';
        },
        width: 'auto',
    },
    {
        Header: 'Actual cost, TEE',
        id: 'actualCost',
        Cell: ({ row }) => {
            const { depositSpent } = row.original || {};
            return depositSpent && typeof depositSpent === 'number'
                ? (Math.round(Number(Web3.utils.fromWei(depositSpent.toString())) * 1000) / 1000).toFixed(3)
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
