import React, { memo, FC } from 'react';
import cn from 'classnames';
import { Box, Icon } from '@/uikit';
import { ListAdderViewListItemProps } from './types';
import classes from './ListAdderViewListItem.module.scss';

export const ListAdderViewListItem: FC<ListAdderViewListItemProps> = memo(({
    children,
    onDelete,
    className,
}) => {
    return (
        <Box className={cn(classes.wrap, className)} alignItems="center" justifyContent="space-between">
            {children}
            {!!onDelete && (
                <Box>
                    <Icon
                        width={10}
                        name="close-small"
                        className={classes.icon}
                        onClick={onDelete}
                    />
                </Box>
            )}
        </Box>
    );
});
