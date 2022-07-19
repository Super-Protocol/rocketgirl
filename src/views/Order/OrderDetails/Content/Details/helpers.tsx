import { ReactNode } from 'react';

import { OrderStatus } from '@super-protocol/sp-sdk-js';
import { CopyToClipboard } from '@/uikit';
import { StatusBarToolkit } from '@/common/components/';
import { OrderQuery } from '@/gql/graphql';
import { getTableDate } from '@/common/helpers';
import { GetOrderSdk } from '@/connectors/orders';
import { SubOrderInfo } from './types';

export interface TableInfoItem {
    key: string;
    value: string | number | ReactNode;
}

export interface TableInfo {
    title?: string;
    list: TableInfoItem[];
}

export const getUnspentDeposit = (orderHoldDepositSdk?: string | number, depositSpentSdk?: string): number | null => {
    const diff = Number(orderHoldDepositSdk) - Number(depositSpentSdk);
    return Number.isNaN(diff) ? null : diff;
};

const getSubOrdersDeposit = (addressSuborders?: SubOrderInfo): number => {
    return addressSuborders
        ? Object.values(addressSuborders).reduce((acc: number, item) => (acc + item.orderHoldDeposit), 0)
        : 0;
};

export const getInfo = (
    order?: OrderQuery['order'],
    orderSdk?: GetOrderSdk,
    addressSuborders?: SubOrderInfo,
): TableInfo | null => {
    if (!order) return null;
    const {
        id,
        origins,
        orderResult,
        orderInfo,
    } = order || {};
    const {
        orderInfo: orderInfoSdk,
        depositSpent: depositSpentSdk,
        orderHoldDeposit: orderHoldDepositSdk,
    } = orderSdk || {};
    const { status: statusSdk } = orderInfoSdk || {};
    const { encryptedArgs } = orderInfo || {};
    const unspentDeposit = getUnspentDeposit(orderHoldDepositSdk, depositSpentSdk);
    const subOrdersDeposit = getSubOrdersDeposit(addressSuborders);
    return {
        list: [
            {
                key: 'Id',
                value: id,
            },
            {
                key: 'File',
                value: encryptedArgs ? 'Encrypted file' : '-',
            },
            {
                key: 'Total Deposit',
                value: orderHoldDepositSdk
                    ? (Math.round((orderHoldDepositSdk + subOrdersDeposit) * 1000) / 1000).toFixed(3)
                    : '-',
            },
            {
                key: 'Unspent Deposit',
                value: typeof unspentDeposit === 'number'
                    ? (Math.round(unspentDeposit * 1000) / 1000).toFixed(3)
                    : '-',
            },
            {
                key: 'Status',
                value: <StatusBarToolkit status={statusSdk as OrderStatus} />,
            },
            {
                key: 'Status information',
                value: orderResult?.encryptedResult || orderResult?.encryptedError ? 'Result is ready' : '-',
            },
            {
                key: 'Modified Date',
                value: getTableDate(origins?.modifiedDate),
            },
        ],
    };
};

export const getTee = (order?: OrderQuery['order'], orderSdk?: GetOrderSdk): TableInfo | null => {
    if (!order) return null;
    const {
        teeOfferInfo,
        orderInfo,
        providerInfo,
    } = order || {};
    if (!teeOfferInfo) return null;
    const { name, description } = teeOfferInfo || {};
    const { offer } = orderInfo || {};
    const {
        orderHoldDeposit: orderHoldDepositSdk,
        depositSpent: depositSpentSdk,
    } = orderSdk || {};
    return {
        title: 'TEE',
        list: [
            {
                key: 'Id',
                value: offer || '-',
            },
            {
                key: 'Provider',
                value: <CopyToClipboard title={providerInfo?.name}>{providerInfo?.actionAccount}</CopyToClipboard>,
            },
            {
                key: 'Name',
                value: name || '-',
            },
            {
                key: 'Description',
                value: description || '-',
            },
            {
                key: 'Estimated cost',
                value: orderHoldDepositSdk
                    ? (Math.round(orderHoldDepositSdk * 1000) / 1000).toFixed(3)
                    : '-',
            },
            {
                key: 'Actual cost',
                value: depositSpentSdk
                    ? (Math.round(Number(depositSpentSdk) * 1000) / 1000).toFixed(3)
                    : '-',
            },
        ],
    };
};

export const getOrdersCancelList = (addressSuborders?: SubOrderInfo): string[] => (
    addressSuborders
        ? Object.entries(addressSuborders).reduce((acc: string[], [k, v]) => (
            v.cancellable ? [...acc, k] : acc
        ), [])
        : []
);
