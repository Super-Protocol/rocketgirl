import React, { memo, forwardRef } from 'react';
import cn from 'classnames';
import { EllipsisProps } from './types';
import classes from './Ellipsis.module.scss';

export const Ellipsis = memo(forwardRef<HTMLDivElement, EllipsisProps>(({ children, className, ...props }, ref) => {
    return <div className={cn(classes.wrap, className)} ref={ref} {...props}>{children}</div>;
}));
