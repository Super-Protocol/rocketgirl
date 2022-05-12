import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import Web3 from 'web3';
import { useApolloClient } from '@apollo/client';
import { useConnectToMetaMask } from '@/common/hooks/useConnectToMetaMask';
import { useErrorModal } from '@/common/hooks/useErrorModal';
import { useLocalStorage } from '@/common/hooks/useLocalStorage';

import {
    Balance, Wallet, WalletType, UseWalletResult, SelectedWalletType, WalletContextProps,
} from './types';

export const getInitialWallet = (): Wallet => ({ [WalletType.metaMask]: undefined });
export const getInitialBalance = (): Balance => ({ matic: null, tee: null });

export const useWallet = (): UseWalletResult => {
    const client = useApolloClient();
    const [balance, setBalance] = useState(getInitialBalance);
    const [selectedWalletType, setSelectedWalletType] = useLocalStorage<SelectedWalletType>('wallet', null);
    const { showErrorModal } = useErrorModal();
    const [loading, setLoading] = useState(false);
    const [wallet, setWallet] = useState(getInitialWallet);
    const { connect: connectMetaMask, getBalance: getBalanceMetamask } = useConnectToMetaMask();
    const connectToMetaMask = useCallback(async () => {
        const props = await connectMetaMask();
        const { accounts, instance, chainId } = props;
        const address = accounts[0];
        const metaMask = { address, instance: instance ? new Web3(instance) : null, chainId };
        setWallet((s) => ({ ...s, [WalletType.metaMask]: metaMask }));
        return metaMask;
    }, [connectMetaMask]);
    const getBalance = useCallback(async (walletType: SelectedWalletType) => {
        switch (walletType) {
            case WalletType.metaMask:
                return getBalanceMetamask();
            default:
                return getInitialBalance();
        }
    }, [getBalanceMetamask]);
    const updateBalance = useCallback(async (walletType: SelectedWalletType) => {
        setBalance(await getBalance(walletType));
    }, [getBalance]);
    const onChangeWallet = useCallback(async (walletType?: SelectedWalletType) => {
        setLoading(true);
        try {
            switch (walletType) {
                case WalletType.metaMask:
                    await connectToMetaMask();
                    await updateBalance(walletType);
                    setSelectedWalletType(walletType);
                    break;
                default:
                    break;
            }
        } catch (e) {
            showErrorModal(e);
            setSelectedWalletType(null);
        }
        setLoading(false);
    }, [connectToMetaMask, showErrorModal, setSelectedWalletType, updateBalance]);
    const selectedWallet = useMemo(() => wallet[selectedWalletType as WalletType] || null, [wallet, selectedWalletType]);
    const logout = useCallback(async () => {
        setSelectedWalletType(null);
        setWallet({});
        await client.resetStore();
    }, [setSelectedWalletType, client]);

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
});

export const WalletContextConsumer = WalletContext.Consumer;
export const WalletContextProvider = WalletContext.Provider;
