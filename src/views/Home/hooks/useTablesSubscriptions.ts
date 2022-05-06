import { SubscriptionSource, useEventSubscription, SubscriptionType } from '@/gql/graphql';
import { FetcherByTable, UseTablesQueryFetcherResult } from '@/views/Home/hooks/useTablesQueryFetcher';
import { Tables } from '@/views/Home/types';

export const getFetcherBySubSource = (subscriptionSource?: SubscriptionSource): Tables | null => {
    switch (subscriptionSource) {
        case SubscriptionSource.Offer:
            return Tables.Offers;
        case SubscriptionSource.Provider:
            return Tables.Providers;
        case SubscriptionSource.TeeOffer:
            return Tables.TEEOffers;
        case SubscriptionSource.Order:
            return Tables.MyOrders;
        default:
            return null;
    }
};

export const useTablesSubscriptions = (fetcher: UseTablesQueryFetcherResult): void => {
    useEventSubscription(
        {
            onSubscriptionData: async ({ subscriptionData }) => {
                const { event } = subscriptionData?.data || {};
                const { subscriptionSource, data, type } = event || {};
                const fetcherBySubSource: FetcherByTable = fetcher[getFetcherBySubSource(subscriptionSource) as string];
                if (!fetcherBySubSource) return;
                const {
                    updateDiff,
                    refetch,
                    queryOptions,
                } = fetcherBySubSource || {};
                if (
                    Array.isArray(data)
                    && data.length
                    && [SubscriptionType.Add, SubscriptionType.Update].includes(type as SubscriptionType)
                    && !queryOptions?.skip
                ) {
                    updateDiff?.([...data]);
                    // todo refetch if need
                    if (!queryOptions?.skip) {
                        await refetch?.();
                    }
                }
            },
        },
    );
};
