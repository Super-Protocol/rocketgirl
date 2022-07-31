import { ReactNode } from 'react';
import { OrderStatus } from '@super-protocol/sp-sdk-js';
import { CopyToClipboard } from '@/uikit';
import { StatusBarToolkit } from '@/common/components/';
import { Order, OrderQuery } from '@/gql/graphql';
import { BigNumber } from 'bignumber.js';
import {
    getFixedDeposit,
    getTableDate,
    getOrdersHoldDeposit,
    getOrdersUnspentDeposit,
    getOrdersDeposit,
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

export interface GetTeeProps {
    order?: OrderQuery['order'];
    actualCost?: BigNumber;
    estimatedCost?: BigNumber;
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

export interface GetActualCostProps {
    depositSpent: string;
    subOrdersInfo: SubOrderInfo;
}

export interface GetEstimatedCostProps {
    subOrdersInfo: SubOrderInfo;
}

export const getUnspentDeposit = ({
    orderHoldDeposit,
    depositSpent,
    subOrdersInfo,
}: GetUnspentDepositProps): BigNumber => {
    return getOrdersUnspentDeposit(
        [{ orderHoldDeposit, depositSpent }]
            .concat(
                Object
                    .values(subOrdersInfo || {})
                    .reduce(
                        (acc, { orderHoldDeposit, depositSpent }) => {
                            return acc.concat({
                                orderHoldDeposit: orderHoldDeposit || '0',
                                depositSpent: depositSpent || '0',
                            });
                        },
                        [] as { orderHoldDeposit: string; depositSpent: string; }[],
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

export const getEstimatedCost = ({ subOrdersInfo }: GetEstimatedCostProps): BigNumber => {
    return getOrdersDeposit(Object.values(subOrdersInfo || {}).map(({ holdSum }) => holdSum || '0'));
};

export const getActualCost = ({ depositSpent, subOrdersInfo }: GetActualCostProps): BigNumber => {
    return getOrdersDeposit(
        [`${depositSpent || 0}`]
            .concat(
                Object
                    .values(subOrdersInfo || {})
                    .reduce(
                        (acc, { depositSpent }) => acc.concat(`${depositSpent || 0}`),
                        [] as string[],
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
                key: 'Total Deposit, TEE',
                value: getFixedDeposit({ deposit: totalDeposit }),
            },
            {
                key: 'Unspent Deposit, TEE',
                value: getFixedDeposit({ deposit: unspentDeposit }),
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

export const getTee = (props: GetTeeProps): TableInfo | null => {
    const { order, actualCost, estimatedCost } = props || {};
    if (!order) return null;
    const {
        teeOfferInfo,
        orderInfo,
        providerInfo,
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
                key: 'Estimated cost, TEE',
                value: getFixedDeposit({ deposit: estimatedCost }),
            },
            {
                key: 'Actual cost, TEE',
                value: getFixedDeposit({ deposit: actualCost }),
            },
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

export const getSubOrdersList = (list: Order[]): SubOrderInfo => (
    list
        ? list.reduce((acc, {
            id,
            orderHoldDeposit,
            orderInfo,
            depositSpent,
            offerInfo,
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
                    holdSum: offerInfo?.holdSum,
                },
            };
        }, {})
        : {}
);
