import React, { memo, FC } from 'react';
import cn from 'classnames';
import { Box, Icon, Ellipsis } from '@/uikit';
import { ListAdderViewListItemProps } from './types';
import classes from './ListAdderViewListItem.module.scss';

export const ListAdderViewListItem: FC<ListAdderViewListItemProps> = memo(({ children, onDelete, className }) => {
    return (
        <Box className={cn(classes.wrap, className)} alignItems="center" justifyContent="space-between">
            <Ellipsis className={classes.text}>{children}</Ellipsis>
            <Box>
                <Icon
                    width={10}
                    name="close-small"
                    className={classes.icon}
                    onClick={onDelete}
                />
            </Box>
        </Box>
    );
});
