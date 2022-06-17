import React, { memo, FC } from 'react';
import cn from 'classnames';
import { Box } from '@/uikit';
import { TooltipLink } from '@/common/components/TooltipLink';
import { ProcessItemProps } from './types';
import { ProcessStatus } from '../ProcessStatus';
import classes from './ProcessItem.module.scss';

export const ProcessItem: FC<ProcessItemProps> = memo(({ name, status, className }) => {
    return (
        <Box justifyContent="space-between" className={cn(classes.item, className)}>
            <TooltipLink
                title="Description"
                text={name}
                classNameTooltip={classes.itemTooltip}
            />
            <ProcessStatus status={status} className={classes.processStatus} />
        </Box>
    );
});
