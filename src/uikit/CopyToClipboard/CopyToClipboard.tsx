import { memo, FC, useCallback } from 'react';
import copy from 'copy-to-clipboard';
import { Box, Icon, Ellipsis } from '@/uikit';
import toastr from '@/services/Toastr/toastr';
import { CopyToClipboardProps } from './types';
import classes from './CopyToClipboard.module.scss';

export const CopyToClipboard: FC<CopyToClipboardProps> = memo(({
    children,
    onClick = () => {},
    notification = true,
    isEllipsis = true,
    title,
}) => {
    const onCopy = useCallback((event) => {
        copy(children);
        if (notification) {
            toastr.success(`Copy: ${children}`);
        }
        onClick(event);
    }, [onClick, children, notification]);
    if (!children && !title) return null;
    return (
        <Box alignItems="center">
            <Box>
                <Icon
                    width={14}
                    name="copy"
                    className={classes.icon}
                    onClick={onCopy}
                />
            </Box>
            {isEllipsis ? <Ellipsis>{title || children}</Ellipsis> : children}
        </Box>
    );
});
