import { useCallback } from 'react';
import { useBalanceOfLazyQuery, useTeeBalanceOfLazyQuery } from '@/gql/graphql';
import { Actions } from '@web3-react/types';
import { MetaMask } from '@web3-react/metamask';
import CONFIG from '@/config';
import { BigNumber } from 'bignumber.js';

export interface Balance { matic?: BigNumber, tee?: BigNumber }

export interface ConnectResult {
    accounts: string[];
    chainId: string | null;
    instance: any | null;
}

export const getInitialBalance = (): Balance => ({ matic: undefined, tee: undefined });

export interface UseConnectToMetaMaskResult {
    connect: () => Promise<void>;
    getBalance: (address: string) => Promise<Balance>;
}

export const useConnectToMetaMask = (actions: Actions): UseConnectToMetaMaskResult => {
    const [getBalanceOf] = useBalanceOfLazyQuery();
    const [getTeeBalanceOf] = useTeeBalanceOfLazyQuery();

    const connect = useCallback(async () => {
        const metamask = new MetaMask({ actions });
        await metamask.activate({
            chainId: CONFIG.REACT_APP_NETWORK_CHAIN_ID,
            chainName: CONFIG.REACT_APP_NETWORK_NAME,
            rpcUrls: [CONFIG.REACT_APP_NETWORK_RPC],
            nativeCurrency: {
                name: 'MATIC',
                symbol: 'MATIC',
                decimals: 18,
            },
            blockExplorerUrls: [CONFIG.REACT_APP_NETWORK_POLYGON_SCAN],
        });
    }, [actions]);

    const getBalance = useCallback(async (address: string): Promise<Balance> => {
        return {
            matic: await getBalanceOf({ variables: { address }, fetchPolicy: 'network-only' })
                .then(({ data }) => (typeof data?.result === 'string' ? new BigNumber(data?.result || '0') : undefined))
                .catch(() => undefined),
            tee: await getTeeBalanceOf({ variables: { address }, fetchPolicy: 'network-only' })
                .then(({ data }) => (typeof data?.result === 'string' ? new BigNumber(data?.result || '0') : undefined))
                .catch(() => undefined),
        };
    }, [getBalanceOf, getTeeBalanceOf]);

    return {
        connect,
        getBalance,
    };
};
