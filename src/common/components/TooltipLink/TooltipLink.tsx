import React, { memo, FC, useMemo } from 'react';
import cn from 'classnames';
import { Tooltip } from '@/uikit';
import { TooltipTheme } from '@/uikit/Tooltip/types';
import { TooltipLinkProps } from './types';
import { TooltipLinkPopover } from './TooltipLinkPopover';
import classes from './TooltipLink.module.scss';

export const TooltipLink: FC<TooltipLinkProps> = memo(({
    text,
    title,
    link,
    message,
}) => {
    const textBlock = useMemo(() => <span className={cn(classes.text, { [classes.link]: !!link })}>{text}</span>, [text, link]);
    if (title || message || link) {
        return (
            <Tooltip
                tooltip={<TooltipLinkPopover title={title} link={link} message={message} />}
                placement="top"
                theme={TooltipTheme.white}
            >
                {textBlock}
            </Tooltip>
        );
    }
    return textBlock;
});
