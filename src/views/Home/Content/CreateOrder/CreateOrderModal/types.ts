import { OperationVariables } from '@apollo/client';
import { Item } from '@/uikit/LazyLoadCheckboxList/types';

export type Info = {
    description: string;
    name: string;
    holdSum: string;
    restrictions?: string[] | null;
    sub?: FormOffer[];
    externalId: string;
}

export type FormOffer = Item<Info, string>;

export enum Fields {
    solution = 'solution',
    data = 'data',
    tee = 'tee',
    storage = 'storage',
    file = 'file',
    deposit = 'deposit',
    phraseGenerated = 'phraseGenerated',
    phraseInput = 'phraseInput',
    phraseTabMode = 'phraseTabMode',
    agreement = 'agreement',
}

export interface FormValues {
    [Fields.solution]?: FormOffer;
    [Fields.data]?: FormOffer[];
    [Fields.tee]?: FormOffer;
    [Fields.storage]?: FormOffer;
    [Fields.file]?: File | null;
    [Fields.deposit]?: number;
    [Fields.phraseInput]?: string;
    [Fields.phraseGenerated]?: string;
    [Fields.agreement]?: boolean;
    [Fields.phraseTabMode]?: string;
}

export interface CreateOrderModalProps {
    initialValues?: FormValues;
}

export interface GetValidationSchemaProps {
    minDeposit?: number;
}

export interface GetMinDepositWorkflow {
    solution?: FormOffer[];
    data?: FormOffer[];
    tee?: FormOffer;
    storage?: FormOffer;
}

export interface UpdateFiltersRestrictionsProps {
    [Fields.data]: FormValues[Fields.data];
    [Fields.solution]: FormValues[Fields.solution];
}

export interface GetInitialFiltersResult {
    [Fields.data]: OperationVariables,
    [Fields.solution]: OperationVariables,
    [Fields.tee]: OperationVariables,
    [Fields.storage]: OperationVariables,
}
