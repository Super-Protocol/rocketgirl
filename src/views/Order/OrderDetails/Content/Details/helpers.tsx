import { ReactNode } from 'react';
import { OrderStatus } from '@super-protocol/sp-sdk-js';
import { StatusBar } from '@/common/components/StatusBar';
import { OrderQuery } from '@/gql/graphql';
import { CopyToClipboard } from '@/uikit';
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

export const getStatusInformation = (orderResult: OrderQuery['order']['orderResult']): ReactNode => {
    if (!orderResult) return '-';
    const text = orderResult?.encryptedResult || orderResult?.encryptedError;
    if (!text) return '-';
    return (
        <CopyToClipboard isEllipsis>
            {text}
        </CopyToClipboard>
    );
};

export const getInfo = (order?: OrderQuery['order'], orderInfoSdk?: GetOrderInfoResult): TableInfo | null => {
    if (!order) return null;
    const {
        address,
        origins,
        orderHoldDeposit,
        orderResult,
        depositSpent,
    } = order || {};
    const {
        status,
    } = orderInfoSdk || {};
    const statusInformation = getStatusInformation(orderResult);
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
                value: typeof orderHoldDeposit === 'number' ? orderHoldDeposit : '-',
            },
            {
                key: 'Unspent Deposit',
                value: typeof orderHoldDeposit === 'number' && typeof depositSpent === 'number'
                    ? orderHoldDeposit - depositSpent
                    : '-',
            },
            {
                key: 'Status',
                value: <StatusBar status={status as OrderStatus} />,
            },
            {
                key: 'Status information',
                value: statusInformation,
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
                value: typeof orderHoldDeposit === 'number' ? orderHoldDeposit : '-',
            },
            {
                key: 'Actual cost',
                value: typeof depositSpent === 'number' ? depositSpent : '-',
            },
        ],
    };
};
