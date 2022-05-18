import { ApolloError } from '@apollo/client';
import { LazyLoadFetcher } from '@/uikit/types';
import { Item } from '@/uikit/LazyLoadCheckboxList/types';

export interface ListAdderEditorFetcherData { description?: string }

export interface ListAdderEditorProps<Info> {
    fetcher?: LazyLoadFetcher<ListAdderEditorFetcherData> | null;
    isMulti?: boolean;
    values: Item<Info>[] | Item<Info>;
    onSave?: (values: Item<Info>[] | Item<Info>) => void;
    onCancel?: () => void;
    classes?: {
        wrap?: string;
    };
    onError?: (e?: ApolloError | unknown) => void;
}
