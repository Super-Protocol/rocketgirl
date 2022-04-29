import React, { forwardRef } from 'react';
import cn from 'classnames';
import classes from './DropdownItem.module.scss';
import { DropdownItemProps } from './types';

export const DropdownItem = forwardRef<HTMLDivElement, DropdownItemProps>(({ children, className, onClick }, ref) => (
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
