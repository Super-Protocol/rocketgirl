import { SelectLazyLoadFetcher, Value } from '@/uikit/Select/types';

export interface OffersListModalProps {
    isMulti?: boolean;
    fetcher?: SelectLazyLoadFetcher | null;
    value: Value[] | Value;
    onSave?: (values: Value[] | Value) => void;
    name: string;
    formValues: any; // todo
}
