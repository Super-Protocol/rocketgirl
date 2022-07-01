import React, { memo, FC } from 'react';
import cn from 'classnames';
import { Box } from '@/uikit';
import { ListAdderViewListProps } from './types';
import { ListAdderViewListItem } from './ListAdderViewListItem';
import classes from './ListAdderViewList.module.scss';

export const ListAdderViewList: FC<ListAdderViewListProps> = memo(({
    list,
    onDelete,
    renderItem,
    classNameListItem,
}) => {
    if (!list?.length) return null;
    return (
        <Box direction="column">
            {list.map((item) => {
                const sub = item?.data?.sub;
                return (
                    <Box
                        direction="column"
                        className={cn(classes.listItem, classNameListItem)}
                        key={`parent_${item?.value as string}`}
                    >
                        <ListAdderViewListItem
                            onDelete={onDelete ? () => onDelete(item) : undefined}
                            className={classes.listItemTop}
                        >
                            {renderItem ? renderItem?.(item) : item?.value}
                        </ListAdderViewListItem>
                        {!!sub?.length && (
                            sub.map((itemSub, index) => (
                                <Box
                                    className={cn(classes.listItemInner, { [classes.listItemInnerFirst]: !index })}
                                    key={`base_${itemSub?.value as string}`}
                                >
                                    <div className={classes.lineVertical} />
                                    <div className={classes.lineHorizontal} />
                                    <ListAdderViewListItem>
                                        {renderItem ? renderItem?.(itemSub) : itemSub?.value}
                                    </ListAdderViewListItem>
                                </Box>
                            ))
                        )}
                    </Box>
                );
            })}
        </Box>
    );
});
