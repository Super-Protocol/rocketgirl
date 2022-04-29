import { MouseEventHandler } from 'react';

export interface EyeLinkProps {
    children: string;
    onClick?: MouseEventHandler;
    isEllipsis?: boolean;
}
