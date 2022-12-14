import React, {
    useCallback,
    useMemo,
    useState,
    memo,
    useEffect,
    useRef,
} from 'react';
import Web3 from 'web3';
import { useDebouncedCallback } from 'use-debounce';
import { useMount } from 'react-use';
import { Web3ReactStateUpdate } from '@web3-react/types';
import CONFIG from '@/config';
import { useConnectToMetaMask } from '@/common/hooks/useConnectToMetaMask';
import { useLocalStorage } from '@/common/hooks/useLocalStorage';
import toastr from '@/services/Toastr/toastr';
import {
    Balance, Wallet, WalletType, UseWalletResult, SelectedWalletType, WalletContextProps,
} from './types';

export const getInitialWallet = (): Wallet => ({});
export const getInitialBalance = (): Balance => ({ matic: undefined, tee: undefined });
const INTERVAL_BALANCE_UPDATE = 15000;

export const useWallet = (): UseWalletResult => {
    const interval = useRef<number | null>();
    const [balance, setBalance] = useState(getInitialBalance);
    const [selectedWalletType, setSelectedWalletType] = useLocalStorage<SelectedWalletType>('wallet', null);
    const [loading, setLoading] = useState(false);
    const [loadingBalance, setLoadingBalance] = useState(false);
    const [wallet, setWallet] = useState(getInitialWallet);
    const instance = useMemo(() => {
        switch (selectedWalletType) {
            case WalletType.metaMask:
                return window?.ethereum ? new Web3((window as any).ethereum) : undefined;
            default:
                return undefined;
        }
    }, [selectedWalletType]);
    const selectedWallet = useMemo(() => wallet[selectedWalletType as WalletType] || null, [wallet, selectedWalletType]);
    const selectedAddress = useMemo(() => {
        if (!selectedWallet?.accounts?.length) {
            return undefined;
        }
        return Web3.utils.toChecksumAddress(selectedWallet.accounts[0]);
    }, [selectedWallet]);

    const actions = useCallback((walletType: WalletType) => ({
        startActivation: () => () => setSelectedWalletType(walletType),
        update: async (stateUpdate: Web3ReactStateUpdate) => {
            setLoading(true);
            const { chainId, accounts } = stateUpdate || {};
            setWallet((s) => ({
                ...s,
                [walletType]: {
                    ...s[walletType],
                    ...(chainId ? { chainId } : {}),
                    ...(accounts ? { accounts } : {}),
                },
            }));
            setSelectedWalletType(chainId && CONFIG.REACT_APP_NETWORK_CHAIN_ID !== chainId ? null : walletType);
            setLoading(false);
        },
        resetState: () => {
            setSelectedWalletType(null);
        },
    }), [setSelectedWalletType]);
    const { connect: connectMetaMask, getBalance } = useConnectToMetaMask(actions(WalletType.metaMask));
    const updateBalance = useCallback(async () => {
        try {
            setLoadingBalance(true);
            if (selectedWalletType && selectedAddress) {
                setBalance(await getBalance(selectedAddress));
            }
        } catch (e) {
            toastr.error((e as Error)?.message);
        } finally {
            setLoadingBalance(false);
        }
    }, [selectedAddress, getBalance, selectedWalletType]);
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
            toastr.error((e as Error)?.message);
            setSelectedWalletType(null);
        }
        setLoading(false);
    }, [connectMetaMask, setSelectedWalletType, loading]);
    const logout = useCallback(async () => {
        setSelectedWalletType(null);
        setWallet(getInitialWallet());
    }, [setSelectedWalletType]);
    const isConnected = useMemo(() => !!selectedAddress, [selectedAddress]);
    const debounceUpdateBalance = useDebouncedCallback(updateBalance, 300);
    const intervalBalanceUpdate = useCallback(() => {
        if (interval.current) {
            clearInterval(interval.current);
        }
        interval.current = window.setInterval(() => {
            debounceUpdateBalance();
        }, INTERVAL_BALANCE_UPDATE);
    }, [debounceUpdateBalance]);
    useMount(() => {
        onChangeWallet(selectedWalletType);
    });

    useEffect(() => {
        debounceUpdateBalance();
    }, [selectedWallet, debounceUpdateBalance]);

    useEffect(() => {
        intervalBalanceUpdate();
        return () => {
            if (interval.current) {
                clearInterval(interval.current);
            }
        };
    }, [intervalBalanceUpdate]);

    return {
        wallet,
        selectedWalletType,
        selectedWallet,
        loading,
        loadingBalance,
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
    loadingBalance: false,
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
