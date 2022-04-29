import React, { memo, FC, useMemo } from 'react';
import { components } from 'react-select';
import { Ellipsis } from '@/uikit';
import classes from './SelectOptionIcon.module.scss';
import { SelectOptionIconProps } from './types';

export const SelectOptionIcon: FC<SelectOptionIconProps> = memo((props) => {
    const Icon = useMemo(() => (props as any)?.data?.icon, [props]);
    const title = useMemo(() => (props as any)?.data?.title, [props]);
    return (
        <components.Option {...props as any}>
            <div className={classes.wrap}>
                {!!title && <div className={classes.title}>{title}</div>}
                <div className={classes.inner}>
                    <Ellipsis className={classes.children}>{props.children}</Ellipsis>
                    {!!Icon && <Icon className={classes.icon} />}
                </div>
            </div>
        </components.Option>
    );
});
