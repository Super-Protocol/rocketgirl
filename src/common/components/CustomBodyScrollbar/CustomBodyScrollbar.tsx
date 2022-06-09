import { useEffect } from 'react';
import overlayscrollbars from 'overlayscrollbars';

import 'overlayscrollbars/css/OverlayScrollbars.css';

import { overlayScrollbarOptions } from '@/uikit/CustomScrollbar';

import './CustomBodyScrollbar.scss';

export const CustomBodyScrollbar = ({ children }) => {
    useEffect(() => {
        overlayscrollbars(document.querySelectorAll('body'), overlayScrollbarOptions);
    }, []);

    return children;
};
