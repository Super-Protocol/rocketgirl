import { Order } from '@/gql/graphql';
import { UseTableQueryFetcherResultList } from '@/common/hooks/useTableQueryFetcher';

export type OrdersColumns = UseTableQueryFetcherResultList<Order>;

export interface SubOrdersTableProps {
    address: string;
    classNameWrap?: string;
}

export type Columns = OrdersColumns;
