import { useCallback, useEffect } from 'react';
import CONFIG from '@/config';

export interface ConnectResult {
    accounts: string[];
    chainId: string | null;
    instance: any | null;
}

export interface UseConnectToMetaMaskResult {
    connect: () => Promise<ConnectResult>;
}

export const useConnectToMetaMask = (): UseConnectToMetaMaskResult => {
    const connect = useCallback(async () => {
        const { ethereum } = window as any;
        if (!ethereum) {
            throw new Error('MetaMask browser extension is not defined');
        }
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const chainId = await ethereum.request({ method: 'eth_chainId' });
        if (CONFIG.REACT_APP_METAMASK_CHAIN_ID !== chainId) {
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
        // window.location.reload();
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

    useEffect(() => {
        const subscription = subscribe();
        return () => subscription();
    }, [subscribe]);

    return {
        connect,
    };
};
