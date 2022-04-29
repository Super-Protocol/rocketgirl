import React, { memo, FC, useRef } from 'react';
import { components } from 'react-select';
import cn from 'classnames';
import useLazyLoadCursor from '@/uikit/Select/hooks/useLazyLoadCursor';
import { SelectMenuListLazyLoadProps } from './types';
import classes from './SelectMenuListLazyLoad.module.scss';

const { MenuList } = components;

export const SelectMenuListLazyLoad: FC<SelectMenuListLazyLoadProps> = memo(({ selectProps, ...props }) => {
    const triggerRef = useRef(null);
    const { innerProps } = selectProps;
    const {
        fetchData,
        loading,
        cursor,
        delay,
        ...restInnerProps
    } = innerProps;
    useLazyLoadCursor({
        triggerRef,
        fetchData,
        cursor,
        loading,
        delay,
    });
    return (
        <MenuList {...selectProps} {...props as any} innerProps={restInnerProps}>
            {props.children}
            <div ref={triggerRef} className={cn(classes.trigger)} />
        </MenuList>
    );
});
