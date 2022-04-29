import {
    useQuery, QueryKey, QueryFunction, UseQueryResult, UseQueryOptions,
} from 'react-query';
import toastr from '@/services/Toastr/toastr';
import CONFIG from '@/config';

const getDefaultOptions = (options) => {
    return {
        enabled: true,
        refetchOnWindowFocus: false,
        refetchInterval: CONFIG.REACT_APP_FETCH_INTERVAL,
        onError: (e) => toastr.error(e),
        ...options,
    };
};

export interface UseTableCacheFetcherOptions<Struct> extends Omit<UseQueryOptions<Struct>, 'onSuccess'> {
    enabled?: boolean;
}

export interface UseTableCacheFetcherResult<Struct> {
    query: UseQueryResult<Struct[]>;
}

export interface UsePeriodicalTableFetcherProps<Tables, Struct> {
    table: Tables,
    fetcher: QueryFunction<Struct[]>,
    options?: UseTableCacheFetcherOptions<Struct>
}

export function usePeriodicalTableFetcher<Tables extends QueryKey, Struct extends object>(
    params: UsePeriodicalTableFetcherProps<Tables, Struct>,
): UseTableCacheFetcherResult<Struct> {
    const query = useQuery<Struct[]>(
        params.table,
        params.fetcher,
        getDefaultOptions(params.options) as Struct, // todo
    );
    return {
        query,
    };
}
