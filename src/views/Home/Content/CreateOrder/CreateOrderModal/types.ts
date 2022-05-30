import { Item } from '@/uikit/LazyLoadCheckboxList/types';

export type Info = { description: string; name: string; holdSum?: number; }

export type Offer<Info> = Item<Info, string>;

export interface FormValues<Info> {
    solution?: Offer<Info>; // todo add base/additional offers
    data?: (Offer<Info>)[];
    tee?: Offer<Info>;
    storage?: Offer<Info>;
    file?: any; // todo
    deposit?: number;
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
