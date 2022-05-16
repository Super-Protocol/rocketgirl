import React, { memo, FC } from 'react';
import cn from 'classnames';
import { Tooltip } from '@/uikit';
import { TooltipTheme } from '@/uikit/Tooltip/types';
import { TooltipLinkProps } from './types';
import { TooltipLinkPopover } from './TooltipLinkPopover';
import classes from './TooltipLink.module.scss';

export const TooltipLink: FC<TooltipLinkProps> = memo(({ description, link }) => {
    return (
        <Tooltip
            tooltip={<TooltipLinkPopover description={description} link={link} />}
            placement="top"
            theme={TooltipTheme.white}
        >
            <span className={cn(classes.text, { [classes.link]: !!link })}>{description}</span>
        </Tooltip>
    );
});
