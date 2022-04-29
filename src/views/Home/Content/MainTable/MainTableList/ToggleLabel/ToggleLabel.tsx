import React, { memo, FC } from 'react';
import cn from 'classnames';
import { Box } from '@/uikit';
import { ToggleLabelProps } from './types';
import { DiffCount } from '../DiffCount';
import classes from './ToggleLabel.module.scss';

export const ToggleLabel: FC<ToggleLabelProps> = memo(({
    label,
    count,
    classNameCountWrap,
    isRelative = false,
}) => {
    return (
        <Box>
            {!!label && <span className={cn(classes.label, { [classes.mr]: !!isRelative })}>{label}</span>}
            {!!count && <DiffCount value={count} classNameWrap={classNameCountWrap} isRelative={isRelative} />}
        </Box>
    );
});
