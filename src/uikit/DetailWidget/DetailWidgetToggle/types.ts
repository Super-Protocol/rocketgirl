import { ReactNode } from 'react';

export interface DetailWidgetToggleProps {
    eventKey: string;
    titleOpen?: ReactNode | string;
    titleClose?: ReactNode | string;
    onSelect: (isOpen: boolean) => void;
    isOpen: boolean;
    classNameWrap?: string;
}
