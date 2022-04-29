import { MouseEventHandler } from 'react';

export interface CopyToClipboardProps {
    children: string;
    onClick?: MouseEventHandler;
    notification?: boolean;
    isEllipsis?: boolean;
    title?: string;
    defaultValue?: string | null;
}
