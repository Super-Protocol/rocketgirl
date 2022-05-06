import React, {
    memo,
    FC,
    useContext,
    useMemo,
} from 'react';
import { Button } from '@/uikit';
import { WalletContext } from '@/views/Home/context/walletContext';
import { GetTeeProps } from './types';

export const GetTee: FC<GetTeeProps> = memo(({ className }) => {
    const { selectedWallet } = useContext(WalletContext);
    const address = useMemo(() => selectedWallet?.address, [selectedWallet]);
    if (!address) return null;

    return <Button variant="orange" className={className}>Get TEE</Button>;
});
