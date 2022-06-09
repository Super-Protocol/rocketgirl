import { ReactNode } from 'react';
import { OrderStatus } from '@super-protocol/sp-sdk-js';
import { StatusBar } from '@/common/components/StatusBar';
import { OrderQuery } from '@/gql/graphql';
import { getTableDate } from '@/common/helpers';
import { GetOrderInfoResult } from '@/connectors/orders';

export interface TableInfoItem {
    key: string;
    value: string | number | ReactNode;
}

export interface TableInfo {
    title?: string;
    list: TableInfoItem[];
}

export const getInfo = (order?: OrderQuery['order'], orderInfoSdk?: GetOrderInfoResult): TableInfo | null => {
    if (!order) return null;
    const {
        address,
        origins,
        orderHoldDeposit,
        orderResult,
        depositSpent,
        orderInfo,
    } = order || {};
    const {
        status,
    } = orderInfoSdk || {};
    const { encryptedArgs } = orderInfo || {};
    return {
        list: [
            {
                key: 'Id',
                value: address,
            },
            {
                key: 'File',
                value: encryptedArgs ? 'Encrypted file' : '-',
            },
            {
                key: 'Total Deposit',
                value: typeof orderHoldDeposit === 'number' ? orderHoldDeposit : '-',
            },
            {
                key: 'Unspent Deposit',
                value: typeof orderHoldDeposit === 'number'
                    ? orderHoldDeposit - Number(depositSpent)
                    : '-',
            },
            {
                key: 'Status',
                value: <StatusBar status={status as OrderStatus} />,
            },
            {
                key: 'Status information',
                value: orderResult?.encryptedResult ? 'Result is ready' : '-',
            },
            {
                key: 'Modified Date',
                value: getTableDate(origins?.modifiedDate),
            },
        ],
    };
};

export const getTee = (order?: OrderQuery['order']): TableInfo | null => {
    if (!order) return null;
    const {
        teeOfferInfo,
        consumer,
        orderInfo,
        orderHoldDeposit,
        depositSpent,
    } = order || {};
    if (!teeOfferInfo) return null;
    const { name, description } = teeOfferInfo || {};
    const { offer } = orderInfo || {};
    return {
        title: 'TEE',
        list: [
            {
                key: 'Id',
                value: offer || '-',
            },
            {
                key: 'Provider',
                value: consumer || '-', // todo change to provider
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
                value: orderHoldDeposit || '-',
            },
            {
                key: 'Actual cost',
                value: depositSpent || '-',
            },
        ],
    };
};
