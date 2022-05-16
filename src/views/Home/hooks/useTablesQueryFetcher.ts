import { useCallback } from 'react';
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
    [Tables.Orders]: UseTableQueryFetcherResult<Order, OrdersQuery>;
}

export type FetcherByTable = UseTablesQueryFetcherResult[Tables.Providers]
    | UseTablesQueryFetcherResult[Tables.Offers]
    | UseTablesQueryFetcherResult[Tables.TEEOffers]
    | UseTablesQueryFetcherResult[Tables.Orders]
    | null;

export interface UseTablesQueryFetcherPropsSkip {
    table: Tables;
    reason: string;
}

export interface UseTablesQueryFetcherProps {
    table: Tables;
    skip?: UseTablesQueryFetcherPropsSkip[];
}

export const useTablesQueryFetcher = (props: UseTablesQueryFetcherProps): UseTablesQueryFetcherResult => {
    const { table, skip } = props;
    const getSkipQuery = useCallback((currentTable: Tables) => {
        if (table !== currentTable) return { table, reason: undefined };
        return skip?.find(({ table: skipTable }) => skipTable === currentTable) || null;
    }, [table, skip]);
    const providers = useTableQueryFetcher<Provider, ProvidersQuery>({
        gql: ProvidersDocument,
        queryOptions: { skip: !!getSkipQuery(Tables.Providers), variables: { pagination: { sortBy: 'origins.modifiedDate' } } },
        subscriptionKey: 'address',
    });
    const offers = useTableQueryFetcher<Offer, OffersQuery>({
        gql: OffersDocument,
        queryOptions: { skip: !!getSkipQuery(Tables.Offers), variables: { pagination: { sortBy: 'origins.modifiedDate' } } },
        subscriptionKey: 'address',
    });
    const teeOffers = useTableQueryFetcher<TeeOffer, TeeOffersQuery>({
        gql: TeeOffersDocument,
        queryOptions: { skip: !!getSkipQuery(Tables.TEEOffers), variables: { pagination: { sortBy: 'origins.modifiedDate' } } },
        subscriptionKey: 'address',
    });
    const orders = useTableQueryFetcher<Order, OrdersQuery>({
        gql: OrdersDocument,
        queryOptions: { skip: !!getSkipQuery(Tables.Orders), variables: { pagination: { sortBy: 'origins.modifiedDate' } } },
        subscriptionKey: 'address',
        noDataMessage: getSkipQuery(Tables.Orders)?.reason,
    });
    return {
        [Tables.Providers]: providers,
        [Tables.Offers]: offers,
        [Tables.TEEOffers]: teeOffers,
        [Tables.Orders]: orders,
    };
};
