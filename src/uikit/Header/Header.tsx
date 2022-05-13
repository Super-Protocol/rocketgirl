import { memo } from 'react';

import { Box } from '@/uikit';
import { HeaderProps } from './types';
import classes from './Header.module.scss';

export const Header = memo<HeaderProps>(({ children }) => (
    <Box alignItems="center" justifyContent="space-between" className={classes.wrap}>
        {children}
    </Box>
));
