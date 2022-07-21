import React, {
    memo,
    FC,
    useContext,
    useCallback,
    useState,
} from 'react';
import { useErrorModal } from '@/common/hooks/useErrorModal';
import { useTeeTransferMutation } from '@/gql/graphql';
import { Button } from '@/uikit';
import { WalletContext } from '@/common/context/WalletProvider';
import { GetTeeProps } from './types';

export const GetTee: FC<GetTeeProps> = memo(({ className }) => {
    const { selectedAddress } = useContext(WalletContext);
    const { showErrorModal, showSuccessModal } = useErrorModal();
    const [transfer] = useTeeTransferMutation();
    const [loading, setLoading] = useState(false);
    const onRefillTee = useCallback(async () => {
        if (!selectedAddress) return;
        setLoading(true);
        try {
            await transfer({
                variables: { address: selectedAddress },
                onCompleted: (data) => {
                    if (data?.teeTransfer) {
                        showSuccessModal('Success');
                    } else {
                        throw new Error('Unable to request TEE tokens');
                    }
                },
            });
        } catch (e) {
            showErrorModal(e);
        }
        setLoading(false);
    }, [selectedAddress, transfer, showErrorModal, showSuccessModal]);
    if (!selectedAddress) return null;

    return <Button variant="tertiary" loading={loading} className={className} onClick={onRefillTee}>Get TEE</Button>;
});
