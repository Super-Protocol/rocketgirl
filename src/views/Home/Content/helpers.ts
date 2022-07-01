import { Tables } from '@/views/Home/types';
import { Filter } from '@/views/Home/Content/FilterPopover/models';
import { FetcherByTable, UseTablesQueryFetcherResult } from '@/views/Home/hooks/useTablesQueryFetcher';
import { Diff } from '@/common/hooks/useTableDiff';
import { UseTableQueryFetcherResultList } from '@/common/hooks/useTableQueryFetcher';
import { GetTablesProps, GetDiffIndexesResult } from './types';

export const getTables = (props: GetTablesProps): { value: Tables, label: string }[][] => {
    const { hide } = props || {};
    return [
        [{ value: Tables.Providers, label: 'Providers' }],
        [{ value: Tables.TEEOffers, label: 'TEE Offers' }],
        [{ value: Tables.Offers, label: 'Offers' }],
        [{ value: Tables.Orders, label: 'Orders' }],
    ].reduce((acc, list) => {
        const filteredList = list.filter(({ value }) => !hide?.length || !hide.includes(value));
        if (filteredList.length) {
            acc.push(filteredList);
        }
        return acc;
    }, [] as { value: Tables, label: string }[][]);
};

export const getFilters = (values?: { [x: string]: Filter }): object | null => {
    if (!values || !Object.values(values).length) return null;
    return Object.values(values).reduce((acc, filter) => {
        return {
            ...acc,
            ...(filter.value ? { [filter.name]: filter.value } : undefined),
        };
    }, {});
};

export const getDiff = (fetcherResult: UseTablesQueryFetcherResult): Map<Tables, Diff> => {
    if (!fetcherResult) return new Map();
    return Object.entries(fetcherResult).reduce((acc, [table, value]) => {
        if (value.diff?.values?.size) {
            acc.set(table, { ...value.diff, key: value.diff.key });
        }
        return acc;
    }, new Map());
};

export const getDiffIndexes = (active?: FetcherByTable): GetDiffIndexesResult => {
    if (!active) return null;
    const { diff, list } = active;
    if (!list?.length || !diff?.values?.size) return null;
    return (list as UseTableQueryFetcherResultList<any>[]).reduce((acc, item, index) => {
        const isFound = diff.values.has(item[diff.key as string]);
        if (isFound) {
            acc.set(index, new Set().add(item[diff.key as string]));
        }
        return acc;
    }, new Map());
};
