import { FC, useMemo } from 'react';
import { Portal } from 'react-overlays';

import { PopperContainerProps } from './types';

export const PopperContainer: FC<PopperContainerProps> = ({ children, portalName = 'calendar-portal' }) => {
    const el = useMemo(() => document.getElementById(portalName), [portalName]);

    return (
        <Portal container={el}>
            {children}
        </Portal>
    );
};
