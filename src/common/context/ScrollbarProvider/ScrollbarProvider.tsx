import {
    memo, ReactElement, useEffect, useState,
} from 'react';
import overlayscrollbars from 'overlayscrollbars';

import 'overlayscrollbars/css/OverlayScrollbars.css';

import { overlayScrollbarOptions } from '@/uikit/CustomScrollbar';

import './CustomBodyScrollbar.scss';

import { ScrollbarContextProvider } from './ScrollbarContext';
import { ScrollbarProviderProps } from './types';

export const ScrollbarProvider = memo<ScrollbarProviderProps>(({ children }): ReactElement => {
    const [instance, setInstance] = useState(null);

    useEffect(() => {
        setInstance(overlayscrollbars(document.querySelector('body'), overlayScrollbarOptions));
    }, []);

    return (
        <ScrollbarContextProvider
            value={{ instance }}
        >
            {children}
        </ScrollbarContextProvider>
    );
});
