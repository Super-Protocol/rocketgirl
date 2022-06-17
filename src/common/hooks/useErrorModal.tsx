import React, { useContext, useCallback, ReactNode } from 'react';
import { getParsedErrorTransactions } from '@/common/helpers';
import { ModalResult } from '@/common/components/ModalResult';
import { ModalOkCancelContext } from '@/common/context/ModalOkCancelProvider/ModalOkCancelProvider';

export interface UseErrorModalResult {
    showErrorModal: Function;
    showSuccessModal: Function;
}

export const useErrorModal = (): UseErrorModalResult => {
    const { showModal } = useContext(ModalOkCancelContext);
    const showErrorModal = useCallback(async (error: Error) => {
        const e = getParsedErrorTransactions(error);
        await showModal({
            children: <ModalResult transactionHash={e?.transactionHash} type="error">{e?.message}</ModalResult>,
        });
    }, [showModal]);
    const showSuccessModal = useCallback(async (message?: string, children?: ReactNode) => {
        await showModal({
            children: children || <ModalResult type="success">{message || 'Success'}</ModalResult>,
        });
    }, [showModal]);
    return {
        showErrorModal,
        showSuccessModal,
    };
};
