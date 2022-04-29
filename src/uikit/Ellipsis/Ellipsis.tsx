import React, { memo, FC } from 'react';
import cn from 'classnames';
import { EllipsisProps } from './types';
import classes from './Ellipsis.module.scss';

export const Ellipsis: FC<EllipsisProps> = memo(({ children, className, ...props }) => {
    return <div className={cn(classes.wrap, className)} {...props}>{children}</div>;
});
