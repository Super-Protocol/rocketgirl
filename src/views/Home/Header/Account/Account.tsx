import React, {
    memo,
    FC,
    useContext,
    useCallback,
    useMemo,
} from 'react';
import {
    Box,
    Dropdown,
} from '@/uikit';
import { WalletContext } from '@/common/context/WalletProvider';
import { WalletConnectorBtn } from '@/common/components/WalletConnectorBtn';
import { AccountProps } from './types';
import classes from './Account.module.scss';

export const Account: FC<AccountProps> = memo(() => {
    const {
        logout,
        balance,
        loading,
        selectedWallet,
    } = useContext(WalletContext);
    const address = useMemo(() => selectedWallet?.address, [selectedWallet]);
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
                    ? <WalletConnectorBtn />
                    : (
                        <Box alignItems="center">
                            <Box className={classes.balance}>
                                {balance.matic || '-'} MATIC / {balance.tee || '-'} TEE
                            </Box>
                            <Dropdown
                                active={address}
                                list={list}
                                classNameWrap={classes.wrap}
                                onChange={onChange}
                                loading={loading}
                            />
                        </Box>
                    )
            }
        </Box>
    );
});
