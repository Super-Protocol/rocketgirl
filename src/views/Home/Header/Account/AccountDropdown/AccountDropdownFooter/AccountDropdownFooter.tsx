import React, { memo, FC, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Icon } from '@/uikit';
import { useLocalStorage } from '@/common/hooks/useLocalStorage';
import { AUTH_TOKEN } from '@/common/constants';
import { AccountDropdownFooterProps } from './types';
import classes from './AccountDropdownFooter.module.scss';

export const AccountDropdownFooter: FC<AccountDropdownFooterProps> = memo(() => {
    const [, setToken] = useLocalStorage<string>(AUTH_TOKEN, undefined);
    const navigate = useNavigate();
    const logout = useCallback(() => {
        setToken('');
        navigate('/login');
    }, [setToken, navigate]);
    return (
        <Box className={classes.logoutWrap}>
            <Box className={classes.logout} alignItems="center" onClick={logout} role="button">
                <Icon
                    width={14}
                    name="logout"
                    className={classes.icon}
                />
                Log out
            </Box>
        </Box>
    );
});
