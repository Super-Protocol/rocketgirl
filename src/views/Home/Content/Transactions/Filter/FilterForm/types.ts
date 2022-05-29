import { Item } from '@/uikit/Select/types';
import { Filter as FilterModel } from '../models';

export interface FilterFormProps {
    onSubmit: (values: any) => void | Promise<any>;
}

export enum Dict {
    offerTypes = 'offerTypes',
}

export interface GetInitialDict {
    [Dict.offerTypes]: Item[];
}

export interface FilterFormikProps {
    onSubmit: (values: any) => void | Promise<any>
}

export interface FilterValues {
    [x: string]: FilterModel;
}

export interface Filter {
    values?: FilterValues;
}
