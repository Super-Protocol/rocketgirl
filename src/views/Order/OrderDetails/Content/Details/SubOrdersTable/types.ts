import { Order } from '@/gql/graphql';
import { UseTableQueryFetcherResultList, UseTableQueryFetcherResult } from '@/common/hooks/useTableQueryFetcher';

export type OrdersColumns = UseTableQueryFetcherResultList<Order>;
export type OrderResult = UseTableQueryFetcherResult<Order>;

export interface SubOrdersTableProps {
    address: string;
    selectedAddress?: string;
    classNameWrap?: string;
    setSubOrdersList: Function;
}

export type Columns = OrdersColumns;
