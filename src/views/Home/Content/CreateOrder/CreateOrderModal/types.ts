import { Item } from '@/uikit/LazyLoadCheckboxList/types';

export type Offer<Info> = Item<Info>;

export interface FormValues<Info> {
    solution?: Offer<Info>;
    data?: (Offer<Info> | undefined)[];
    tee?: Offer<Info>;
    storage?: Offer<Info>;
    file?: any; // todo
    deposit?: number;
}

export interface CreateOrderModalProps<Info> {
    initialValues?: FormValues<Info>;
}

export type Info = { description: string; }
