import * as Yup from 'yup';
import { Filter } from '../models';
import { Filter as FilterInterface } from './types';
import { FilterMode } from '../models/types';

export const filtersTransactions = [
    new Filter({
        name: 'hash',
        label: 'search',
        mode: FilterMode.regex,
        placeholder: 'Search by Tnx hash',
    }),
];

export const getFilters = (): Filter[] => {
    return filtersTransactions;
};

export const getInitialValues = (filters: Filter[]): FilterInterface => {
    const values = filters.reduce((acc, filter) => ({ ...acc, [filter.name]: filter }), {});
    return {
        values,
    };
};

export const getValidationSchema = (): Yup.SchemaOf<any> => Yup.object({});
