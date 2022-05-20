import { OrderQuery } from '@/gql/graphql';
import { GetOrderInfoResult } from '@/connectors/orders';

export interface TitleProps {
    order: OrderQuery['order'];
    orderInfo?: GetOrderInfoResult;
    updateOrderInfo: () => Promise<void>;
}
