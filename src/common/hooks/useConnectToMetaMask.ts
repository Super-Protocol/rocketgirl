import { useCallback } from 'react';
import Web3 from 'web3';
import { Actions } from '@web3-react/types';
import { MetaMask } from '@web3-react/metamask';
import { getSuperproTokenCatched } from '@/connectors/superproToken';

export interface Balance { matic: string | null, tee: string | null }

export interface ConnectResult {
    accounts: string[];
    chainId: string | null;
    instance: any | null;
}

export const getInitialBalance = (): Balance => ({ matic: null, tee: null });

export interface UseConnectToMetaMaskResult {
    connect: () => Promise<void>;
}

export const getMaticBalance = async (address?: string): Promise<string | null> => {
    if (!address) return null;
    try {
        const response = await (window as any).ethereum.request({
            method: 'eth_getBalance', params: [address, 'latest'],
        });
        return Web3.utils.fromWei(response);
    } catch (e) {
        console.error('Error get matic balance');
        return null;
    }
};

export const getBalance = async (address?: string): Promise<Balance> => {
    return {
        matic: await getMaticBalance(address),
        tee: await getSuperproTokenCatched(address),
    };
};

export const useConnectToMetaMask = (actions: Actions): UseConnectToMetaMaskResult => {
    const connect = useCallback(async () => {
        await new MetaMask(actions).activate();
    }, [actions]);

    return {
        connect,
    };
};
