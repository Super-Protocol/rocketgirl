import { memo, useMemo } from 'react';

import { Tooltip, Box, Icon } from '@/uikit';
import { TooltipTheme } from '@/uikit/Tooltip/types';
import { StatusBar } from '@/common/components/StatusBar';
import { StatusBarToolkitProps } from './types';
import { getTooltipText } from './helpers';
import classes from './StatusBarToolkit.module.scss';

export const StatusBarToolkit = memo<StatusBarToolkitProps>(({ status }) => {
    const tooltipText = useMemo(() => getTooltipText(status), [status]);
    return (
        <Box alignItems="center">
            <StatusBar status={status} />
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
    );
});
