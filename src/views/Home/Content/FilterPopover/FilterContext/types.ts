import { Tables } from '@/views/Home/types';
import { Filter as FilterModel } from '../models';

export interface FilterContextProps {
    table: Tables;
    onSubmit: (values: any) => void | Promise<any>
}

export interface FilterValues {
    [x: string]: FilterModel;
}

export interface Filter {
    values?: FilterValues;
}
