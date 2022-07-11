import { memo } from 'react';

import { Box, Icon } from '@/uikit';
import classes from './ErrorBox.module.scss';
import { ErrorBoxProps } from './types';

export const ErrorBox = memo<ErrorBoxProps>(({ error, showError = true }) => {
    return (
        showError && error ? (
            <Box alignItems="center" className={classes.errorBox}>
                <Icon
                    name="info_fill2"
                    width={16}
                    height={16}
                    className={classes.iconInfo}
                />
                <span className={classes.error}>{error}</span>
            </Box>
        ) : <div className={classes.errorEmpty} />
    );
});
