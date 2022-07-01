import { ReactNode } from 'react';
import OverlayScrollbars from 'overlayscrollbars';

export interface ScrollbarContextProps {
    instance?: OverlayScrollbars;
}

export interface ScrollbarProviderProps {
    children: ReactNode;
}
