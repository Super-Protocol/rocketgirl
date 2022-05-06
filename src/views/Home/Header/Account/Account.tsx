import React, {
    memo,
    FC,
    useContext,
    useCallback,
    useMemo,
} from 'react';
import { Box, Dropdown, Button } from '@/uikit';
import { WalletContext, WalletType } from '@/views/Home/context/walletContext';
import { AccountProps } from './types';
import classes from './Account.module.scss';

export const Account: FC<AccountProps> = memo(() => {
    const {
        onChangeWallet,
        wallet,
        logout,
        balance,
        loading,
    } = useContext(WalletContext);
    const onClickMetamask = useCallback(async () => {
        await onChangeWallet(WalletType.metaMask);
    }, [onChangeWallet]);
    const address = useMemo(() => wallet.metaMask?.address, [wallet.metaMask]);
    const list = useMemo(() => (
        address
            ? [{ value: address, label: address }, { value: null, label: 'logout' }]
            : []
    ), [address]);
    const onChange = useCallback((value) => {
        if (!value) logout();
    }, [logout]);

    return (
        <Box>
            {
                !address
                    ? <Button variant="orange" onClick={onClickMetamask} loading={loading}>Connect wallet</Button>
                    : (
                        <Box alignItems="center">
                            <Box className={classes.balance}>
                                {balance.matic || '-'} MATIC / {balance.tee || '-'} TEE
                            </Box>
                            <Dropdown active={address} list={list} classNameWrap={classes.wrap} onChange={onChange} />
                        </Box>
                    )
            }
        </Box>
    );
});
