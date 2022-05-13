import { memo } from 'react';

import { Box } from '@/uikit';
import { ContentProps } from './types';
import classes from './Content.module.scss';

export const Content = memo<ContentProps>(({ children }) => {
    return (
        <Box direction="column" className={classes.content}>
            {children}
        </Box>
    );
});
