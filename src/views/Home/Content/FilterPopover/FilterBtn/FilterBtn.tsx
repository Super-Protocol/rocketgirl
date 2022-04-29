import React, {
    memo, FC, useMemo, useContext,
} from 'react';
import cn from 'classnames';
import { useField } from 'formik';
import { Button, Icon } from '@/uikit';
import { FilterBtnProps } from './types';
import classes from './FilterBtn.module.scss';
import { FilterContext } from '../FilterContext/context';
import { Filter } from '../models';

export const FilterBtn: FC<FilterBtnProps> = memo(({
    className,
    name = 'filter_2',
    ...props
}) => {
    const { open, setOpen, filters } = useContext(FilterContext);
    const [, { value: valueValues }] = useField('values');
    const isActive = useMemo(() => Object.values(valueValues || {}).some((v) => !!(v as Filter)?.value), [valueValues]);
    if (!filters.length) return null;
    return (
        <Button
            onClick={() => setOpen(!open)}
            className={cn(classes.btn, { [classes.active]: isActive }, className)}
            {...props}
        >
            <Icon name={name} width={16} />
        </Button>
    );
});
