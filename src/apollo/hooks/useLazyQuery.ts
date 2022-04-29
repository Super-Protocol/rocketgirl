import {
    useLazyQuery as useLazyQueryApollo,
    LazyQueryHookOptions as LazyQueryHookOptionsApollo,
    QueryTuple,
    OperationVariables,
    LazyQueryResult,
} from '@apollo/client';
import { DocumentNode } from 'graphql';
import { useMemo } from 'react';
import { removeTypenames } from '@/utils';
import useAbort from '@/common/hooks/useAbort';

export interface LazyQueryHookOptions<TData, TVariables> extends LazyQueryHookOptionsApollo<TData, TVariables> {
    isAbort?: boolean;
}

export const useLazyQuery = <TData = any, TVariables = OperationVariables>
    (
        query: DocumentNode,
        options?: LazyQueryHookOptions<TData, TVariables>,
    ): QueryTuple<TData, TVariables> => {
    const { abortController } = useAbort({ isAbortUnmount: true });
    const { isAbort, ...rest } = useMemo(() => options || {}, [options]);
    const [useLazyQueryRunFunc, useLazyQueryResult] = useLazyQueryApollo(query, {
        ...rest,
        onCompleted: (data: TData) => {
            if (rest?.onCompleted) {
                rest.onCompleted(removeTypenames(data));
            }
        },
        ...(isAbort && abortController?.signal ? {
            context: {
                ...((options && options.context) || {}),
                fetchOptions: {
                    signal: abortController.signal,
                    ...((options && options.context && options.context.fetchOptions) || {}),
                },
            },
        } : {}),
    });

    const useLazyQueryResultFinal = useMemo(() => ({
        ...useLazyQueryResult,
        data: removeTypenames(useLazyQueryResult.data),
    }) as LazyQueryResult<TData, TVariables>, [useLazyQueryResult]);

    return [useLazyQueryRunFunc, useLazyQueryResultFinal];
};
