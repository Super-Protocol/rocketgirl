import React, { memo, useRef, forwardRef } from 'react';
import cn from 'classnames';

import { PaperUi, Box } from '@/uikit';
import { CardUiProps } from './types';
import classes from './CardUi.module.scss';

export const CardUi = memo(forwardRef<HTMLDivElement, CardUiProps>(({
    children,
    classNameWrap,
    classNameHeader,
}, ref) => {
    const refCard = useRef<null | HTMLDivElement>(null);

    return (
        <PaperUi ref={ref} classNameWrap={cn(classes.container, classNameWrap)}>
            <Box
                justifyContent="space-between"
                direction="column"
                className={classNameHeader}
                ref={refCard}
                data-testid="card-ui"
            >
                {children}
            </Box>
        </PaperUi>
    );
}));
