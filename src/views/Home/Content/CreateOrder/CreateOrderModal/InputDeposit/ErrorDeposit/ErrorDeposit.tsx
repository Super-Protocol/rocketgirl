import React, { memo, FC } from 'react';
import { DepositErrors, ErrorDepositProps } from './types';
import classes from './ErrorDeposit.module.scss';

export const ErrorDeposit: FC<ErrorDepositProps> = memo(({ min, onClick, error }) => {
    if (error === DepositErrors.BALANCE) {
        return (
            <div className={classes.wrap}>
                {/* eslint-disable-next-line max-len */}
                <span className={classes.text}>Not enough money on your wallet, please replenish the balance by clicking on the Get TEE button</span>
            </div>
        );
    }
    if (error === DepositErrors.MIN && min) {
        return (
            <div className={classes.wrap}>
                <span className={classes.text}>Order minimum cost estimation:</span>
                <span className={classes.link} onClick={onClick}>{min}</span>
            </div>
        );
    }
    return null;
});
