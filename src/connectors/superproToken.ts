import {
    SuperproToken,
} from '@super-protocol/sp-sdk-js';
import Web3 from 'web3';

export interface TransferTokenProps {
    from: string;
    to: string;
    amount: number;
    instance?: Web3;
}

export const getSuperproToken = async (address?: string): Promise<string | null> => {
    if (!address) return null;
    return SuperproToken.balanceOf(address);
};

export const getSuperproTokenCatched = async (address?: string): Promise<string | null> => {
    try {
        return getSuperproToken(address);
    } catch (e) {
        console.error('Error get tee balance');
        return null;
    }
};
