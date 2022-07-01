import Web3 from 'web3';

export interface WalletInfo {
    chainId?: number | null;
    accounts?: string[];
}

export enum WalletType {
    metaMask = 'metaMask',
}

export interface Wallet {
    [WalletType.metaMask]?: WalletInfo;
}

export type SelectedWalletType = WalletType | null;
export type SelectedWallet = WalletInfo | null;
export interface Balance { matic: string | null, tee: string | null }

export interface UseWalletResult {
    wallet: Wallet;
    selectedWalletType?: SelectedWalletType;
    loading: boolean;
    onChangeWallet: (wallet: SelectedWalletType) => Promise<void>;
    selectedWallet: SelectedWallet;
    logout: () => void;
    balance: Balance;
    instance?: Web3;
    isConnected: boolean;
    selectedAddress?: string;
}

export interface WalletContextProps extends UseWalletResult {}
