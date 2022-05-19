import React, {
    memo,
    FC,
    useCallback,
    useContext,
    useMemo,
    useState,
} from 'react';
import { WalletContext } from '@/common/context/WalletProvider';
import { transferTokens } from '@/connectors/faucetMaticApi';
import { useErrorModal } from '@/common/hooks/useErrorModal';
import { Button } from '@/uikit';
import { GetMaticTokensProps } from './types';

export const GetMaticTokens: FC<GetMaticTokensProps> = memo(({ className }) => {
    const { selectedWallet } = useContext(WalletContext);
    const [loading, setLoading] = useState(false);
    const { showErrorModal, showSuccessModal } = useErrorModal();
    const address = useMemo(() => selectedWallet?.address, [selectedWallet]);
    const refillMatic = useCallback(async (): Promise<void> => {
        if (!address) throw new Error('Account address is empty');
        await transferTokens(address).then(async (response) => {
            const result = await response.json();
            if (result?.error) {
                const { error, duration } = result;
                const durationText = duration ? ` for ${duration / 1000} seconds` : '';
                throw new Error(`${error}${durationText}`);
            }
        });
    }, [address]);
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
    if (!address) return null;
    return (
        <Button
            onClick={refillMaticNotification}
            loading={loading}
            variant="link"
            className={className}
        >
            Get MATIC
        </Button>
    );
});
