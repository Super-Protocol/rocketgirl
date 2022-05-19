import React, {
    memo,
    FC,
    useContext,
    useMemo,
    useCallback,
    useState,
} from 'react';
import { Button } from '@/uikit';
import { WalletContext } from '@/common/context/WalletProvider';
import { GetTeeProps } from './types';

export const GetTee: FC<GetTeeProps> = memo(({ className }) => {
    const { selectedWallet, instance } = useContext(WalletContext);
    const [loading, setLoading] = useState(false);
    const address = useMemo(() => selectedWallet?.address, [selectedWallet]);
    const onRefillTee = useCallback(async () => {
        setLoading(true);
        setLoading(false);
        // todo
    }, [instance, address]);
    if (!address) return null;

    return <Button variant="link" loading={loading} className={className} onClick={onRefillTee}>Get TEE</Button>;
});
