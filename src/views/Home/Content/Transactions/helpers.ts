import { TableTheme } from '@/uikit/Table/types';
import { Tables } from '@/views/Home/types';
import { Filter } from './Filter/models';

export const spinnerProps = { fullscreen: true };

export const styles = { theme: TableTheme.orange };

export const getFilters = (values?: { [x: string]: Filter }): object | null => {
    if (!values || !Object.values(values).length) return null;
    return Object.values(values).reduce((acc, filter) => {
        return {
            ...acc,
            ...(filter.value ? { [filter.name]: filter.value } : undefined),
        };
    }, {});
};

export const tables = [[{ value: Tables.Transactions, label: 'Transactions' }]];
