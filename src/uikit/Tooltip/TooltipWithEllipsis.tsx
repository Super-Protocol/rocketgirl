import { FC, memo } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import { getStringWithEllipsis } from '@/utils';
import { TooltipWithEllipsisProps } from './types';
import classes from './TooltipWithEllipsis.module.scss';

export const TooltipWithEllipsis: FC<TooltipWithEllipsisProps> = memo(({ placement = 'top', children, maxLen }) => (
    <OverlayTrigger
        placement={placement}
        overlay={({ show, ...props }) => (
            <Tooltip {...props} id="panel-tooltip" bsPrefix="panel-tooltip" className={classes.overlay}>
                <div>{children}</div>
            </Tooltip>
        )}
    >
        <span>{typeof maxLen === 'number' ? getStringWithEllipsis(children, maxLen) : children}</span>
    </OverlayTrigger>
));
