import React, {
    memo,
    FC,
    useContext,
    useCallback,
    useMemo, useEffect,
} from 'react';
import Web3 from 'web3';
import { Box, Dropdown, Button } from '@/uikit';
import { WalletContext, WalletType } from '@/views/Home/context/walletContext';
import { AccountProps } from './types';
import classes from './Account.module.scss';

export const Account: FC<AccountProps> = memo(() => {
    const { onChangeWallet, wallet, logout } = useContext(WalletContext);
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
    const list = useMemo(() => (
        address
            ? [{ value: address, label: address }, { value: null, label: 'logout' }]
            : []
    ), [address]);
    const onChange = useCallback((value) => {
        if (!value) logout();
    }, [logout]);

    useEffect(() => {
        updateBalance(address);
    }, [address, updateBalance]);

    return (
        <Box>
            {
                !address
                    ? <Button variant="orange" onClick={onClickMetamask}>Connect wallet</Button>
                    : (
                        <Box alignItems="center">
                            <Box className={classes.balance}>BALANCE HERE</Box>
                            <Dropdown active={address} list={list} classNameWrap={classes.wrap} onChange={onChange} />
                        </Box>
                    )
            }
        </Box>
    );
});
