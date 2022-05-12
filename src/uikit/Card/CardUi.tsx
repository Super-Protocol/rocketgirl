import React, { memo, forwardRef } from 'react';
import cn from 'classnames';

import { PaperUi, Box } from '@/uikit';
import { CardUiProps } from './types';
import classes from './CardUi.module.scss';

export const CardUi = memo(forwardRef<HTMLDivElement, CardUiProps>(({
    children,
    classNameWrap,
    classNameHeader,
}, ref) => {
    return (
        <PaperUi ref={ref} classNameWrap={cn(classes.container, classNameWrap)}>
            <Box
                justifyContent="space-between"
                direction="column"
                className={classNameHeader}
                data-testid="card-ui"
            >
                {children}
            </Box>
        </PaperUi>
    );
}));
