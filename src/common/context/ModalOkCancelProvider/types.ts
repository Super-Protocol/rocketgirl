import { ReactNode, ReactElement } from 'react';
import { ModalOkCancelProps } from '@/uikit/Modals/ModalOkCancel/types';

export type History = { id: string, props: ModalOkCancelProps }[];

export interface GoBackProps {
    count?: number;
    props?: any;
}

export interface ModalOkCancelContextProps {
    showModal: (modalOkCancelProps: ModalOkCancelProps) => void,
    onClose: () => void,
    goBack: (props?: GoBackProps) => void,
    goNext: (modalOkCancelProps: ModalOkCancelProps) => void,
    history: History;
}

export interface ModalOkCancelProviderProps {
    children: ReactNode;
}

export type ModalOkCancelProviderResult = ReactElement;
