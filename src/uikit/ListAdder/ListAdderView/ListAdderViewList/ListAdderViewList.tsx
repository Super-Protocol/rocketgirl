import React, { memo, FC } from 'react';
import { Box } from '@/uikit';
import { ListAdderViewListProps } from './types';
import { ListAdderViewListItem } from './ListAdderViewListItem';
import classes from './ListAdderViewList.module.scss';

export const ListAdderViewList: FC<ListAdderViewListProps<{ description: string; name: string; }>> = memo(({
    list,
    onDelete,
    renderItem,
}) => {
    if (!list?.length) return null;
    return (
        <Box direction="column">
            {list.map((item) => (
                <ListAdderViewListItem
                    key={item?.value as string}
                    onDelete={() => onDelete?.(item)}
                    className={classes.listItem}
                >
                    {renderItem ? renderItem?.(item) : item?.value}
                </ListAdderViewListItem>
            ))}
        </Box>
    );
});
