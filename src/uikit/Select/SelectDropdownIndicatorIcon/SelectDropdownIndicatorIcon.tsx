import React, { memo, FC, useMemo } from 'react';
import { components } from 'react-select';
import classes from './SelectDropdownIndicatorIcon.module.scss';
import { SelectDropdownIndicatorIconProps } from './types';

export const SelectDropdownIndicatorIcon: FC<SelectDropdownIndicatorIconProps> = memo((props) => {
    const Icon = useMemo(() => (props as any)?.selectProps?.value?.icon, [props]);
    return (
        <components.Option {...props as any} className={classes.wrap}>
            {Icon ? <Icon /> : <div className={classes.emptyBlock} />}
        </components.Option>
    );
});
