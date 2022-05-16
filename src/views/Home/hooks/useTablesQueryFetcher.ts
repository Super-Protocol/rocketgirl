import { useCallback } from 'react';
import { Tables } from '@/views/Home/types';
import {
    useTableQueryFetcher,
    UseTableQueryFetcherResult,
    UseTableQueryFetcherPropsSkip,
} from '@/common/hooks/useTableQueryFetcher';
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

export interface UseTablesQueryFetcherPropsSkip<SkipType> extends UseTableQueryFetcherPropsSkip<SkipType> {
    table: Tables;
}

export interface UseTablesQueryFetcherProps<SkipType> {
    table: Tables;
    skip?: UseTablesQueryFetcherPropsSkip<SkipType>[];
}

export const useTablesQueryFetcher = <SkipType>(
    props: UseTablesQueryFetcherProps<SkipType>,
): UseTablesQueryFetcherResult => {
    const { table, skip } = props;
    const getSkipQuery = useCallback((currentTable: Tables) => {
        if (table !== currentTable) return undefined;
        return skip?.find(({ table: skipTable }) => skipTable === currentTable) || undefined;
    }, [table, skip]);
    const providers = useTableQueryFetcher<Provider, ProvidersQuery>({
        gql: ProvidersDocument,
        queryOptions: { variables: { pagination: { sortBy: 'origins.modifiedDate' } } },
        subscriptionKey: 'address',
        skip: getSkipQuery(Tables.Providers),
    });
    const offers = useTableQueryFetcher<Offer, OffersQuery>({
        gql: OffersDocument,
        queryOptions: { variables: { pagination: { sortBy: 'origins.modifiedDate' } } },
        subscriptionKey: 'address',
        skip: getSkipQuery(Tables.Offers),
    });
    const teeOffers = useTableQueryFetcher<TeeOffer, TeeOffersQuery>({
        gql: TeeOffersDocument,
        queryOptions: { skip: !!getSkipQuery(Tables.TEEOffers), variables: { pagination: { sortBy: 'origins.modifiedDate' } } },
        subscriptionKey: 'address',
        skip: getSkipQuery(Tables.TEEOffers),
    });
    const orders = useTableQueryFetcher<Order, OrdersQuery>({
        gql: OrdersDocument,
        queryOptions: { skip: !!getSkipQuery(Tables.Orders), variables: { pagination: { sortBy: 'origins.modifiedDate' } } },
        subscriptionKey: 'address',
        noDataMessage: getSkipQuery(Tables.Orders)?.message,
        skip: getSkipQuery(Tables.Orders),
    });
    return {
        [Tables.Providers]: providers,
        [Tables.Offers]: offers,
        [Tables.TEEOffers]: teeOffers,
        [Tables.Orders]: orders,
    };
};
