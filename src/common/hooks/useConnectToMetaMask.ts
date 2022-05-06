import { useCallback, useEffect } from 'react';
import Web3 from 'web3';
import CONFIG from '@/config';

export interface Balance { matic: string | null, tee: string | null }

export interface ConnectResult {
    accounts: string[];
    chainId: string | null;
    instance: any | null;
}

export const getInitialBalance = (): Balance => ({ matic: null, tee: null });

export interface UseConnectToMetaMaskResult {
    connect: () => Promise<ConnectResult>;
    getBalance: () => Promise<Balance>
}

export const getMaticBalance = async (): Promise<string | null> => {
    try {
        return (window as any).ethereum.request({
            method: 'eth_getBalance', params: [CONFIG.REACT_APP_MATIC_ADDRESS, 'latest'],
        });
    } catch (e) {
        console.error('Error get matic balance');
        return null;
    }
};

export const useConnectToMetaMask = (): UseConnectToMetaMaskResult => {
    const connect = useCallback(async () => {
        const { ethereum } = window as any;
        if (!ethereum) {
            throw new Error('MetaMask browser extension is not defined');
        }
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const chainId = await ethereum.request({ method: 'eth_chainId' });
        if (CONFIG.REACT_APP_CHAIN_ID !== chainId) {
            throw new Error('ChainId is not supported');
        }
        if (!accounts?.length) {
            throw new Error('Account list is empty');
        }
        return {
            accounts,
            chainId,
            instance: ethereum,
        };
    }, []);

    const onChangeEthChainId = useCallback(() => {
        window.location.reload();
    }, []);

    const subscribe = useCallback(() => {
        const { ethereum } = window as any;
        if (ethereum) {
            ethereum.on('chainChanged', onChangeEthChainId);
            return () => {
                ethereum.removeListener('chainChanged', onChangeEthChainId);
            };
        }
        return () => {};
    }, [onChangeEthChainId]);

    const getBalance = useCallback(async () => {
        const maticBalance = await getMaticBalance();
        return {
            matic: maticBalance ? Web3.utils.fromWei(maticBalance) : null,
            tee: null, // todo
        };
    }, []);

    useEffect(() => {
        const subscription = subscribe();
        return () => subscription();
    }, [subscribe]);

    return {
        connect,
        getBalance,
    };
};
