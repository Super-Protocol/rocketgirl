import React, { useContext, useCallback, ReactNode } from 'react';
import { getParsedErrorTransactions } from '@/common/helpers';
import { ModalResult } from '@/common/components/ModalResult';
import { ModalOkCancelContext } from '@/common/context/ModalOkCancelProvider/ModalOkCancelProvider';
import { ModalOkCancelProps } from '@/uikit/Modals/ModalOkCancel/types';
import classes from './useErrorModal.module.scss';

export interface UseErrorModalResult {
    showErrorModal: Function;
    showSuccessModal: Function;
}

export const useErrorModal = (): UseErrorModalResult => {
    const { showModal } = useContext(ModalOkCancelContext);
    const showErrorModal = useCallback(async (error: Error, props: ModalOkCancelProps) => {
        const e = getParsedErrorTransactions(error);
        await showModal({
            children: <ModalResult transactionHash={e?.transactionHash} type="error">{e?.message}</ModalResult>,
            ...props,
        });
    }, [showModal]);
    const showSuccessModal = useCallback(async (
        message?: string,
        children?: ReactNode,
        okButtonName = 'Ok',
        action?: () => void,
    ) => {
        await showModal({
            children: children || <ModalResult type="success">{message || 'Success'}</ModalResult>,
            onContinue: action,
            messages: {
                ok: okButtonName,
            },
            classNameBottom: classes.bottom,
        });
    }, [showModal]);
    return {
        showErrorModal,
        showSuccessModal,
    };
};
