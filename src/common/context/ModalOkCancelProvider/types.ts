import { ReactNode, ReactElement } from 'react';
import { ModalOkCancelProps } from '@/uikit/Modals/ModalOkCancel/types';

export interface ModalOkCancelContextProps {
    showModal: (modalOkCancelProps: ModalOkCancelProps) => void,
    onClose: () => void,
    goBack: (count?: number) => void,
    goNext: (modalOkCancelProps: ModalOkCancelProps) => void,
}

export interface ModalOkCancelProviderProps {
    children: ReactNode;
}

export type ModalOkCancelProviderResult = ReactElement;
