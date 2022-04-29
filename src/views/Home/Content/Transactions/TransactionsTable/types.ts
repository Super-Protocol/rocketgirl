import { UseTablesFetcherResult } from '@/views/Home/hooks/useTablesFetcher';

export interface TransactionsTableProps {
    search?: string;
    fetcher: UseTablesFetcherResult;
}

export type Columns = {
    txnHash: string;
    method: string;
    block: string | null;
    dateTime: number;
    from: string;
    to: string | null;
}

export interface GetColumnsProps {
    onClickTxnHash?: (value: string) => void;
}
