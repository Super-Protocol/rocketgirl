import React, { memo, FC } from 'react';
import { AccountDropdownHeaderProps } from './types';
import classes from './AccountDropdownHeader.module.scss';

export const AccountDropdownHeader: FC<AccountDropdownHeaderProps> = memo(() => {
    return <div className={classes.wrap}>Account</div>;
});
