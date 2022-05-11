import { ReactNode, SyntheticEvent } from 'react';

export type Placement = 'auto-start' | 'auto' | 'auto-end' | 'top-start' | 'top' |
                'top-end' | 'right-start' | 'right' | 'right-end' | 'bottom-end' |
                'bottom' | 'bottom-start' | 'left-end' | 'left' | 'left-start'

export enum TooltipTheme {
    gray = 'gray',
    beige = 'beige',
    white = 'white',
}

export interface TooltipProps {
    placement?: Placement;
    tooltip?: ReactNode | string;
    delay?: number;
    className?: string;
    classNamePopover?: string;
    classNamePopoverText?: string;
    classNamePopoverChildren?: string;
    popoverProps?: object;
    buttonToolbarProps?: object;
    initialShow?: boolean;
    children?: any;
    onClick?: (e: SyntheticEvent) => void;
    dataTestId?: string;
    onMouseLeave?: Function;
    onMouseEnter?: Function;
    hideArrow?: boolean;
    block?: boolean;
    noMargin?: boolean;
    theme?: TooltipTheme;
    containerRef?: any | null;
}

export interface TooltipWithEllipsisProps {
    placement?: Placement;
    maxLen?: number;
    children?: any;
}
