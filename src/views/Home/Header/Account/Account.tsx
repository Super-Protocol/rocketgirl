import React, {
    memo,
    FC,
    useContext,
} from 'react';
import {
    Box,
} from '@/uikit';
import { WalletContext } from '@/common/context/WalletProvider';
import { WalletConnectorBtn } from '@/common/components/WalletConnectorBtn';
import { AccountDropdown } from './AccountDropdown';
import { AccountProps } from './types';
import classes from './Account.module.scss';

export const Account: FC<AccountProps> = memo(() => {
    const {
        balance,
        selectedAddress,
    } = useContext(WalletContext);
    return (
        <Box>
            {
                !selectedAddress
                    ? <WalletConnectorBtn />
                    : (
                        <Box alignItems="center">
                            <Box className={classes.balance}>
                                {balance.matic || '-'} MATIC / {balance.tee || '-'} TEE
                            </Box>
                            <AccountDropdown />
                        </Box>
                    )
            }
        </Box>
    );
});
