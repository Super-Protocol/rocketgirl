import React, { useContext, useCallback, ReactNode } from 'react';
import { getParsedErrorTransactions } from '@/common/helpers';
import { ModalResult } from '@/common/components/ModalResult';
import { ModalOkCancelContext } from '@/common/context/ModalOkCancelProvider/ModalOkCancelProvider';
import classes from './useErrorModal.module.scss';

export interface UseErrorModalResult {
    showErrorModal: Function;
    showSuccessModal: Function;
}

export const useErrorModal = (): UseErrorModalResult => {
    const { showModal } = useContext(ModalOkCancelContext);
    const showErrorModal = useCallback(async (error: Error) => {
        const e = getParsedErrorTransactions(error);
        await showModal({
            messages: {
                header: 'Error',
            },
            classNameHeader: classes.error,
            children: <ModalResult transactionHash={e?.transactionHash}>{e?.message}</ModalResult>,
        });
    }, [showModal]);
    const showSuccessModal = useCallback(async (message?: string, children?: ReactNode) => {
        await showModal({
            messages: {
                header: 'Success',
            },
            classNameHeader: classes.success,
            children: children || <ModalResult>{message || 'Success'}</ModalResult>,
        });
    }, [showModal]);
    return {
        showErrorModal,
        showSuccessModal,
    };
};
