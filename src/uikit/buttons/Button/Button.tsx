import { useCallback, forwardRef } from 'react';
import cn from 'classnames';
import { Spinner } from '@/uikit';

import classes from './Button.module.scss';
import { ButtonProps } from './types';

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    children,
    variant = 'base',
    size = '',
    className,
    disabled = false,
    loading = false,
    wide = false,
    href,
    onClick = () => {},
    fullWidth,
    type = 'button',
    ...props
}, ref) => {
    const handleOnClick = useCallback((e) => {
        if (href) {
            window.location.href = href;
        }
        onClick(e);
    }, [href, onClick]);

    return (
        <button
            type={type}
            ref={ref}
            disabled={disabled || loading}
            className={cn(
                classes.root,
                classes?.[variant],
                {
                    [classes.disabled]: disabled || loading,
                    [classes?.[size]]: size,
                    [classes.wide]: wide,
                    [classes.fullWidth]: fullWidth,
                },
                className,
            )}
            onClick={handleOnClick}
            {...props}
        >
            {loading
                ? (
                    <>
                        <Spinner
                            as="span"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            animation="grow"
                            className={classes.loading}
                        />
                        {children}
                    </>
                )
                : children}
        </button>
    );
});
