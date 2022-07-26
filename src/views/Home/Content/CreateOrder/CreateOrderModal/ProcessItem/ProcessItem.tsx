import { memo, FC } from 'react';
import cn from 'classnames';
import { Box, Ellipsis, Icon } from '@/uikit';
import { getErrorTransactionsTemplate } from '@/common/helpers';
import { ProcessItemProps } from './types';
import { ProcessStatus } from '../ProcessStatus';
import classes from './ProcessItem.module.scss';

export const ProcessItem: FC<ProcessItemProps> = memo(({
    name,
    status,
    className,
    error,
}) => {
    return (
        <Box className={cn(classes.wrap, className)} direction="column">
            <Box justifyContent="space-between" className={classes.item}>
                <Ellipsis className={classes.name}>{name}</Ellipsis>
                <ProcessStatus status={status} className={classes.processStatus} />
            </Box>
            {!!error && (
                <Box className={classes.error}>
                    <Icon
                        name="info_fill2"
                        className={classes.iconError}
                    />
                    <Box className={classes.message}>{getErrorTransactionsTemplate(error)}</Box>
                </Box>
            )}
        </Box>
    );
});
