import { OrderStatus } from '@super-protocol/sdk-js';

export interface GetResultModalProps {
    orderId: string;
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
