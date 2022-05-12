import { MouseEventHandler } from 'react';

export interface CopyToClipboardProps {
    children: string;
    onClick?: MouseEventHandler;
    notification?: boolean;
    isEllipsis?: boolean;
    title?: string;
    defaultValue?: string | null;
    url?: string;
}

export interface LinkToProps {
    address: string;
    url?: string;
}
