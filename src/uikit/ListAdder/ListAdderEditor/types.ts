import { SelectLazyLoadFetcher, Value } from '@/uikit/Select/types';

export interface ListAdderEditorProps {
    fetcher?: SelectLazyLoadFetcher | null;
    isMulti?: boolean;
    values: Value[] | Value;
    onSave?: (values: Value[] | Value) => void;
    onCancel?: () => void;
    classes?: {
        wrap?: string;
    };
}
