import { forwardRef, memo } from 'react';
import cn from 'classnames';

import { PaperUiProps, themes } from './types';
import classes from './PaperUi.module.scss';

export const PaperUi = memo(forwardRef<HTMLDivElement, PaperUiProps>(({
    classNameWrap,
    children,
    theme = themes.light,
}, ref) => {
    return (
        <div ref={ref} className={cn(classes.wrap, classes[theme], classNameWrap)} data-testid="paper-ui">
            {children}
        </div>
    );
}));
