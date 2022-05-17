import { useCallback } from 'react';
import Web3 from 'web3';
import { Actions } from '@web3-react/types';
import { MetaMask } from '@web3-react/metamask';
import CONFIG from '@/config';
import { getSuperproTokenCatched } from '@/connectors/superproToken';

export interface Balance { matic: string | null, tee: number | null }

export interface ConnectResult {
    accounts: string[];
    chainId: string | null;
    instance: any | null;
}

export const getInitialBalance = (): Balance => ({ matic: null, tee: null });

export interface UseConnectToMetaMaskResult {
    connect: () => Promise<void>;
}

export const getMaticBalance = async (): Promise<string | null> => {
    try {
        const response = await (window as any).ethereum.request({
            method: 'eth_getBalance', params: [CONFIG.REACT_APP_MATIC_ADDRESS, 'latest'],
        });
        return Web3.utils.fromWei(response);
    } catch (e) {
        console.error('Error get matic balance');
        return null;
    }
};

export const getBalance = async (address?: string): Promise<Balance> => {
    return {
        matic: await getMaticBalance(),
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
