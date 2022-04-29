import React, { memo, FC, useMemo } from 'react';
import cn from 'classnames';
import { Dropdown as DropdownBootstrap } from 'react-bootstrap';
import { DropdownProps } from './types';
import { DropdownToggle } from './DropdownToggle';
import { DropdownMenu } from './DropdownMenu';
import { DropdownItem } from './DropdownItem';
import classes from './Dropdown.module.scss';

export const Dropdown: FC<DropdownProps> = memo(({
    active,
    list,
    onChange,
    classNameWrap,
    DropdownToggleComponent,
    DropdownMenuComponent,
    DropdownItemComponent,
    renderToggleLabel,
    renderItemLabel,
    defaultActive,
}) => {
    const activeItemInList = useMemo(() => list.find(({ value }) => value === active), [list, active]);
    const activeItem = useMemo(() => activeItemInList || defaultActive || list[0], [activeItemInList, list, defaultActive]);
    return (
        <DropdownBootstrap className={classNameWrap}>
            <DropdownBootstrap.Toggle
                as={DropdownToggleComponent || DropdownToggle}
                id="dropdown-ui"
                className={cn(classes.toggle, { [classes.toggleActive]: activeItemInList })}
            >
                {typeof renderToggleLabel === 'function' ? renderToggleLabel(activeItem) : activeItem?.label}
            </DropdownBootstrap.Toggle>
            <DropdownBootstrap.Menu as={DropdownMenuComponent || DropdownMenu}>
                {list.map((item) => (
                    <DropdownBootstrap.Item
                        as={DropdownItemComponent || DropdownItem}
                        key={item?.value}
                        onClick={() => onChange?.(item?.value)}
                        className={classes.item}
                    >
                        {typeof renderItemLabel === 'function' ? renderItemLabel(item) : item?.label}
                    </DropdownBootstrap.Item>
                ))}
            </DropdownBootstrap.Menu>
        </DropdownBootstrap>
    );
});
