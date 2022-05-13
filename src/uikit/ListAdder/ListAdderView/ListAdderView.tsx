import React, {
    memo,
    FC,
    useCallback,
    useMemo,
} from 'react';
import { Box, Button, Icon } from '@/uikit';
import { Value } from '@/uikit/types';
import { ListAdderViewProps } from './types';
import classes from './ListAdderView.module.scss';
import { ListAdderViewList } from './ListAdderViewList';

export const ListAdderView: FC<ListAdderViewProps> = memo(({
    label,
    values,
    isMulti = false,
    onAdd: onAddProps,
    onDelete: onDeleteProps,
    btnLabel,
    className,
}) => {
    const onAdd = useCallback(() => {
        onAddProps?.({ isMulti, values });
    }, [onAddProps, isMulti, values]);
    const onDelete = useCallback((value) => {
        onDeleteProps?.({ isMulti, value });
    }, [isMulti, onDeleteProps]);
    const list = useMemo(() => {
        return ((isMulti ? values : (values ? [values] : [])) || []) as Value[];
    }, [isMulti, values]);

    return (
        <Box direction="column" className={className}>
            <Box className={classes.label}>{label}</Box>
            <ListAdderViewList list={list} onDelete={onDelete} />
            {(isMulti || !values) && (
                <Button className={classes.btn} onClick={onAdd}>
                    <Icon
                        width={18}
                        name="add_2"
                        className={classes.icon}
                    />
                    {!!btnLabel && <span className={classes.text}>{btnLabel}</span>}
                </Button>
            )}
        </Box>
    );
});
