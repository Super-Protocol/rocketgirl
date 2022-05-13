import { LazyLoadFetcher, Value } from '@/uikit/types';

export interface OffersListModalPropsFetcherData { description?: string }

export interface OffersListModalProps {
    isMulti?: boolean;
    fetcher?: LazyLoadFetcher<OffersListModalPropsFetcherData> | null;
    value: Value[] | Value;
    onSave?: (values: Value[] | Value) => void;
    name: string;
    formValues: any; // todo
}
