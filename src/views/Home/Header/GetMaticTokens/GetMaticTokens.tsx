import React, {
    memo,
    FC,
    useCallback,
    useContext,
    useMemo,
} from 'react';
import { WalletContext } from '@/views/Home/context/walletContext';
import { transferTokens } from '@/connectors/faucetMaticApi';
import { useErrorModal } from '@/common/hooks/useErrorModal';
import { Button } from '@/uikit';
import { GetMaticTokensProps } from './types';

export const GetMaticTokens: FC<GetMaticTokensProps> = memo(({ className }) => {
    const { selectedWallet } = useContext(WalletContext);
    const { showErrorModal, showSuccessModal } = useErrorModal();
    const address = useMemo(() => selectedWallet?.address, [selectedWallet]);
    const refillMatic = useCallback(async (): Promise<void> => {
        if (!address) throw new Error('Account address is empty');
        await transferTokens(address).then(async (response) => {
            const result = await response.json();
            if (result?.error) {
                throw new Error(result?.error);
            }
        });
    }, [address]);
    const refillMaticNotification = useCallback(async () => {
        try {
            await refillMatic();
            showSuccessModal('Success');
        } catch (e) {
            showErrorModal(e);
        }
    }, [refillMatic, showErrorModal, showSuccessModal]);
    if (!address) return null;
    return <Button onClick={refillMaticNotification} variant="orange" className={className}>Get MATIC</Button>;
});
