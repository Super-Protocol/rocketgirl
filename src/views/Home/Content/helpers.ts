import { Tables } from '@/views/Home/types';
import { GetTablesProps } from './types';
import { Filter } from '@/views/Home/Content/FilterPopover/models';

export const getTables = (props: GetTablesProps): { value: Tables, label: string }[][] => {
    const { hide } = props || {};
    return [
        [{ value: Tables.Providers, label: 'Providers' }],
        [{ value: Tables.TEEOffers, label: 'TEE Offers' }],
        [{ value: Tables.Offers, label: 'Offers' }],
        [{ value: Tables.MyOrders, label: 'My Orders' }],
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
