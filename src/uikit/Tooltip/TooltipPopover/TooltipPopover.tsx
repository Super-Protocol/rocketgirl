import { memo, FC } from 'react';
import { Popover } from 'react-bootstrap';
import cn from 'classnames';

import classes from '../Tooltip.module.scss';
import { TooltipPopoverProps } from './types';

export const TooltipPopover: FC<TooltipPopoverProps> = memo(({
    popoverProps,
    overlayProps,
    hideArrow,
    classNamePopover,
    onMouseEnter,
    onMouseLeave,
    id,
    dataTestId,
    classNamePopoverText,
    tooltip,
}) => {
    return (
        <Popover
            {...overlayProps}
            {...popoverProps}
            {...(hideArrow ? { arrowProps: { style: { display: 'none' }, ref: null as any } } : {})} /* todo any */
            className={cn(classes.popover, classNamePopover)}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            id={`popover-positioned-${id}`}
            data-testid={dataTestId}
        >
            <Popover.Content className={classNamePopoverText}>
                {tooltip || ''}
            </Popover.Content>
        </Popover>
    );
});
