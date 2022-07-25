import { Order } from '@/gql/graphql';
import { UseTableQueryFetcherResultList, UseTableQueryFetcherResult } from '@/common/hooks/useTableQueryFetcher';

export type OrdersColumns = UseTableQueryFetcherResultList<Order>;
export type OrderResult = UseTableQueryFetcherResult<Order>;

export interface SubOrdersTableProps {
    classNameWrap?: string;
    orders: UseTableQueryFetcherResult<Order>;
}

export type Columns = OrdersColumns;
