import { useMemo } from 'react';
import {
    useQuery as useQueryApollo,
    QueryHookOptions as QueryHookOptionsApollo,
    OperationVariables,
    QueryResult,
} from '@apollo/client';
import { DocumentNode } from 'graphql';
import { removeTypenames } from '@/utils';
import useAbort from '@/common/hooks/useAbort';

export interface QueryHookOptions<TData, TVariables> extends QueryHookOptionsApollo<TData, TVariables> {
    isAbort?: boolean;
}

export const useQuery = <TData = any, TVariables = OperationVariables>
    (
        query: DocumentNode,
        options?: QueryHookOptions<TData, TVariables>,
    ): QueryResult<TData, TVariables> => {
    const { abortController } = useAbort({ isAbortUnmount: true });
    const isNeedAbort = options?.isAbort === undefined || options?.isAbort;

    const useQueryResult = useQueryApollo(query, {
        ...(options || {}),
        onCompleted: (data: TData) => {
            if (options?.onCompleted) {
                options.onCompleted(removeTypenames(data));
            }
        },
        ...(isNeedAbort && abortController?.signal ? {
            context: {
                ...((options && options.context) || {}),
                fetchOptions: {
                    signal: abortController.signal,
                    ...((options && options.context && options.context.fetchOptions) || {}),
                },
            },
        } : {}),
    });

    const dataWithoutTypeNames = useMemo(() => removeTypenames(useQueryResult.data), [useQueryResult.data]);

    return {
        ...useQueryResult,
        data: dataWithoutTypeNames,
    };
};
