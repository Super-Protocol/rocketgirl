import { ReactElement } from 'react';

export interface ModalResultProps {
    children: ReactElement | string;
    classNameWrap?: string;
    classNameMessage?: string;
    transactionHash?: string;
    type?: 'success' | 'error';
}
