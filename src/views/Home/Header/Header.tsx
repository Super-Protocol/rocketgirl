import React, { memo, FC } from 'react';
import { Box } from '@/uikit';
import { Account } from './Account';
import { GetMaticTokens } from './GetMaticTokens';
import { HeaderProps } from './types';

export const Header: FC<HeaderProps> = memo(() => {
    return (
        <Box>
            <GetMaticTokens />
            <Account />
        </Box>
    );
});
