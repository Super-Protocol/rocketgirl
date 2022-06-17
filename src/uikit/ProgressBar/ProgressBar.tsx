import React, { memo, FC } from 'react';
import { ProgressBarProps } from './types';
import classes from './ProgressBar.module.scss';

export const ProgressBar: FC<ProgressBarProps> = memo(({ progress }) => {
    return (
        <div className={classes.progress}>
            <div
                className={classes.progressBar}
                style={{ width: `${progress}%` }}
                aria-valuemax={100}
                aria-valuenow={progress}
                aria-valuemin={0}
            />
        </div>
    );
});
