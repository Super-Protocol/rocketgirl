import React, {
    memo,
    FC,
    useCallback,
    useMemo,
} from 'react';
import { Box, Icon } from '@/uikit';
import { Value } from '@/uikit/Select/types';
import { ListAdderViewProps } from './types';
import classes from './ListAdderView.module.scss';

export const ListAdderView: FC<ListAdderViewProps> = memo(({
    label,
    values,
    isMulti = false,
    onAdd: onAddProps,
}) => {
    const onAdd = useCallback(() => {
        onAddProps?.({ isMulti, values });
    }, [onAddProps, isMulti, values]);
    const list = useMemo(() => {
        return ((isMulti ? values : (values ? [values] : [])) || []) as Value[];
    }, [isMulti, values]);

    return (
        <Box direction="column">
            <Box>{label}</Box>
            {list.map((value) => <Box key={value as string}>{value}</Box>)}
            {(isMulti || !values) && (
                <Icon
                    width={14}
                    name="add_2"
                    className={classes.icon}
                    onClick={onAdd}
                />
            )}
        </Box>
    );
});
