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
    } = order || {};
    return {
        list: [
            {
                key: 'Id',
                value: address,
            },
            {
                key: 'File',
                value: '',
            },
            {
                key: 'Total Deposit',
                value: '',
            },
            {
                key: 'Unspent Deposit',
                value: '',
            },
            {
                key: 'Status',
                value: <StatusBar status={orderInfoSdk?.status as OrderStatus} />,
            },
            {
                key: 'Status information',
                value: '',
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
    } = order || {};
    if (!teeOfferInfo) return null;
    const { name, description } = teeOfferInfo || {};
    return {
        title: 'TEE',
        list: [
            {
                key: 'Id',
                value: '',
            },
            {
                key: 'Provider',
                value: consumer || '-',
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
                value: '',
            },
            {
                key: 'Actual cost:',
                value: '',
            },
        ],
    };
};
