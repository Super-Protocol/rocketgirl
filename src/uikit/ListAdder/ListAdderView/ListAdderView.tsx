import React, {
    memo,
    FC,
    useCallback,
    useMemo,
} from 'react';
import cn from 'classnames';
import {
    Box, Button, Icon, ErrorBox,
} from '@/uikit';
import { Item } from '@/uikit/LazyLoadCheckboxList/types';
import { ListAdderViewProps, Info } from './types';
import classes from './ListAdderView.module.scss';
import { ListAdderViewList } from './ListAdderViewList';

export const ListAdderView: FC<ListAdderViewProps<Info>> = memo(({
    label,
    values,
    isMulti = false,
    onAdd: onAddProps,
    onDelete: onDeleteProps,
    showError = false,
    btnLabel,
    className,
    error,
    isInvalid,
    renderItem,
    disabled,
    classNameListItem,
    name,
}) => {
    const onAdd = useCallback(() => {
        onAddProps?.({ isMulti, values });
    }, [onAddProps, isMulti, values]);
    const onDelete = useCallback((value) => {
        onDeleteProps?.({ isMulti, value });
    }, [isMulti, onDeleteProps]);
    const list = useMemo(() => {
        return ((isMulti ? values : (values ? [values] : [])) || []) as Item<Info>[];
    }, [isMulti, values]);

    return (
        <Box direction="column" className={cn(className, { [classes.invalid]: isInvalid })} id={name}>
            <Box className={classes.label}>{label}</Box>
            <ListAdderViewList
                list={list}
                onDelete={onDeleteProps ? onDelete : undefined}
                renderItem={renderItem}
                classNameListItem={classNameListItem}
            />
            {(isMulti || !values) && onAddProps && (
                <Button className={classes.btn} onClick={onAdd} disabled={disabled}>
                    <Icon
                        width={18}
                        name="add_2"
                        className={classes.icon}
                    />
                    {!!btnLabel && <span className={classes.text}>{btnLabel}</span>}
                </Button>
            )}
            <ErrorBox showError={isInvalid && showError} error={error} />
        </Box>
    );
});
