import { Order } from '@/gql/graphql';
import { UseTableQueryFetcherResultList, UseTableQueryFetcherResult } from '@/common/hooks/useTableQueryFetcher';

export type OrdersColumns = UseTableQueryFetcherResultList<Order>;
export type OrderResult = UseTableQueryFetcherResult<Order>;

export interface SubOrdersTableProps {
    id: string;
    selectedAddress?: string;
    classNameWrap?: string;
    setAddressSuborders: Function;
}

export type Columns = OrdersColumns;
