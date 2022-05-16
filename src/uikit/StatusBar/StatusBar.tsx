import React, { memo, FC } from 'react';
import cn from 'classnames';
import { Box } from '@/uikit';
import { StatusBarProps } from './types';
import classes from './StatusBar.module.scss';

export const StatusBar: FC<StatusBarProps> = memo(({ color, children }) => {
    return (
        <Box className={classes.wrap} alignItems="center">
            <div className={cn(classes.bar, color ? classes[color] : '', { [classes.mr]: !!children })} />
            {children}
        </Box>
    );
});
