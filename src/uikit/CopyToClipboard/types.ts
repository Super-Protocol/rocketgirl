import { MouseEventHandler } from 'react';

export type TooltipLink = {
    title?: string;
}

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
    canShowTooltip?: TooltipLink;
}

export interface LinkToProps {
    address: string;
    url?: string;
    blank?: boolean;
    canShowTooltip?: TooltipLink;
}

export interface CopyToClipboardSimpleProps {
    text: string;
    notification?: boolean;
}
