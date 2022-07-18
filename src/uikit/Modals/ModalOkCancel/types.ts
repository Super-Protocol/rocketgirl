import { ReactNode } from 'react';

export interface ModalMessages {
    header?: string;
    title?: string[];
    ok?: string;
    cancel?: string;
}

export interface ModalComponents {
    header?: ReactNode;
    footer?: ReactNode;
    main?: ReactNode;
}

export interface ModalOkCancelProps {
    show?: boolean;
    onClose?: () => void;
    onContinue?: () => void;
    onCancel?: () => void;
    messages?: ModalMessages;
    children?: ReactNode;
    classNameTitle?: string;
    classNameHeader?: string;
    classNameBody?: string;
    components?: ModalComponents;
    classNameWrap?: string;
    classNameBottom?: string;
    showMuarScrollbar?: boolean;
    backdrop?: true | false | 'static';
}
