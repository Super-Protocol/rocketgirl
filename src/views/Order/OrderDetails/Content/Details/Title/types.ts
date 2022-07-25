import { BigNumber } from 'bignumber.js';
import { OrderQuery } from '@/gql/graphql';
import { GetOrderSdk } from '@/connectors/orders';

export interface TitleProps {
    order: OrderQuery['order'];
    orderSdk?: GetOrderSdk;
    subOrdersList?: string[];
    updateOrderInfo: () => Promise<void>;
    unspentDeposit?: BigNumber;
}
