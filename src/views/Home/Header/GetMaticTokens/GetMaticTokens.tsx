import React, {
    memo,
    FC,
    useCallback,
    useContext,
    useState,
} from 'react';
import { WalletContext } from '@/common/context/WalletProvider';
import { useTransferMutation } from '@/gql/graphql';
import { useErrorModal } from '@/common/hooks/useErrorModal';
import { Button } from '@/uikit';
import { GetMaticTokensProps } from './types';

export const GetMaticTokens: FC<GetMaticTokensProps> = memo(({ className }) => {
    const { selectedAddress } = useContext(WalletContext);
    const { showErrorModal, showSuccessModal } = useErrorModal();
    const [transfer] = useTransferMutation();
    const [loading, setLoading] = useState(false);
    const onRefillMatic = useCallback(async () => {
        if (!selectedAddress) return;
        setLoading(true);
        try {
            await transfer({
                variables: { transfer: { to: selectedAddress } },
                onCompleted: (data) => {
                    if (data?.transfer) {
                        showSuccessModal('Tokens will be transferred to you in 1-2 minutes');
                    } else {
                        throw new Error('Unable to request MATIC');
                    }
                },
            });
        } catch (e) {
            showErrorModal(e);
        }
        setLoading(false);
    }, [selectedAddress, transfer, showErrorModal, showSuccessModal]);
    if (!selectedAddress) return null;

    return (
        <Button
            onClick={onRefillMatic}
            loading={loading}
            variant="tertiary"
            className={className}
        >
            Get MATIC
        </Button>
    );
});
