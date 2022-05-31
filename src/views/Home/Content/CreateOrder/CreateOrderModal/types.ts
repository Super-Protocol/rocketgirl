import { OperationVariables } from '@apollo/client';
import { Item } from '@/uikit/LazyLoadCheckboxList/types';

export type Info = { description: string; name: string; holdSum?: number; }

export type Offer<Info> = Item<Info, string>;

export enum Fields {
    solution = 'solution',
    data = 'data',
    tee = 'tee',
    storage = 'storage',
    file = 'file',
    deposit = 'deposit',
}

export interface FormValues<Info> {
    [Fields.solution]?: Offer<Info>; // todo add base/additional offers
    [Fields.data]?: (Offer<Info>)[];
    [Fields.tee]?: Offer<Info>;
    [Fields.storage]?: Offer<Info>;
    [Fields.file]?: any; // todo
    [Fields.deposit]?: number;
}

export interface CreateOrderModalProps<Info> {
    initialValues?: FormValues<Info>;
}

export interface GetValidationSchemaProps {
    minDeposit?: number;
}

export interface GetMinDepositWorkflow {
    solution?: Offer<Info>; // todo add base/additional offers
    data?: (Offer<Info>)[];
    tee?: Offer<Info>;
    storage?: Offer<Info>;
}

export interface UpdateFiltersRestrictionsProps<Info> {
    [Fields.data]: FormValues<Info>[Fields.data];
    [Fields.solution]: FormValues<Info>[Fields.solution];
}

export interface GetInitialFiltersResult {
    [Fields.data]: OperationVariables,
    [Fields.solution]: OperationVariables,
    [Fields.tee]: OperationVariables,
    [Fields.storage]: OperationVariables,
}
