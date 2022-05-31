import { LazyLoadFetcher } from '@/uikit/types';
import { Item } from '@/uikit/LazyLoadCheckboxList/types';

export interface OffersListModalPropsFetcherData { description?: string }

export interface OffersListModalProps<Info> {
    isMulti?: boolean;
    fetcher?: LazyLoadFetcher<OffersListModalPropsFetcherData> | null;
    value: Item<Info>[] | Item<Info>;
    onSave?: (values: Item<Info>[] | Item<Info>) => void;
    name: string;
    formValues: any; // todo
    reset?: string[];
}
