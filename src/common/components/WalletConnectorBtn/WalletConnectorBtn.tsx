import React, {
    memo,
    FC,
    useContext,
    useCallback,
} from 'react';
import { WalletContext, WalletType } from '@/common/context/WalletProvider';
import { Button } from '@/uikit';
import { WalletConnectorBtnProps } from './types';

export const WalletConnectorBtn: FC<WalletConnectorBtnProps> = memo(() => {
    const {
        onChangeWallet,
        loading,
        isConnected,
    } = useContext(WalletContext);
    const onClickMetamask = useCallback(async () => {
        await onChangeWallet(WalletType.metaMask);
    }, [onChangeWallet]);
    if (isConnected) return null;
    return <Button variant="primary" onClick={onClickMetamask} loading={loading}>Connect wallet</Button>;
});
