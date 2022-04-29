import { ReactElement } from 'react';

export interface ModalResultProps {
    children: ReactElement | string;
    classNameMessage?: string;
    transactionHash?: string;
}
