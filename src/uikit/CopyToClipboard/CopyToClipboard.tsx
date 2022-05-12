import {
    memo, FC, useCallback, useMemo,
} from 'react';
import copy from 'copy-to-clipboard';

import { Box, Icon, Ellipsis } from '@/uikit';
import { LinkTo } from './LinkTo';
import toastr from '@/services/Toastr/toastr';
import { CopyToClipboardProps } from './types';
import classes from './CopyToClipboard.module.scss';

export const CopyToClipboard: FC<CopyToClipboardProps> = memo(({
    children,
    onClick = () => {},
    notification = true,
    isEllipsis = true,
    title,
    url,
}) => {
    const onCopy = useCallback((event) => {
        copy(children);
        if (notification) {
            toastr.success(`Copy: ${children}`);
        }
        onClick(event);
    }, [onClick, children, notification]);
    const element = useMemo(() => <LinkTo address={children} url={url} />, [children, url]);
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
            {isEllipsis ? <Ellipsis>{title || element}</Ellipsis> : element}
        </Box>
    );
});
