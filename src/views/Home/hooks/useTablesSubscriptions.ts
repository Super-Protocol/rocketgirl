import {
    SubscriptionSource,
    useEventSubscription,
    SubscriptionType,
    TOfferType,
} from '@/gql/graphql';
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
            return Tables.Orders;
        case SubscriptionSource.Transaction:
            return Tables.Transactions;
        default:
            return null;
    }
};

export const useTablesSubscriptions = (fetcher: UseTablesQueryFetcherResult, consumer?: string): void => {
    useEventSubscription(
        {
            variables: {
                filter: {
                    events: [
                        {
                            source: SubscriptionSource.Provider,
                        },
                        {
                            source: SubscriptionSource.TeeOffer,
                        },
                        {
                            source: SubscriptionSource.Offer,
                        },
                        ...(consumer
                            ? [
                                {
                                    source: SubscriptionSource.Order,
                                    filter: { consumer, offerType: TOfferType.TeeOffer },
                                },
                                {
                                    source: SubscriptionSource.Transaction,
                                    filter: { consumer, offerType: TOfferType.TeeOffer },
                                },
                            ]
                            : []
                        ),
                    ],
                },
            },
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
