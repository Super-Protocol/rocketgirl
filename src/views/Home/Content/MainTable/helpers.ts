import dayjs from 'dayjs';
import { Tables } from '@/views/Home/types';
import { FetcherByTable, UseTablesQueryFetcherResult } from '@/views/Home/hooks/useTablesQueryFetcher';
import { Diff } from '@/common/hooks/useTableDiff';
import { UseTableQueryFetcherResultList } from '@/common/hooks/useTableQueryFetcher';
import { getColumns as getColumnsProvider, ProviderColumns } from './columns/provider';
import { getColumns as getColumnsTEEOffers, TeeOffersColumns } from './columns/teeOffers';
import { getColumns as getColumnsOffers, OffersColumns } from './columns/offers';
import { getColumns as getColumnsOrders, OrdersColumns } from './columns/myOrders';
import { GetDiffIndexesResult } from './types';

export const getTableDate = (date: number): string => {
    if (!date) return '-';
    const dj = dayjs(date * 1000);
    return dj.isValid() ? dj.format('YYYY-MM-DD HH:mm:ss') : '-';
};

export type Columns = ProviderColumns
    | TeeOffersColumns
    | OffersColumns
    | OrdersColumns;

export interface GetColumnsProps {
    table: Tables;
    showErrorModal: Function;
    showSuccessModal: Function;
}

// todo type
export const getColumns = ({
    table,
    showErrorModal,
    showSuccessModal,
}: GetColumnsProps): any => {
    switch (table) {
        case Tables.Providers:
            return getColumnsProvider();
        case Tables.TEEOffers:
            return getColumnsTEEOffers();
        case Tables.Offers:
            return getColumnsOffers();
        case Tables.MyOrders:
            return getColumnsOrders();
        default:
            return [];
    }
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
