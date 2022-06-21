import React, { memo, FC } from 'react';
import cn from 'classnames';
import { Box, Ellipsis, Icon } from '@/uikit';
import { ProcessItemProps } from './types';
import { ProcessStatus } from '../ProcessStatus';
import classes from './ProcessItem.module.scss';

export const ProcessItem: FC<ProcessItemProps> = memo(({
    name,
    status,
    className,
    error,
}) => {
    return (
        <Box className={cn(classes.wrap, className)} direction="column">
            <Box justifyContent="space-between" className={classes.item}>
                <Ellipsis className={classes.name}>{name}</Ellipsis>
                <ProcessStatus status={status} className={classes.processStatus} />
            </Box>
            {!!error && (
                <Box className={classes.error}>
                    <Icon
                        width={14}
                        name="info_fill"
                        className={classes.iconError}
                    />
                    <Box className={classes.message}>{error?.message}</Box>
                </Box>
            )}
        </Box>
    );
});
