import { Item } from '@/uikit/Select/types';

export interface FilterFormProps {}

export enum Dict {
    offerTypes = 'offerTypes',
}

export interface GetInitialDict {
    [Dict.offerTypes]: Item[];
}
