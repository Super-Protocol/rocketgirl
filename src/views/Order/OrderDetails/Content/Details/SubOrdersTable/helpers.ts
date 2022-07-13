import { OrderStatus } from '@super-protocol/sp-sdk-js';

import { TableTheme } from '@/uikit/Table/types';
import { OrderResult } from './types';

export const spinnerProps = { fullscreen: true };

export const styles = { theme: TableTheme.orange };

export const getSubOrdersList = (orders: OrderResult): string[] => (
    orders?.list
        ? orders.list.reduce((acc: string[], { address, orderInfo }) => {
            return !!orderInfo?.status && ![
                OrderStatus.Canceled,
                OrderStatus.Done,
                OrderStatus.Canceling,
                OrderStatus.Error,
            ].includes(orderInfo.status as OrderStatus)
                ? [...acc, address]
                : acc;
        }, [])
        : []
);
