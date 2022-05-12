import { DocumentNode } from 'graphql';
import { OperationVariables } from '@apollo/client';
import { Item } from '@/uikit/Select/types';
import { useSelectQueryCursorFetcher, UseSelectQueryCursorFetcherResult } from './useSelectQueryCursorFetcher';
import { TDataDefault } from './types';

export interface UseSelectQueryCursorSPFetcherProps<TNode> {
    query?: DocumentNode;
    convertNode?: (data: { node: TNode, cursor: string }) => Item;
    variablesFilter?: OperationVariables;
    inputFilterFields?: string[];
}

export interface UseSelectQueryCursorSPFetcherResult<Data> extends UseSelectQueryCursorFetcherResult<Data> {}

export const useSelectQueryCursorSPFetcher = <TNode, Data>({
    query,
    convertNode,
    variablesFilter,
    inputFilterFields,
}: UseSelectQueryCursorSPFetcherProps<TNode>): UseSelectQueryCursorSPFetcherResult<Data> => {
    const { fetcher } = useSelectQueryCursorFetcher<TDataDefault<TNode>>({
        query,
        convertCursor: (data) => data?.result?.page?.pageInfo?.endCursor,
        convertOptions: (data) => (convertNode ? data?.result?.page?.edges?.map(convertNode as any) : []), // todo types
        getVariables: ({ count, cursor, search }) => ({
            pagination: {
                first: count,
                after: cursor,
                sortBy: 'origins.modifiedDate',
                sortDir: 'DESC',
            },
            filter: {
                ...(
                    inputFilterFields?.length
                        ? inputFilterFields.reduce((acc, key) => ({
                            ...acc,
                            ...(search ? { [key]: search } : {}),
                        }), {})
                        : {}
                ),
                ...variablesFilter,
            },
        }),
    });
    return {
        fetcher,
    };
};
