import React, { memo, FC } from 'react';
import { ErrorDepositProps } from './types';
import classes from './ErrorDeposit.module.scss';

export const ErrorDeposit: FC<ErrorDepositProps> = memo(({ min, onClick }) => {
    if (!min) return null;
    return (
        <div className={classes.wrap}>
            <span className={classes.text}>Order minimum cost estimation:</span>
            <span className={classes.link} onClick={onClick}>{min}</span>
        </div>
    );
});
