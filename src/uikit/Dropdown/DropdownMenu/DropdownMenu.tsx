import React, { forwardRef } from 'react';
import cn from 'classnames';
import { DropdownMenuProps } from './types';
import classes from './DropdownMenu.module.scss';

export const DropdownMenu = forwardRef<HTMLDivElement, DropdownMenuProps>(
    ({
        children,
        style,
        className,
        'aria-labelledby': labeledBy,
    }, ref) => {
        return (
            <div
                ref={ref}
                style={style}
                className={cn(classes.wrap, className)}
                aria-labelledby={labeledBy}
            >
                <div>
                    {React.Children.toArray(children)}
                </div>
            </div>
        );
    },
);
