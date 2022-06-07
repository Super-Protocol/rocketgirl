import { memo, FC, useCallback } from 'react';
import cn from 'classnames';
import { Box, Dropdown } from '@/uikit';
import { ListItem, TableHeaderListProps } from './types';
import classes from './TableHeaderList.module.scss';
import { ToggleLabel } from './ToggleLabel';
import { DiffCount } from './DiffCount';

export const TableHeaderList: FC<TableHeaderListProps> = memo(({
    list,
    active,
    classNameWrap,
    onChange,
    diff,
}) => {
    const renderToggleLabel = useCallback((item: ListItem, list: ListItem[]) => {
        const count = (list || []).reduce((acc, item) => (diff?.get(item?.value)?.values?.size || 0) + acc, 0);
        return <ToggleLabel label={item?.label} count={count} />;
    }, [diff]);
    const renderItemLabel = useCallback((item: ListItem) => {
        return (
            <ToggleLabel
                label={item?.label}
                count={diff?.get(item?.value)?.values?.size}
                isRelative
            />
        );
    }, [diff]);
    return (
        <Box className={classNameWrap}>
            {list.map((innerList, index) => {
                if (innerList.length < 2) {
                    return (
                        <Box key={index}>
                            {innerList.map(({ value, label }, index) => (
                                <Box
                                    className={cn(classes.item, classes.itemMn, { [classes.item_active]: active === value })}
                                    key={value}
                                >
                                    <div
                                        role="button"
                                        tabIndex={index}
                                        onClick={() => onChange?.(value)}
                                        className={classes.itemBtn}
                                    >
                                        <span>{label}</span>
                                    </div>
                                    {!!diff?.get(value)?.values?.size && <DiffCount value={diff?.get(value)?.values?.size} />}
                                </Box>
                            ))}
                        </Box>
                    );
                }
                return (
                    <Dropdown
                        key={index}
                        active={active}
                        list={innerList}
                        onChange={onChange}
                        classNameWrap={classes.itemMn}
                        renderToggleLabel={(item) => renderToggleLabel(item, innerList)}
                        renderItemLabel={(item) => renderItemLabel(item)}
                    />
                );
            })}
        </Box>
    );
});
