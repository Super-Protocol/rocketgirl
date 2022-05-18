import {
    useCallback,
    useMemo,
    useState,
} from 'react';
import { useMount } from 'react-use';
import { DocumentNode } from 'graphql';
import {
    QueryHookOptions as QueryHookOptionsApollo,
    OperationVariables,
    ApolloError,
    LazyQueryResult,
    QueryLazyOptions,
} from '@apollo/client';
import toastr from '@/services/Toastr/toastr';
import { PageClick } from '@/uikit/Table/TablePagination/types';
import { useLazyQuery } from '@/apollo/hooks';
import { Diff, useTableDiff } from './useTableDiff';
import { TDataDefaultPageData, TDataDefaultPageInfo, TDataDefault } from './types';

export type SortDir = 'ASC' | 'DESC';

export interface Pagination {
    after?: string | null;
    before?: string | null;
    last?: number;
    first?: number;
    sortBy?: string;
    sortDir?: SortDir;
}

export type UseTableQueryFetcherQueryOptionsVariables<TVariables> = TVariables & {
    pagination: Pagination;
    filter?: OperationVariables;
}

export interface UseTableQueryFetcherQueryOptions<TData, TVariables> extends QueryHookOptionsApollo<TData, TVariables> {
    variables?: UseTableQueryFetcherQueryOptionsVariables<TVariables>
}

export interface OnPageChangeProps {
    pageIndex?: number | null;
    pageClick: PageClick;
    filter?: OperationVariables | null;
}

export type UseTableQueryFetcherResultList<TNode> = TNode & { cursor: string; }

export interface UseTableQueryFetcherPropsSkip<SkipType> {
    message?: string;
    type: SkipType | null;
}

export interface UseTableQueryFetcherResult<
    TNode,
    TData extends TDataDefault<TNode> = TDataDefault<TNode>, TVariables = OperationVariables,
    SkipType = any
    > {
    list: UseTableQueryFetcherResultList<TNode>[];
    pageSize: number | null;
    pageCount: number;
    loading: boolean;
    error?: ApolloError;
    pageData?: TDataDefaultPageData | null;
    onChangePage: (props: OnPageChangeProps) => void;
    onChangePageSize: (pageSize: number) => void;
    diff: Diff;
    pageInfo?: TDataDefaultPageInfo | null;
    pageIndex: number;
    deleteFromDiff: () => void;
    deleteFromDiffTimeout: () => void;
    refetch: () => Promise<void>;
    getQueryData: (options?: QueryLazyOptions<TVariables>) => Promise<LazyQueryResult<TData, TVariables>>;
    updateDiff: (values: string[]) => void;
    subscriptionKey?: string;
    queryOptions?: UseTableQueryFetcherQueryOptions<TData, TVariables>;
    noDataMessage?: string;
    skip?: UseTableQueryFetcherPropsSkip<SkipType>;
}

export const DEFAULT_PAGE_SIZE = 5;

export interface GetVariablesOptions {
    pagination: Pagination;
    filter?: OperationVariables | null;
}

export const getVariablesHelper = <TVariables>(
    defaultVariables?: UseTableQueryFetcherQueryOptionsVariables<TVariables>,
    options?: GetVariablesOptions,
): UseTableQueryFetcherQueryOptionsVariables<TVariables> => ({
        ...defaultVariables,
        ...options,
        pagination: {
            ...defaultVariables?.pagination,
            ...options?.pagination,
        },
        filter: {
            ...defaultVariables?.filter,
            ...options?.filter,
        },
    } as UseTableQueryFetcherQueryOptionsVariables<TVariables>);

export interface UseTableQueryFetcherOptions {
    pageSize?: number;
}

export interface UseTableQueryFetcherProps<TData, TVariables, SkipType> {
    gql: DocumentNode,
    queryOptions?: UseTableQueryFetcherQueryOptions<TData, TVariables>,
    options?: UseTableQueryFetcherOptions;
    subscriptionKey?: string;
    noDataMessage?: string;
    skip?: UseTableQueryFetcherPropsSkip<SkipType>;
}

export interface GetVariablesProps {
    pageClick?: PageClick;
    startCursor?: string | null;
    endCursor?: string | null;
    pageSize?: number;
    isReverse?: boolean;
    filter?: OperationVariables | null;
}

export interface GetListProps<TNode> {
    data?: TDataDefault<TNode>;
    isReverse?: boolean;
}

export const getList = <TNode>({ data, isReverse }: GetListProps<TNode>): UseTableQueryFetcherResultList<TNode>[] => {
    const dataFormatted = data?.result?.page?.edges?.map(({ node, cursor }) => ({ ...node, cursor })) || [];
    return (isReverse ? dataFormatted.reverse() : dataFormatted) as UseTableQueryFetcherResultList<TNode>[];
};

export const useTableQueryFetcher = <
    TNode, TData extends TDataDefault<TNode> = TDataDefault<TNode>, TVariables = OperationVariables, SkipType = any
    >
    (
        {
            gql,
            queryOptions: queryOptionsProps,
            options,
            subscriptionKey,
            noDataMessage,
            skip,
        }: UseTableQueryFetcherProps<TData, TVariables, SkipType>,
    ): UseTableQueryFetcherResult<TNode, TData, TVariables> => {
    const [pageIndex, setPageIndex] = useState(0);
    const [isReverse, setIsReverse] = useState(false);
    const [pageSize, setPageSize] = useState(options?.pageSize || DEFAULT_PAGE_SIZE);

    const {
        updateDiff,
        diff,
        deleteFromDiff,
        deleteFromDiffTimeout,
        updateCache,
    } = useTableDiff({ key: subscriptionKey });

    const getDefaultVariablesVariables = useCallback((props?: GetVariablesOptions) => getVariablesHelper(
        queryOptionsProps?.variables,
        props,
    ), [queryOptionsProps]);

    const getVariables = useCallback(({
        startCursor,
        endCursor,
        pageClick,
        pageSize,
        isReverse,
        filter,
    }: GetVariablesProps): UseTableQueryFetcherQueryOptionsVariables<TVariables> | undefined => {
        switch (pageClick) {
            case PageClick.FIRST:
                return getDefaultVariablesVariables({
                    pagination: {
                        first: pageSize,
                        sortDir: 'DESC',
                    },
                    filter,
                });
            case PageClick.LAST:
                return getDefaultVariablesVariables({
                    pagination: {
                        first: pageSize,
                        sortDir: 'ASC',
                    },
                    filter,
                });
            case PageClick.NEXT:
                if (isReverse) {
                    return getDefaultVariablesVariables({
                        pagination: {
                            last: pageSize,
                            before: startCursor,
                            sortDir: 'ASC',
                        },
                        filter,
                    });
                }
                return getDefaultVariablesVariables({
                    pagination: {
                        first: pageSize,
                        after: endCursor,
                        sortDir: 'DESC',
                    },
                    filter,
                });
            case PageClick.BACK:
                if (isReverse) {
                    return getDefaultVariablesVariables({
                        pagination: {
                            first: pageSize,
                            after: endCursor,
                            sortDir: 'ASC',
                        },
                        filter,
                    });
                }
                return getDefaultVariablesVariables({
                    pagination: {
                        last: pageSize,
                        before: startCursor,
                        sortDir: 'DESC',
                    },
                    filter,
                });
            default:
                return undefined;
        }
    }, [getDefaultVariablesVariables]);

    const queryOptions = useMemo(() => ({
        ...queryOptionsProps,
        variables: getVariables({ pageClick: PageClick.FIRST, isReverse, pageSize }),
        onError: (e) => {
            toastr.error(e);
        },
        onCompleted: (data) => {
            updateCache(getList({ data, isReverse }).map((item) => item[subscriptionKey as string]));
        },
        skip: !!skip,
    }), [queryOptionsProps, getVariables, isReverse, pageSize, updateCache, subscriptionKey, skip]);

    const [
        getQueryData,
        queryData,
    ] = useLazyQuery<TData, TVariables>(gql, queryOptions as any);
    const list = useMemo(() => getList<TNode>({ data: queryData.data, isReverse }), [queryData.data, isReverse]);
    const pageData = useMemo(() => queryData?.data?.result?.pageData, [queryData]);
    const pageInfo = useMemo(() => queryData?.data?.result?.page?.pageInfo, [queryData]);
    const pageCount = useMemo(() => {
        const { limit, count } = pageData || {};
        if (!limit) return 0;
        const countNumber = count as number / limit;
        return Number.isNaN(count) ? 0 : Math.ceil(countNumber);
    }, [pageData]);

    const onChangePage = useCallback(async (props: OnPageChangeProps) => {
        const {
            pageClick,
            pageIndex,
            filter,
        } = props;
        if (pageClick === PageClick.LAST) {
            setIsReverse(true);
        } else if (pageClick === PageClick.FIRST) {
            setIsReverse(false);
        }
        deleteFromDiffTimeout();
        const variables = getVariables({
            pageClick,
            startCursor: pageInfo?.startCursor,
            endCursor: pageInfo?.endCursor,
            isReverse,
            pageSize,
            filter,
        });
        if (variables) {
            await getQueryData({ variables }).catch(() => {});
        }
        setPageIndex(pageIndex || 0);
    }, [getQueryData, getVariables, pageInfo, isReverse, pageSize, deleteFromDiffTimeout]);

    const refetch = useCallback(async () => {
        await queryData.refetch().catch(() => {});
    }, [queryData]);

    const onChangePageSize = useCallback(async (newPageSize: number) => {
        await getQueryData({
            variables: getVariables({
                pageClick: PageClick.FIRST,
                isReverse: false,
                pageSize: newPageSize,
            }),
        });
        setPageSize(newPageSize);
        setPageIndex(0);
        setIsReverse(false);
    }, [getQueryData, getVariables]);

    useMount(() => {
        if (!skip) {
            refetch().then(() => {
                deleteFromDiffTimeout?.();
            });
        }
    });

    return {
        list,
        pageData,
        pageInfo,
        pageSize,
        pageCount,
        onChangePage,
        onChangePageSize,
        loading: queryData?.loading || false,
        error: queryData?.error,
        diff,
        pageIndex,
        deleteFromDiff,
        deleteFromDiffTimeout,
        refetch,
        getQueryData,
        updateDiff,
        subscriptionKey,
        queryOptions: queryOptionsProps,
        noDataMessage,
        skip,
    };
};
