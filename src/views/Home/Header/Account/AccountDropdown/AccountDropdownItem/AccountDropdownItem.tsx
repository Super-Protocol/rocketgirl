import React, { forwardRef } from 'react';
import cn from 'classnames';
import classes from './AccountDropdownItem.module.scss';
import { AccountDropdownItemProps } from './types';

export const AccountDropdownItem = forwardRef<HTMLDivElement, AccountDropdownItemProps>(({
    children,
    className,
    onClick,
}, ref) => (
    <div
        className={cn(classes.wrap, className)}
        ref={ref}
        onClick={(e) => {
            e.preventDefault();
            onClick?.(e);
        }}
    >
        {children}
    </div>
));
