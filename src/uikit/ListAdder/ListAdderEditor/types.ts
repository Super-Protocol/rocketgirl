import { ApolloError } from '@apollo/client';
import { LazyLoadFetcher, Value } from '@/uikit/types';

export interface ListAdderEditorFetcherData { description?: string }

export interface ListAdderEditorProps {
    fetcher?: LazyLoadFetcher<ListAdderEditorFetcherData> | null;
    isMulti?: boolean;
    values: Value[] | Value;
    onSave?: (values: Value[] | Value) => void;
    onCancel?: () => void;
    classes?: {
        wrap?: string;
    };
    onError?: (e?: ApolloError | unknown) => void;
}
