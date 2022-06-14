import React, { forwardRef } from 'react';
import cn from 'classnames';
import { Ellipsis } from '@/uikit';
import classes from './DropdownToggle.module.scss';
import { DropdownToggleProps } from './types';

export const DropdownToggle = forwardRef<HTMLButtonElement, DropdownToggleProps>(({
    children,
    className,
    onClick,
    isEllipsis,
}, ref) => (
    <button
        className={cn(classes.btn, className)}
        ref={ref}
        onClick={(e) => {
            e.preventDefault();
            onClick?.(e);
        }}
    >
        {isEllipsis ? <Ellipsis>{children}</Ellipsis> : children}
    </button>
));
