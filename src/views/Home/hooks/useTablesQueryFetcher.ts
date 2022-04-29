import { Tables } from '@/views/Home/types';
import { useTableQueryFetcher, UseTableQueryFetcherResult } from '@/common/hooks/useTableQueryFetcher';
import {
    ProvidersDocument,
    Provider,
    ProvidersQuery,
    OffersDocument,
    Offer,
    OffersQuery,
    TeeOffersDocument,
    TeeOffer,
    TeeOffersQuery,
    OrdersDocument,
    Order,
    OrdersQuery,
} from '@/gql/graphql';

export interface UseTablesQueryFetcherResult {
    [Tables.Providers]: UseTableQueryFetcherResult<Provider, ProvidersQuery>;
    [Tables.Offers]: UseTableQueryFetcherResult<Offer, OffersQuery>;
    [Tables.TEEOffers]: UseTableQueryFetcherResult<TeeOffer, TeeOffersQuery>;
    [Tables.MyOrders]: UseTableQueryFetcherResult<Order, OrdersQuery>;
}

export type FetcherByTable = UseTablesQueryFetcherResult[Tables.Providers]
    | UseTablesQueryFetcherResult[Tables.Offers]
    | UseTablesQueryFetcherResult[Tables.TEEOffers]
    | UseTablesQueryFetcherResult[Tables.MyOrders]
    | null;

export const useTablesQueryFetcher = (table: Tables): UseTablesQueryFetcherResult => {
    const providers = useTableQueryFetcher<Provider, ProvidersQuery>({
        gql: ProvidersDocument,
        queryOptions: { skip: table !== Tables.Providers, variables: { pagination: { sortBy: 'origins.modifiedDate' } } },
        subscriptionKey: 'address',
    });
    const offers = useTableQueryFetcher<Offer, OffersQuery>({
        gql: OffersDocument,
        queryOptions: { skip: table !== Tables.Offers, variables: { pagination: { sortBy: 'origins.modifiedDate' } } },
        subscriptionKey: 'address',
    });
    const teeOffers = useTableQueryFetcher<TeeOffer, TeeOffersQuery>({
        gql: TeeOffersDocument,
        queryOptions: { skip: table !== Tables.TEEOffers, variables: { pagination: { sortBy: 'origins.modifiedDate' } } },
        subscriptionKey: 'address',
    });
    const orders = useTableQueryFetcher<Order, OrdersQuery>({
        gql: OrdersDocument,
        queryOptions: { skip: table !== Tables.MyOrders, variables: { pagination: { sortBy: 'origins.modifiedDate' } } },
        subscriptionKey: 'address',
    });
    return {
        [Tables.Providers]: providers,
        [Tables.Offers]: offers,
        [Tables.TEEOffers]: teeOffers,
        [Tables.MyOrders]: orders,
    };
};
