import React, {
    memo,
    FC,
    useCallback,
    useContext,
    useState,
} from 'react';
import { WalletContext } from '@/common/context/WalletProvider';
import { transferTokens } from '@/connectors/faucetMaticApi';
import { useErrorModal } from '@/common/hooks/useErrorModal';
import { Button } from '@/uikit';
import { GetMaticTokensProps } from './types';

export const GetMaticTokens: FC<GetMaticTokensProps> = memo(({ className }) => {
    const { selectedAddress } = useContext(WalletContext);
    const [loading, setLoading] = useState(false);
    const { showErrorModal, showSuccessModal } = useErrorModal();
    const refillMatic = useCallback(async (): Promise<void> => {
        if (!selectedAddress) throw new Error('Account address is empty');
        await transferTokens(selectedAddress).then(async (response) => {
            const result = await response.json();
            if (result?.error) {
                const { error, duration } = result;
                const durationText = duration ? ` for ${duration / 1000} seconds` : '';
                throw new Error(`${error}${durationText}`);
            }
        });
    }, [selectedAddress]);
    const refillMaticNotification = useCallback(async () => {
        setLoading(true);
        try {
            await refillMatic();
            showSuccessModal('Tokens will be transferred to you in 1-2 minutes');
        } catch (e) {
            showErrorModal(e);
        }
        setLoading(false);
    }, [refillMatic, showErrorModal, showSuccessModal]);
    if (!selectedAddress) return null;
    return (
        <Button
            onClick={refillMaticNotification}
            loading={loading}
            variant="tertiary"
            className={className}
        >
            Get MATIC
        </Button>
    );
});
