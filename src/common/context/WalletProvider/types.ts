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
export interface Balance { matic: string | null, tee: string | null }

export interface UseWalletResult {
    wallet: Wallet;
    selectedWalletType?: SelectedWalletType;
    loading: boolean;
    onChangeWallet: (wallet: SelectedWalletType) => Promise<void>;
    selectedWallet: SelectedWallet;
    logout: () => void;
    balance: Balance;
}

export interface WalletContextProps extends UseWalletResult {}
