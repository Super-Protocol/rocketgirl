import { FC, useContext } from 'react';
import cn from 'classnames';
import { Box } from '@/uikit';
import { FilterPanelProps } from './types';
import classes from './FilterPanel.module.scss';
import { FilterContext } from '../FilterContext/context';

export const FilterPanel: FC<FilterPanelProps> = ({
    children,
    className,
}): JSX.Element | null => {
    const { open } = useContext(FilterContext);
    if (!open) return null;
    return (
        <Box className={cn(classes.wrap, className)} direction="column">
            <div className={classes.title}>Filters</div>
            <Box>{typeof children === 'function' ? children() : children}</Box>
        </Box>
    );
};
