export type Value = string | number | undefined | boolean | null;

export interface Item<Val = Value, Data = any> {
    value: Val;
    label?: string;
    data?: Data;
}

export type LazyLoadFetcherResult<Data> = { options?: Item<Value, Data>[], cursor?: string | null, input?: string | null };

export type LazyLoadFetcherProps = { cursor?: string | null; search?: string | null; signal?: AbortSignal };

export type LazyLoadFetcher<Data> = (props: LazyLoadFetcherProps) => Promise<LazyLoadFetcherResult<Data>>;
