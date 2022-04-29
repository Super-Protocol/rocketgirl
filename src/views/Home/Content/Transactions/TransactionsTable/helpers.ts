import { Columns } from './types';

export const filteredColumns: string[] = ['txn_hash', 'from', 'to'];

export const getFilteredData = (data: Columns[], search = ''): Columns[] => data
    .filter((obj) => filteredColumns.some((key) => (obj[key] || '').includes(search)));
