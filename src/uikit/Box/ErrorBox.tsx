import { memo } from 'react';
import cn from 'classnames';
import { Box, Icon } from '@/uikit';
import classes from './ErrorBox.module.scss';
import { ErrorBoxProps } from './types';

export const ErrorBox = memo<ErrorBoxProps>(({
    error,
    showError = true,
    className,
    classNameError,
}) => {
    return (
        showError && error ? (
            <Box alignItems="center" className={cn(classes.errorBox, className)}>
                <Icon
                    name="info_fill2"
                    width={16}
                    height={16}
                    className={classes.iconInfo}
                />
                <span className={cn(classes.error, classNameError)}>{error}</span>
            </Box>
        ) : <div className={cn(classes.errorEmpty, className)} />
    );
});
