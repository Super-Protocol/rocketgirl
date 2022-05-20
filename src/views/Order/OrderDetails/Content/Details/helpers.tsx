import { ReactNode } from 'react';
import { OrderStatus } from '@super-protocol/sp-sdk-js';
import { StatusBar } from '@/common/components/StatusBar';
import { OrderQuery } from '@/gql/graphql';
import { getTableDate } from '@/common/helpers';

export interface TableInfoItem {
    key: string;
    value: string | number | ReactNode;
}

export interface TableInfo {
    title?: string;
    list: TableInfoItem[];
}

export const getOrderInfo = (order?: OrderQuery['order']): TableInfo | null => {
    if (!order) return null;
    const {
        address,
        orderInfo,
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
                value: <StatusBar status={orderInfo?.status as OrderStatus} />,
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

export const getOrderOffer = (order?: OrderQuery['order']): TableInfo | null => {
    if (!order) return null;
    const {
        teeOfferInfo,
        offerInfo,
        consumer,
        offerType,
    } = order || {};
    if (!teeOfferInfo && !offerInfo) return null;
    const { name, description } = offerInfo || teeOfferInfo || {};
    return {
        title: offerType,
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
