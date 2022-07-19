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
    OffersDocument,
    Offer,
    TeeOffersDocument,
    TeeOffer,
    OrdersDocument,
    Order,
    TransactionsDocument,
    Transaction,
    TOfferType,
} from '@/gql/graphql';

export interface UseTablesQueryFetcherResult {
    [Tables.Providers]: UseTableQueryFetcherResult<Provider>;
    [Tables.Offers]: UseTableQueryFetcherResult<Offer>;
    [Tables.TEEOffers]: UseTableQueryFetcherResult<TeeOffer>;
    [Tables.Orders]: UseTableQueryFetcherResult<Order>;
    [Tables.Transactions]: UseTableQueryFetcherResult<Transaction>;
}

export type FetcherByTable = UseTablesQueryFetcherResult[Tables.Providers]
    | UseTablesQueryFetcherResult[Tables.Offers]
    | UseTablesQueryFetcherResult[Tables.TEEOffers]
    | UseTablesQueryFetcherResult[Tables.Orders]
    | UseTablesQueryFetcherResult[Tables.Transactions]
    | null;

export interface UseTablesQueryFetcherPropsSkip<SkipType> extends UseTableQueryFetcherPropsSkip<SkipType> {
    table: Tables;
}

export interface UseTablesQueryFetcherProps<SkipType> {
    table: Tables;
    skip?: UseTablesQueryFetcherPropsSkip<SkipType>[];
    consumer?: string;
}

export const useTablesQueryFetcher = <SkipType>(
    props: UseTablesQueryFetcherProps<SkipType>,
): UseTablesQueryFetcherResult => {
    const { table, skip, consumer } = props;
    const getSkipQuery = useCallback((currentTable: Tables, checkCurrent = true) => {
        if (checkCurrent && table !== currentTable) return { type: null, message: undefined };
        return skip?.find(({ table: skipTable }) => skipTable === currentTable) || undefined;
    }, [table, skip]);
    const providers = useTableQueryFetcher<Provider>({
        gql: ProvidersDocument,
        queryOptions: { variables: { pagination: { sortBy: 'origins.modifiedDate' } } },
        subscriptionKey: 'address',
        skip: getSkipQuery(Tables.Providers),
    });
    const offers = useTableQueryFetcher<Offer>({
        gql: OffersDocument,
        queryOptions: { variables: { pagination: { sortBy: 'origins.modifiedDate' } } },
        subscriptionKey: 'id',
        skip: getSkipQuery(Tables.Offers),
    });
    const teeOffers = useTableQueryFetcher<TeeOffer>({
        gql: TeeOffersDocument,
        queryOptions: { variables: { pagination: { sortBy: 'origins.modifiedDate' } } },
        subscriptionKey: 'id',
        skip: getSkipQuery(Tables.TEEOffers),
    });
    const orders = useTableQueryFetcher<Order>({
        gql: OrdersDocument,
        queryOptions: {
            variables: {
                pagination: { sortBy: 'origins.modifiedDate' },
                filter: { consumer, offerType: TOfferType.TeeOffer },
            },
        },
        subscriptionKey: 'id',
        noDataMessage: getSkipQuery(Tables.Orders)?.message,
        skip: getSkipQuery(Tables.Orders),
    });
    const transactions = useTableQueryFetcher<Transaction>({
        gql: TransactionsDocument,
        queryOptions: { variables: { pagination: { sortBy: 'timestamp' }, filter: { sender: consumer } } },
        noDataMessage: getSkipQuery(Tables.Transactions, false)?.message,
        subscriptionKey: 'transactionIndex',
        skip: getSkipQuery(Tables.Transactions, false),
    });

    return {
        [Tables.Providers]: providers,
        [Tables.Offers]: offers,
        [Tables.TEEOffers]: teeOffers,
        [Tables.Orders]: orders,
        [Tables.Transactions]: transactions,
    };
};
