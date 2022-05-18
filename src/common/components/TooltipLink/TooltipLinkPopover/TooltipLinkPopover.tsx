import React, { memo, FC } from 'react';
import { Box } from '@/uikit';
import { TooltipLinkPopoverProps } from './types';
import classes from './TooltipLinkPopover.module.scss';

export const TooltipLinkPopover: FC<TooltipLinkPopoverProps> = memo(({ title, link, message }) => {
    return (
        <Box direction="column" className={classes.tooltip}>
            <div className={classes.description}>{title}</div>
            {message}
            {!!link && (
                <p>Link with a detailed description with the ability to click on the&nbsp;
                    <a href={link} className={classes.link}>link</a>
                </p>
            )}
        </Box>
    );
});
