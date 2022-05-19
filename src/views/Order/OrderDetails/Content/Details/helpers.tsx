import { ReactNode } from 'react';
import { OrderStatus } from '@super-protocol/sp-sdk-js';
import { StatusBar } from '@/common/components/StatusBar';
import { OrderQuery } from '@/gql/graphql';
import { getTableDate } from '@/common/helpers';

export type OrderInfo = {
    key: string;
    value: string | number | ReactNode;
};

export const getOrderInfo = (order?: OrderQuery['order']): OrderInfo[] | null => {
    if (!order) return [];
    const { address, orderInfo, origins } = order || {};
    return [
        {
            key: 'Id',
            value: address,
        }, {
            key: 'File',
            value: '',
        }, {
            key: 'Total Deposit',
            value: '',
        }, {
            key: 'Unspent Deposit',
            value: '',
        }, {
            key: 'Status',
            value: <StatusBar status={orderInfo?.status as OrderStatus} />,
        }, {
            key: 'Status information',
            value: '',
        }, {
            key: 'Modified Date',
            value: getTableDate(origins?.modifiedDate),
        },
    ];
};

export const getOrderTee = (order?: OrderQuery['order']): OrderInfo[] | null => {
    if (!order) return null;
    const { teeOfferInfo } = order || {};
    if (!teeOfferInfo) return null;
    return [
        {
            key: 'Id',
            value: '',
        }, {
            key: 'Provider',
            value: '',
        }, {
            key: 'Name',
            value: teeOfferInfo?.name || '-',
        }, {
            key: 'Description',
            value: teeOfferInfo?.description || '-',
        }, {
            key: 'Estimated cost',
            value: '',
        }, {
            key: 'Actual cost:',
            value: '',
        },
    ];
};
