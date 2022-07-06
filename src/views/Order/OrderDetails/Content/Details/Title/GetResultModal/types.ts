import { OrderStatus } from '@super-protocol/sp-sdk-js';

export interface GetResultModalProps {
    orderAddress: string;
    status?: OrderStatus;
}

export interface FormValues {
    phrase?: string;
}

export enum Fields {
    phrase = 'phrase',
    agreement = 'agreement',
    phraseTabMode = 'phraseTabMode',
}

export type ErrorDecription = {
    name: string;
    message: string;
}
