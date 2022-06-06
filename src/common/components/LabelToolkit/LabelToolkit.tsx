import { ReactElement, memo } from 'react';
import cn from 'classnames';
import { Tooltip, Box, Icon } from '@/uikit';
import { TooltipTheme } from '@/uikit/Tooltip/types';
import { LabelToolkitProps } from './types';
import classes from './LabelToolkit.module.scss';

export const LabelToolkit = memo<LabelToolkitProps>(({
    children,
    tooltipText,
    title,
    classNameWrap,
}): ReactElement => (
    <Box direction="column" className={cn(classes.wrap, classNameWrap)}>
        <Box alignItems="center" className={classes.titleLine}>
            <div className={classes.title}>{title}</div>
            <Tooltip
                theme={TooltipTheme.white}
                placement="top-start"
                tooltip={tooltipText}
            >
                <Icon
                    name="info_fill2"
                    width={16}
                    height={16}
                    className={classes.iconInfo}
                />
            </Tooltip>
        </Box>
        {children}
    </Box>
));
