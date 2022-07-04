import React, { memo, FC } from 'react';
import cn from 'classnames';
import { Box } from '@/uikit';
import { DiffCountProps } from './types';
import classes from './DiffCount.module.scss';

export const DiffCount: FC<DiffCountProps> = memo(({ value = 0, classNameWrap, isRelative = false }) => {
    return (
        <Box className={cn(
            classes.diff,
            { [classes.relative]: isRelative },
            { [classes.one]: value < 10 },
            { [classes.ten]: value >= 10 && value < 100 },
            classNameWrap,
        )}
        >
            <span className={classes.diffText}>{value}</span>
        </Box>
    );
});
