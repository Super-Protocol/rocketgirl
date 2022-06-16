import React, {
    memo,
    FC,
    useContext,
    useMemo,
} from 'react';
import Web3 from 'web3';
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
    const matic = useMemo(() => (balance.matic ? Number.parseFloat(balance.matic).toFixed(3) : '-'), [balance.matic]);
    const tee = useMemo(() => (balance.tee ? Web3.utils.fromWei(balance.tee) : '-'), [balance.tee]);
    return (
        <Box>
            {
                !selectedAddress
                    ? <WalletConnectorBtn />
                    : (
                        <Box alignItems="center">
                            <Box className={classes.balance}>
                                {matic} MATIC / {tee} TEE
                            </Box>
                            <AccountDropdown />
                        </Box>
                    )
            }
        </Box>
    );
});
