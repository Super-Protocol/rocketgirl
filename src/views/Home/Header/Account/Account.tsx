import React, {
    memo,
    FC,
    useContext,
    useCallback,
    useMemo,
} from 'react';
import { Box } from '@/uikit';
import { WalletContext, WalletType } from '@/views/Home/context/walletContext';
import { AccountProps } from './types';

export const Account: FC<AccountProps> = memo(() => {
    const { onChangeWallet, wallet } = useContext(WalletContext);
    const onClickMetamask = useCallback(async () => {
        await onChangeWallet(WalletType.metaMask);
    }, [onChangeWallet]);
    const address = useMemo(() => wallet.metaMask?.address, [wallet.metaMask]);
    return (
        <Box>
            {!address ? <button onClick={onClickMetamask}>connect</button> : address}
        </Box>
    );
});
