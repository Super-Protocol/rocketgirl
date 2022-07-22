import { ReactNode } from 'react';
import { OrderStatus } from '@super-protocol/sp-sdk-js';
import { CopyToClipboard } from '@/uikit';
import { StatusBarToolkit } from '@/common/components/';
import { OrderQuery } from '@/gql/graphql';
import { BigNumber } from 'bignumber.js';
import {
    getFixedDeposit,
    getTableDate,
    getOrdersHoldDeposit,
    getOrdersUnspentDeposit,
} from '@/common/helpers';
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

export interface GetInfoProps {
    order?: OrderQuery['order'];
    orderSdk?: GetOrderSdk;
    subOrdersInfo?: SubOrderInfo;
    unspentDeposit?: BigNumber;
    totalDeposit?: BigNumber;
}

export interface GetUnspentDepositProps {
    orderHoldDeposit: string;
    depositSpent: string;
    subOrdersInfo: SubOrderInfo;
}

export interface GetTotalDepositProps {
    orderHoldDeposit: string;
    subOrdersInfo: SubOrderInfo;
}

export const getUnspentDeposit = ({ orderHoldDeposit, depositSpent, subOrdersInfo }: GetUnspentDepositProps): BigNumber => {
    return getOrdersUnspentDeposit(
        [{ orderHoldDeposit, depositSpent }]
            .concat(
                Object
                    .values(subOrdersInfo || {})
                    .reduce(
                        (acc, { orderHoldDeposit, depositSpent }) => {
                            return acc.concat({ orderHoldDeposit: orderHoldDeposit || '0', depositSpent: depositSpent || '0' });
                        },
                        [] as { orderHoldDeposit: string; depositSpent: string }[],
                    ),
            ),
    );
};

export const getTotalDeposit = ({ orderHoldDeposit, subOrdersInfo }: GetTotalDepositProps): BigNumber => {
    return getOrdersHoldDeposit(
        [{ orderHoldDeposit: `${orderHoldDeposit || '0'}` }]
            .concat(
                Object
                    .values(subOrdersInfo || {})
                    .reduce(
                        (acc, { orderHoldDeposit }) => (orderHoldDeposit ? acc.concat({ orderHoldDeposit }) : acc),
                        [] as { orderHoldDeposit: string }[],
                    ),
            ),
    );
};

export const getInfo = (props: GetInfoProps): TableInfo | null => {
    const {
        order,
        orderSdk,
        unspentDeposit,
        totalDeposit,
    } = props || {};
    if (!order) return null;
    const {
        id,
        origins,
        orderResult,
        orderInfo,
    } = order || {};
    const { orderInfo: orderInfoSdk } = orderSdk || {};
    const { status: statusSdk } = orderInfoSdk || {};
    const { encryptedArgs } = orderInfo || {};
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
                value: getFixedDeposit(totalDeposit),
            },
            {
                key: 'Unspent Deposit',
                value: getFixedDeposit(unspentDeposit),
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
            // {
            //     key: 'Estimated cost',
            //     value: orderHoldDepositSdk
            //         ? (Math.round(orderHoldDepositSdk * 1000) / 1000).toFixed(3)
            //         : '-',
            // },
            // {
            //     key: 'Actual cost',
            //     value: depositSpentSdk
            //         ? (Math.round(Number(depositSpentSdk) * 1000) / 1000).toFixed(3)
            //         : '-',
            // },
        ],
    };
};

export const getOrdersCancelList = (addressSuborders?: SubOrderInfo): string[] => (
    addressSuborders
        ? Object.entries(addressSuborders).reduce((acc: string[], [k, v]) => (
            v.cancelable ? [...acc, k] : acc
        ), [])
        : []
);

export const getSubOrdersList = (list: any[]): SubOrderInfo => (
    list
        ? list.reduce((acc, {
            id,
            orderHoldDeposit,
            orderInfo,
            depositSpent,
        }) => {
            return {
                ...acc,
                [id]: {
                    cancelable: !!orderInfo?.status && ![
                        OrderStatus.Canceled,
                        OrderStatus.Done,
                        OrderStatus.Canceling,
                        OrderStatus.Error,
                    ].includes(orderInfo.status as OrderStatus),
                    orderHoldDeposit,
                    depositSpent,
                },
            };
        }, {})
        : {}
);
