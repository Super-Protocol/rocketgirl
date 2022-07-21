import { OrderStatus } from '@super-protocol/sp-sdk-js';
import Web3 from 'web3';

import { TableTheme } from '@/uikit/Table/types';
import { SubOrderInfo } from '../types';

export const spinnerProps = { fullscreen: true };

export const styles = { theme: TableTheme.orange };

export const getSubOrdersList = (list: any[]): SubOrderInfo => (
    list
        ? list.reduce((acc, { id, orderHoldDeposit, orderInfo }) => {
            return {
                ...acc,
                [id]: {
                    cancelable: !!orderInfo?.status && ![
                        OrderStatus.Canceled,
                        OrderStatus.Done,
                        OrderStatus.Canceling,
                        OrderStatus.Error,
                    ].includes(orderInfo.status as OrderStatus),
                    orderHoldDeposit: orderHoldDeposit
                        ? Math.round(Number(Web3.utils.fromWei(orderHoldDeposit.toString())) * 1000) / 1000
                        : 0,
                },
            };
        }, {})
        : {}
);
