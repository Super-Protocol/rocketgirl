import BlockchainConnector from '@super-protocol/sp-sdk-js';
import { Transaction } from '@super-protocol/sp-sdk-js/build/types/Web3';

export interface GetTransactionsResult {
    transactionsByAddress: {
        [key: string]: Transaction[];
    };
    lastBlock: number;
}

export const getTransactions = async (startBlock?: number): Promise<GetTransactionsResult> => {
    const { lastBlock, transactionsByAddress } = await BlockchainConnector.getTransactions([], startBlock); // todo addresses
    return {
        lastBlock,
        transactionsByAddress,
    };
};
