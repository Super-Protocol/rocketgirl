import React, { memo, FC } from 'react';
import cn from 'classnames';

import { ProgressBarProps } from './types';
import classes from './ProgressBar.module.scss';

const valuemax = 100;

export const ProgressBar: FC<ProgressBarProps> = memo(({ progress }) => {
    return (
        <div className={classes.progress}>
            <div
                className={cn(classes.progressBar, { [classes['progressBar-progress']]: progress !== valuemax })}
                style={{ width: `${progress}%` }}
                aria-valuemax={valuemax}
                aria-valuenow={progress}
                aria-valuemin={0}
            />
        </div>
    );
});
