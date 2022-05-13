import React, { memo, FC } from 'react';
import { Box } from '@/uikit';
import { ListAdderViewListProps } from './types';
import { ListAdderViewListItem } from './ListAdderViewListItem';
import classes from './ListAdderViewList.module.scss';

export const ListAdderViewList: FC<ListAdderViewListProps> = memo(({ list, onDelete }) => {
    if (!list?.length) return null;
    return (
        <Box direction="column">
            {list.map((value) => (
                <ListAdderViewListItem
                    key={value as string}
                    onDelete={() => onDelete?.(value)}
                    className={classes.listItem}
                >
                    {value}
                </ListAdderViewListItem>
            ))}
        </Box>
    );
});
