import { DocumentNode } from 'graphql';
import { useCallback } from 'react';
import { OperationVariables, useApolloClient } from '@apollo/client';
import { LazyLoadFetcher, Item } from '@/uikit/types';

export type UseSelectQueryCursorFetcherResultFetcher<Data> = LazyLoadFetcher<Data> | null;

export interface UseSelectQueryCursorFetcherResult<Data> {
    fetcher: UseSelectQueryCursorFetcherResultFetcher<Data>;
}

export interface Variables {
    pagination: {
        first: number,
        after?: string | null;
    },
    filter?: OperationVariables;
}

export interface GetVariablesProps {
    count: number;
    cursor?: string | null;
    search?: string | null;
}

export interface UseSelectQueryCursorFetcherProps<TData> {
    query?: DocumentNode;
    convertOptions: (data?: TData | null) => Item[] | undefined;
    getVariables: (props: GetVariablesProps) => Variables;
    convertCursor: (data?: TData | null) => string | null | undefined;
    count?: number;
    filter?: any;
}

export const useSelectQueryCursorFetcher = <TData>({
    query,
    convertOptions,
    getVariables: getVariablesProps,
    convertCursor,
    count = 10,
    filter,
}: UseSelectQueryCursorFetcherProps<TData>): UseSelectQueryCursorFetcherResult<any> => { // todo
    const getVariables = useCallback((props: GetVariablesProps): Variables => {
        const { cursor, count } = props;
        if (getVariablesProps) return getVariablesProps(props);
        return { pagination: { first: count, after: cursor }, filter };
    }, [getVariablesProps, filter]);
    const client = useApolloClient();
    const fetcher: LazyLoadFetcher<TData> = useCallback(async ({ cursor, search, signal }) => {
        if (!query) return { options: [], cursor: null, input: null };
        try {
            const { data } = await client.query<TData>({
                query,
                variables: getVariables({ count, cursor, search }),
                ...(signal ? {
                    context: {
                        fetchOptions: {
                            signal,
                        },
                    },
                } : {}),
            });
            const options = convertOptions(data);
            const newCursor = convertCursor(data);
            return { options, cursor: newCursor };
        } catch (e) {
            return { options: [], cursor: null };
        }
    }, [query, getVariables, client, convertCursor, convertOptions, count]);
    if (!query) return { fetcher: null };
    return {
        fetcher,
    };
};
