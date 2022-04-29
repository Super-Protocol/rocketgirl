import { ReactNode, MouseEvent } from 'react';
import { OverlayInjectedProps } from 'react-bootstrap/Overlay';

export interface TooltipPopoverProps {
    tooltip?: ReactNode | string;
    classNamePopover?: string;
    classNamePopoverText?: string;
    popoverProps?: object;
    overlayProps?: OverlayInjectedProps;
    dataTestId?: string;
    onMouseLeave: (event: MouseEvent<HTMLDivElement>) => void;
    onMouseEnter: (event: MouseEvent<HTMLDivElement>) => void;
    hideArrow?: boolean;
    id?: string;
}
