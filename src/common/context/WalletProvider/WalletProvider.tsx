import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import Web3 from 'web3';
import { Web3ReactStateUpdate } from '@web3-react/types';
import { getBalance as getBalanceMetamask, useConnectToMetaMask } from '@/common/hooks/useConnectToMetaMask';
import { getBalance as getBalanceWalletConnect, useConnectToWalletConnect } from '@/common/hooks/useConnectToWalletConnect';
import { useErrorModal } from '@/common/hooks/useErrorModal';
import { useLocalStorage } from '@/common/hooks/useLocalStorage';
import CONFIG from '@/config';
import {
    Balance, Wallet, WalletType, UseWalletResult, SelectedWalletType, WalletContextProps,
} from './types';

export const getInitialWallet = (): Wallet => ({});
export const getInitialBalance = (): Balance => ({ matic: null, tee: null });

export const getBalance = async (walletType: SelectedWalletType, address?: string): Promise<Balance> => {
    switch (walletType) {
        case WalletType.metaMask:
            return getBalanceMetamask();
        case WalletType.walletConnect:
            return getBalanceWalletConnect(address);
        default:
            return getInitialBalance();
    }
};

export const useWallet = (): UseWalletResult => {
    const [balance, setBalance] = useState(getInitialBalance);
    const [selectedWalletType, setSelectedWalletType] = useLocalStorage<SelectedWalletType>('wallet', null);
    const { showErrorModal } = useErrorModal();
    const [loading, setLoading] = useState(false);
    const [wallet, setWallet] = useState(getInitialWallet);
    const instance = useMemo(() => {
        switch (selectedWalletType) {
            case WalletType.metaMask:
                return window?.ethereum ? new Web3((window as any).ethereum) : null;
            default:
                return null;
        }
    }, [selectedWalletType]);
    const updateBalance = useCallback(async (walletType: SelectedWalletType, address?: string) => {
        setBalance(await getBalance(walletType, address));
    }, []);
    const actions = useCallback((walletType: WalletType) => ({
        startActivation: () => () => {},
        update: async (stateUpdate: Web3ReactStateUpdate) => {
            setLoading(true);
            const { chainId, accounts } = stateUpdate || {};
            if (chainId && CONFIG.REACT_APP_CHAIN_ID !== chainId) {
                setWallet((s) => ({ ...s, [walletType]: undefined }));
                setSelectedWalletType(null);
                showErrorModal(new Error('ChainId is not supported'));
                return;
            }
            const selected = accounts?.[0];
            setWallet((s) => ({
                ...s,
                [walletType]: {
                    ...(chainId ? { chainId } : {}),
                    ...(selected ? { address: selected } : {}),
                    ...(accounts ? { accounts } : {}),
                },
            }));
            await updateBalance(walletType, selected);
            setLoading(false);
        },
        reportError: (error: Error | undefined) => {
            showErrorModal(error);
            setSelectedWalletType(null);
            setWallet((s) => ({ ...s, walletType: undefined }));
        },
    }), [showErrorModal, setSelectedWalletType, updateBalance]);
    const { connect: connectMetaMask } = useConnectToMetaMask(actions(WalletType.metaMask));
    const { connect: connectWalletConnect } = useConnectToWalletConnect(actions(WalletType.walletConnect));
    const onChangeWallet = useCallback(async (walletType?: SelectedWalletType) => {
        if (loading || !walletType) return;
        setLoading(true);
        try {
            switch (walletType) {
                case WalletType.metaMask:
                    await connectMetaMask();
                    break;
                case WalletType.walletConnect:
                    await connectWalletConnect();
                    break;
                default:
                    break;
            }
            setSelectedWalletType(walletType);
        } catch (e) {
            showErrorModal(e);
            setSelectedWalletType(null);
        }
        setLoading(false);
    }, [connectMetaMask, showErrorModal, setSelectedWalletType, connectWalletConnect, loading]);
    const selectedWallet = useMemo(() => wallet[selectedWalletType as WalletType] || null, [wallet, selectedWalletType]);
    const logout = useCallback(async () => {
        setSelectedWalletType(null);
        setWallet(getInitialWallet());
    }, [setSelectedWalletType]);

    useEffect(() => {
        onChangeWallet(selectedWalletType);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedWalletType]);

    return {
        wallet,
        selectedWalletType,
        selectedWallet,
        loading,
        onChangeWallet,
        logout,
        balance,
        instance,
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
    instance: null,
});

export const WalletContextConsumer = WalletContext.Consumer;
export const WalletContextProvider = WalletContext.Provider;
