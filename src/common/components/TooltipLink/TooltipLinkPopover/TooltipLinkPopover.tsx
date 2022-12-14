import React, { memo, FC } from 'react';
import { Box, HtmlBox } from '@/uikit';
import { TooltipLinkPopoverProps } from './types';
import classes from './TooltipLinkPopover.module.scss';

export const TooltipLinkPopover: FC<TooltipLinkPopoverProps> = memo(({ title, link, text }) => {
    return (
        <Box direction="column" className={classes.tooltip}>
            <div className={classes.description}>{title}</div>
            {text && <HtmlBox text={text} />}
            {!!link && (
                <a href={link} className={classes.link}>link</a>
            )}
        </Box>
    );
});
