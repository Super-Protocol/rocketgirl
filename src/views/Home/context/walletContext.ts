import React, {
    useCallback,
    useMemo,
    useState,
} from 'react';
import Web3 from 'web3';
import { useConnectToMetaMask } from '@/common/hooks/useConnectToMetaMask';
import { useErrorModal } from '@/common/hooks/useErrorModal';

export interface WalletMetaMask {
    address: string | null;
    chainId: string | null;
    instance: any;
}

export enum WalletList {
    metaMask = 'metaMask'
}

export interface Wallet {
    [WalletList.metaMask]?: WalletMetaMask;
}

export interface UseWalletResult {
    wallet: Wallet;
    selected: WalletList | null;
    loading: boolean;
    onChangeWallet: (wallet: WalletList) => Promise<void>;
    selectedWallet: WalletMetaMask | null;
}

export interface WalletContextProps extends UseWalletResult {}

export const getInitialWallet = (): Wallet => ({ [WalletList.metaMask]: undefined });

export const useWallet = (): UseWalletResult => {
    const [selected, setSelected] = useState<WalletList | null>(null);
    const { showErrorModal } = useErrorModal();
    const [loading, setLoading] = useState(false);
    const [wallet, setWallet] = useState(getInitialWallet);
    const { connect: connectToMetaMaskCb } = useConnectToMetaMask();
    const connectToMetaMask = useCallback(async () => {
        const props = await connectToMetaMaskCb();
        const { accounts, instance, chainId } = props;
        const address = accounts[0];
        const metaMask = { address, instance: instance ? new Web3(instance) : null, chainId };
        setWallet((s) => ({ ...s, [WalletList.metaMask]: metaMask }));
        return metaMask;
    }, [connectToMetaMaskCb]);
    const onChangeWallet = useCallback(async (wallet: WalletList) => {
        setLoading(true);
        try {
            switch (wallet) {
                case WalletList.metaMask:
                    await connectToMetaMask();
                    setSelected(wallet);
                    return;
                default:
                    return;
            }
        } catch (e) {
            showErrorModal(e);
        }
        setLoading(false);
    }, [connectToMetaMask, showErrorModal]);
    const selectedWallet = useMemo(() => wallet[selected as WalletList] || null, [wallet, selected]);
    return {
        wallet,
        selected,
        selectedWallet,
        loading,
        onChangeWallet,
    };
};

export const WalletContext = React.createContext<WalletContextProps>({
    wallet: getInitialWallet(),
    selected: null,
    loading: false,
    onChangeWallet: () => Promise.resolve(),
    selectedWallet: null,
});

export const WalletContextConsumer = WalletContext.Consumer;
export const WalletContextProvider = WalletContext.Provider;
