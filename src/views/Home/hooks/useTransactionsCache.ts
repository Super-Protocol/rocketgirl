import { useCallback, useState } from 'react';
import merge from 'lodash.merge';
import { Columns } from '@/views/Home/Content/Transactions/TransactionsTable/types';
import { getTransactions, GetTransactionsResult } from '@/connectors/transactions';

export interface UseTransactionsCacheResult {
    getCachedTransactions: () => Promise<Columns[]>;
}

export const transactionsConverter = (data: GetTransactionsResult): { lastBlock: number; transactions: Columns[] } => {
    const transactions = Object.values(data?.transactionsByAddress || {}).reduce((acc, list) => acc.concat(list), []);
    return {
        lastBlock: data?.lastBlock,
        transactions: (transactions || []).map(({
            hash,
            blockHash,
            from,
            to,
            timestamp,
        }) => ({
            txnHash: hash,
            block: blockHash,
            from,
            to,
            dateTime: timestamp,
            method: '',
        })),
    };
};

export const getMappedTransactions = (
    newTransactions: GetTransactionsResult,
    lastTransactions: GetTransactionsResult,
): GetTransactionsResult => {
    return {
        lastBlock: newTransactions?.lastBlock,
        transactionsByAddress: merge(lastTransactions?.transactionsByAddress || {}, newTransactions?.transactionsByAddress || {}),
    };
};

export const useTransactionsCache = (): UseTransactionsCacheResult => {
    const [lastTransactions, setLastTransactions] = useState<GetTransactionsResult>();
    const getCachedTransactions = useCallback(async () => {
        let transactions = await getTransactions(lastTransactions?.lastBlock);
        if (lastTransactions) {
            transactions = getMappedTransactions(transactions, lastTransactions);
        }
        setLastTransactions(transactions);
        const transactionsConverted = transactionsConverter(transactions);
        return transactionsConverted.transactions;
    }, [lastTransactions]);
    return {
        getCachedTransactions,
    };
};
