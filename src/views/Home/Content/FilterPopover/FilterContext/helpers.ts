import * as Yup from 'yup';
import { Tables } from '@/views/Home/types';
import { getOfferOptions } from '@/common/helpers';
import { Filter } from '../models';
import { Filter as FilterInterface } from './types';
import { FilterMode } from '../models/types';

export const filtersOffers = [
    new Filter({
        name: 'id',
        label: 'search',
        mode: FilterMode.regex,
        placeholder: 'Search by id',
    }),
    new Filter({ name: 'offerType', label: 'Type', options: getOfferOptions() }),
];

export const filtersOrders = [
    new Filter({
        name: 'id',
        label: 'search',
        mode: FilterMode.regex,
        placeholder: 'Search by id',
    }),
];

export const filtersTeeOffers = [
    new Filter({
        name: 'id',
        label: 'search',
        mode: FilterMode.regex,
        placeholder: 'Search by id',
    }),
];

export const filtersProviders = [
    new Filter({
        name: 'address',
        label: 'search',
        mode: FilterMode.regex,
        placeholder: 'Search by address',
    }),
];

export const getFilters = (table: Tables): Filter[] => {
    switch (table) {
        case Tables.Offers:
            return filtersOffers;
        case Tables.Orders:
            return filtersOrders;
        case Tables.TEEOffers:
            return filtersTeeOffers;
        case Tables.Providers:
            return filtersProviders;
        default:
            return [];
    }
};

export const getInitialValues = (filters: Filter[]): FilterInterface => {
    const values = filters.reduce((acc, filter) => ({ ...acc, [filter.name]: filter }), {});
    return {
        values,
    };
};

export const getValidationSchema = (): Yup.SchemaOf<any> => Yup.object({});
