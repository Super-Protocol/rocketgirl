import { useCallback } from 'react';
import Web3 from 'web3';
import { Actions } from '@web3-react/types';
import { MetaMask } from '@web3-react/metamask';
import CONFIG from '@/config';
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
    switchNetwork: () => Promise<void>;
    addTeeToken: () => Promise<void>;
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
    const switchNetwork = useCallback(async () => {
        if (!(window as any).ethereum) {
            throw new Error('Metamask is not defined');
        }
        try {
            await (window as any).ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: Web3.utils.toHex(CONFIG.REACT_APP_NETWORK_CHAIN_ID) }],
            });
        } catch (switchError) {
            // This error code indicates that the chain has not been added to MetaMask.
            if ((switchError as any).code === 4902) {
                await (window as any).ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            chainId: Web3.utils.toHex(CONFIG.REACT_APP_NETWORK_CHAIN_ID),
                            chainName: CONFIG.REACT_APP_NETWORK_NAME,
                            rpcUrls: [CONFIG.REACT_APP_NETWORK_RPC],
                        },
                    ],
                });
            }
            throw switchError;
        }
    }, []);

    const addTeeToken = useCallback(async () => {
        const success = (window as any).ethereum
            .request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: {
                        address: CONFIG.REACT_APP_NETWORK_TEE_TOKEN,
                        symbol: 'TEE',
                        decimals: 18,
                    },
                },
            });
        if (!success) throw new Error('Add tee token error');
    }, []);

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

    return {
        connect,
        switchNetwork,
        addTeeToken,
    };
};
