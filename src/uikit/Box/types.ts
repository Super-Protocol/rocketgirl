import { ReactNode, SyntheticEvent, LegacyRef } from 'react';

export type flexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse';
export type flexJusifyContent = 'flex-start' | 'flex-end' | 'center' | 'space-around' | 'space-between';
export type flexAlignItems = 'stretch' | 'baseline' | 'center' | 'flex-start' | 'flex-end';
export type flexWrap = 'nowrap' | 'wrap' | 'wrap-reverse';

export interface BoxProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    container?: boolean;
    children?: ReactNode | string;
    direction?: flexDirection;
    justifyContent?: flexJusifyContent;
    wrap?: flexWrap;
    alignItems?: flexAlignItems;
    className?: string;
    onClick?: (event: SyntheticEvent) => void;
    ref?: LegacyRef<HTMLDivElement>;
    id?: string;
    'data-testid'?: string;
}

export interface ErrorBoxProps {
    error?: string;
    showError?: boolean;
    className?: string;
}
