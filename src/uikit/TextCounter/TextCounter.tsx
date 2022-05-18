import React, { memo, FC } from 'react';
import { Box } from '@/uikit';
import { TextCounterProps } from './types';
import classes from './TextCounter.module.scss';

export const TextCounter: FC<TextCounterProps> = memo(({ list }) => {
    if (!list?.length) return null;
    const countAdditional = list.length - 1;
    return (
        <Box alignItems="center">
            <span>{list[0]?.name}</span>
            {!!countAdditional && <div className={classes.counter}>+{countAdditional}</div>}
        </Box>
    );
});
