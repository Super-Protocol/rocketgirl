import React, {
    memo,
    FC,
    useContext,
    useCallback,
    useMemo, useEffect,
} from 'react';
import Web3 from 'web3';
import { Box } from '@/uikit';
import { WalletContext, WalletType } from '@/views/Home/context/walletContext';
import { AccountProps } from './types';

export const Account: FC<AccountProps> = memo(() => {
    const { onChangeWallet, wallet } = useContext(WalletContext);
    const onClickMetamask = useCallback(async () => {
        await onChangeWallet(WalletType.metaMask);
    }, [onChangeWallet]);
    const address = useMemo(() => wallet.metaMask?.address, [wallet.metaMask]);
    const updateBalance = useCallback(async (address) => {
        if (address) {
            // const count = await (window as any).ethereum.request({ method: 'eth_getBalance', params: ['0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0'] });
            // console.log('11', Web3.utils.fromWei(count), count);
            // todo get balance
        }
    }, []);
    useEffect(() => {
        updateBalance(address);
    }, [address, updateBalance]);
    return (
        <Box>
            {!address ? <button onClick={onClickMetamask}>connect</button> : address}
        </Box>
    );
});
