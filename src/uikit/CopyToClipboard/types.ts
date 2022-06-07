import { MouseEventHandler } from 'react';

export interface CopyToClipboardProps {
    children: string;
    onClick?: MouseEventHandler;
    notification?: boolean;
    isEllipsis?: boolean;
    title?: string;
    defaultValue?: string | null;
    url?: string;
    blank?: boolean;
    isReverse?: boolean;
    classNameWrap?: string;
    classNameText?: string;
}

export interface LinkToProps {
    address: string;
    url?: string;
    blank?: boolean;
}

export interface CopyToClipboardSimpleProps {
    text: string;
    notification?: boolean;
}
