import React, { memo, FC } from 'react';
import cn from 'classnames';
import { Box, Spinner } from '@/uikit';
import { StatusBarProps } from './types';
import classes from './StatusBar.module.scss';

export const StatusBar: FC<StatusBarProps> = memo(({
    color,
    children,
    isSpinner = false,
    isStatus = false,
}) => {
    return (
        <Box className={classes.wrap} alignItems="center">
            {isSpinner && <Spinner animation="border" className={cn(classes.spinner, classes.mr)} size="sm" />}
            {isStatus && <div className={cn(classes.bar, color ? classes[color] : '', { [classes.mr]: !!children })} />}
            {children}
        </Box>
    );
});
