import React, {
    useCallback,
    useMemo,
    useState,
    memo,
} from 'react';
import Web3 from 'web3';
import { useMount } from 'react-use';
import { Web3ReactStateUpdate } from '@web3-react/types';
import { getBalance as getBalanceMetamask, useConnectToMetaMask } from '@/common/hooks/useConnectToMetaMask';
// import { getBalance as getBalanceWalletConnect, useConnectToWalletConnect } from '@/common/hooks/useConnectToWalletConnect';
import { useLocalStorage } from '@/common/hooks/useLocalStorage';
import CONFIG from '@/config';
import toastr from '@/services/Toastr/toastr';
import {
    Balance, Wallet, WalletType, UseWalletResult, SelectedWalletType, WalletContextProps,
} from './types';

export const getInitialWallet = (): Wallet => ({});
export const getInitialBalance = (): Balance => ({ matic: null, tee: null });

export const getBalance = async (walletType: SelectedWalletType, address?: string): Promise<Balance> => {
    switch (walletType) {
        case WalletType.metaMask:
            return getBalanceMetamask(address);
        // case WalletType.walletConnect:
        //     return getBalanceWalletConnect(address);
        default:
            return getInitialBalance();
    }
};

export const useWallet = (): UseWalletResult => {
    const [balance, setBalance] = useState(getInitialBalance);
    const [selectedWalletType, setSelectedWalletType] = useLocalStorage<SelectedWalletType>('wallet', null);
    const [loading, setLoading] = useState(false);
    const [wallet, setWallet] = useState(getInitialWallet);
    const instance = useMemo(() => {
        switch (selectedWalletType) {
            case WalletType.metaMask:
                return window?.ethereum ? new Web3((window as any).ethereum) : undefined;
            default:
                return undefined;
        }
    }, [selectedWalletType]);
    const updateBalance = useCallback(async (walletType: SelectedWalletType, address?: string) => {
        if (address) {
            setBalance(await getBalance(walletType, address));
        }
    }, []);
    const actions = useCallback((walletType: WalletType) => ({
        startActivation: () => () => { setSelectedWalletType(walletType); },
        update: async (stateUpdate: Web3ReactStateUpdate) => {
            setLoading(true);
            const { chainId, accounts } = stateUpdate || {};
            if (chainId && CONFIG.REACT_APP_CHAIN_ID !== chainId) {
                setSelectedWalletType(null);
                toastr.error(new Error('ChainId is not supported'));
                setLoading(false);
                return;
            }
            const selected = accounts?.[0];
            setWallet((s) => ({
                ...s,
                [walletType]: {
                    ...s[walletType],
                    ...(chainId ? { chainId } : {}),
                    ...(accounts ? { accounts } : {}),
                },
            }));
            setSelectedWalletType(walletType);
            await updateBalance(walletType, selected);
            setLoading(false);
        },
        reportError: (error: Error | undefined) => {
            toastr.error(error?.message || 'error');
            setSelectedWalletType(null);
        },
    }), [setSelectedWalletType, updateBalance]);
    const { connect: connectMetaMask } = useConnectToMetaMask(actions(WalletType.metaMask));
    // const { connect: connectWalletConnect } = useConnectToWalletConnect(actions(WalletType.walletConnect));
    const onChangeWallet = useCallback(async (walletType?: SelectedWalletType) => {
        if (loading || !walletType) return;
        setLoading(true);
        try {
            switch (walletType) {
                case WalletType.metaMask:
                    await connectMetaMask();
                    break;
                // case WalletType.walletConnect:
                //     await connectWalletConnect();
                //     break;
                default:
                    break;
            }
        } catch (e) {
            toastr.error(e);
            setSelectedWalletType(null);
        }
        setLoading(false);
    }, [connectMetaMask, setSelectedWalletType, loading]);
    const selectedWallet = useMemo(() => wallet[selectedWalletType as WalletType] || null, [wallet, selectedWalletType]);
    const logout = useCallback(async () => {
        setSelectedWalletType(null);
        setWallet(getInitialWallet());
    }, [setSelectedWalletType]);
    const selectedAddress = useMemo(() => {
        if (!selectedWallet?.accounts?.length) {
            return undefined;
        }
        return Web3.utils.toChecksumAddress(selectedWallet.accounts[0]);
    }, [selectedWallet]);
    const isConnected = useMemo(() => !!selectedAddress, [selectedAddress]);
    useMount(() => {
        onChangeWallet(selectedWalletType);
    });

    return {
        wallet,
        selectedWalletType,
        selectedWallet,
        loading,
        onChangeWallet,
        logout,
        balance,
        instance,
        isConnected,
        selectedAddress,
    };
};

export const WalletContext = React.createContext<WalletContextProps>({
    wallet: getInitialWallet(),
    selectedWalletType: null,
    loading: false,
    onChangeWallet: () => Promise.resolve(),
    selectedWallet: null,
    logout: () => {},
    balance: getInitialBalance(),
    instance: undefined,
    isConnected: false,
    selectedAddress: undefined,
});

export const WalletContextConsumer = WalletContext.Consumer;
export const WalletContextProvider = memo(({ children }) => {
    const wallet = useWallet();
    return (
        <WalletContext.Provider value={wallet}>
            {children}
        </WalletContext.Provider>
    );
});
