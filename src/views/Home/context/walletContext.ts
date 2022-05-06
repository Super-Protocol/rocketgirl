import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import Web3 from 'web3';
import { useConnectToMetaMask } from '@/common/hooks/useConnectToMetaMask';
import { useErrorModal } from '@/common/hooks/useErrorModal';
import { useLocalStorage } from '@/common/hooks/useLocalStorage';

export interface WalletMetaMask {
    address: string | null;
    chainId: string | null;
    instance: any;
}

export enum WalletType {
    metaMask = 'metaMask'
}

export interface Wallet {
    [WalletType.metaMask]?: WalletMetaMask;
}

export type SelectedWalletType = WalletType | null;
export type SelectedWallet = WalletMetaMask | null;

export interface UseWalletResult {
    wallet: Wallet;
    selectedWalletType?: SelectedWalletType;
    loading: boolean;
    onChangeWallet: (wallet: SelectedWalletType) => Promise<void>;
    selectedWallet: SelectedWallet;
    logout: () => void;
}

export interface WalletContextProps extends UseWalletResult {}

export const getInitialWallet = (): Wallet => ({ [WalletType.metaMask]: undefined });

export const useWallet = (): UseWalletResult => {
    const [selectedWalletType, setSelectedWalletType] = useLocalStorage<SelectedWalletType>('wallet', null);
    const { showErrorModal } = useErrorModal();
    const [loading, setLoading] = useState(false);
    const [wallet, setWallet] = useState(getInitialWallet);
    const { connect: connectToMetaMaskCb } = useConnectToMetaMask();
    const connectToMetaMask = useCallback(async () => {
        const props = await connectToMetaMaskCb();
        const { accounts, instance, chainId } = props;
        const address = accounts[0];
        const metaMask = { address, instance: instance ? new Web3(instance) : null, chainId };
        setWallet((s) => ({ ...s, [WalletType.metaMask]: metaMask }));
        return metaMask;
    }, [connectToMetaMaskCb]);
    const onChangeWallet = useCallback(async (wallet?: SelectedWalletType) => {
        setLoading(true);
        try {
            switch (wallet) {
                case WalletType.metaMask:
                    await connectToMetaMask();
                    setSelectedWalletType(wallet);
                    return;
                default:
                    return;
            }
        } catch (e) {
            showErrorModal(e);
        }
        setLoading(false);
    }, [connectToMetaMask, showErrorModal, setSelectedWalletType]);
    const selectedWallet = useMemo(() => wallet[selectedWalletType as WalletType] || null, [wallet, selectedWalletType]);
    const logout = useCallback(() => {
        setSelectedWalletType(null);
        setWallet({});
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
    };
};

export const WalletContext = React.createContext<WalletContextProps>({
    wallet: getInitialWallet(),
    selectedWalletType: null,
    loading: false,
    onChangeWallet: () => Promise.resolve(),
    selectedWallet: null,
    logout: () => {},
});

export const WalletContextConsumer = WalletContext.Consumer;
export const WalletContextProvider = WalletContext.Provider;
