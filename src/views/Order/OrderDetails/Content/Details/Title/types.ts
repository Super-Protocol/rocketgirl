import { OrderQuery } from '@/gql/graphql';
import { GetOrderSdk } from '@/connectors/orders';

export interface TitleProps {
    order: OrderQuery['order'];
    orderSdk?: GetOrderSdk;
    updateOrderInfo: () => Promise<void>;
}
