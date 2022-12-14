import {
    SuperproToken,
} from '@super-protocol/sdk-js';
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
    if (!address) return null;
    try {
        const count = await getSuperproToken(address);
        return count ? Web3.utils.fromWei(count) : null;
    } catch (e) {
        console.error('Error get tee balance');
        return null;
    }
};
