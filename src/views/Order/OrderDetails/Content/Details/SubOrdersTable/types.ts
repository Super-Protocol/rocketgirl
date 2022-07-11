import { Order } from '@/gql/graphql';
import { UseTableQueryFetcherResultList, UseTableQueryFetcherResult } from '@/common/hooks/useTableQueryFetcher';

export type OrdersColumns = UseTableQueryFetcherResultList<Order>;
export type OrderResult = UseTableQueryFetcherResult<Order>;

export interface SubOrdersTableProps {
    orders: OrderResult;
    classNameWrap?: string;
}

export type Columns = OrdersColumns;
