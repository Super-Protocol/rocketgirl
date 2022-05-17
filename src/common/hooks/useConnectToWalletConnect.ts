import { useCallback } from 'react';
import { WalletConnect } from '@web3-react/walletconnect';
import { Actions } from '@web3-react/types';

export interface Balance { matic: string | null, tee: string | null }

export interface ConnectResult {
    accounts: string[];
    chainId: string | null;
    instance: any | null;
}

export interface UseConnectToWalletConnectResult {
    connect: () => Promise<void>;
}

export const getInitialBalance = (): Balance => ({ matic: null, tee: null });

export const getBalance = async (address?: string): Promise<Balance> => {
    return {
        matic: null, // todo
        tee: null, // todo
    };
};

export const useConnectToWalletConnect = (actions: Actions): UseConnectToWalletConnectResult => {
    const connect = useCallback(async () => {
        await new WalletConnect(actions, { qrcode: true }).activate();
    }, [actions]);

    return {
        connect,
    };
};
