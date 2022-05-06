import React, { memo, FC } from 'react';
import { Box } from '@/uikit';
import logoPng from '@/assets/icons/logo.png';
import { Account } from './Account';
import { GetMaticTokens } from './GetMaticTokens';
import { GetTee } from './GetTee';
import { HeaderProps } from './types';
import classes from './Header.module.scss';

export const Header: FC<HeaderProps> = memo(() => {
    return (
        <Box alignItems="center" justifyContent="space-between" className={classes.wrap}>
            <Box>
                <img src={logoPng} alt="super protocol" className={classes.img} />
            </Box>
            <Box>
                <GetMaticTokens className={classes.btn} />
                <GetTee className={classes.btn} />
                <Account />
            </Box>
        </Box>
    );
});
