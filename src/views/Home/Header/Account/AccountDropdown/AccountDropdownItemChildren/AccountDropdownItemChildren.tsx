import React, { memo, FC } from 'react';
import { Box, Button, CopyToClipboard } from '@/uikit';
import { AccountDropdownItemChildrenProps } from './types';
import classes from './AccountDropdownItemChildren.module.scss';

export const AccountDropdownItemChildren: FC<AccountDropdownItemChildrenProps> = memo(({
    onClick,
    label,
    title,
    eventName,
}) => {
    return (
        <Box className={classes.wrap} direction="column">
            <Box alignItems="center" className={classes.titleWrap} justifyContent="space-between">
                <Box className={classes.title}>{title}</Box>
                <Button variant="link" onClick={onClick} className={classes.btn}>{eventName}</Button>
            </Box>
            <CopyToClipboard
                isEllipsis
                notification
                isReverse
                classNameWrap={classes.label}
                classNameText={classes.text}
            >
                {label}
            </CopyToClipboard>
        </Box>
    );
});
