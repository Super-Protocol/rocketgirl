/* eslint-disable import/no-extraneous-dependencies */

import { DocumentNode } from 'graphql';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import {
    SubscriptionHookOptions as SubscriptionHookOptionsApollo,
    useSubscription as useSubscriptionApollo,
    OperationVariables,
    ApolloError,
    OnSubscriptionDataOptions,
} from '@apollo/client';
import { useMemo } from 'react';
import { removeTypenames } from '@/utils';

export const useSubscription = <TData = any, TVariables = OperationVariables> (
    subscription: DocumentNode | TypedDocumentNode<TData, TVariables>,
    options?: SubscriptionHookOptionsApollo<TData, TVariables>,
): {
    variables?: TVariables | undefined;
    loading: boolean;
    data?: TData | undefined;
    error?: ApolloError | undefined;
} => {
    const optionsFinal = {
        ...options,
        onSubscriptionData: (subscriptionDataOptions: OnSubscriptionDataOptions<TData>) => {
            if (options?.onSubscriptionData) {
                const subscriptionDataOptionsFinal = {
                    ...subscriptionDataOptions,
                    subscriptionData: removeTypenames(subscriptionDataOptions.subscriptionData),
                };

                options.onSubscriptionData(subscriptionDataOptionsFinal);
            }
        },
    };

    const subscriptionResult = useSubscriptionApollo(subscription, optionsFinal);

    const subscriptionResultFinal = useMemo(() => ({
        ...subscriptionResult,
        data: removeTypenames(subscriptionResult.data),
    }), [subscriptionResult]);

    return subscriptionResultFinal;
};

export interface SubscriptionHookOptions
<TData = any, TVariables = OperationVariables> extends SubscriptionHookOptionsApollo<TData, TVariables> {}
