import React, { memo, FC, useMemo } from 'react';
import { Box, Header as HeaderUIKit } from '@/uikit';
import logoPng from '@/assets/icons/logo.png';
import dayPng from '@/assets/day.png';
import nightPng from '@/assets/night.png';
import { Account } from './Account';
import { GetMaticTokens } from './GetMaticTokens';
import { GetTee } from './GetTee';
import { HeaderProps } from './types';
import classes from './Header.module.scss';

export const Header: FC<HeaderProps> = memo(() => {
    const logo = useMemo(() => {
        const date = new Date();
        if (date.getDate() === 7
        && date.getMonth() === 6) {
            const hour = date.getHours();
            return {
                bd: true,
                src: hour > 6 && hour < 20 ? dayPng : nightPng,
            };
        }
        return {
            bd: false,
            src: logoPng,
        };
    }, []);

    return (
        <HeaderUIKit>
            <Box>
                <img src={logo.src} alt="super protocol" className={logo.bd ? classes.imgbd : classes.img} />
                {/* <img src={logoPng} alt="super protocol" className={classes.img} /> */}
            </Box>
            <Box>
                <GetMaticTokens />
                <GetTee className={classes.btn} />
                <Account />
            </Box>
        </HeaderUIKit>
    );
});
